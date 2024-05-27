import os
import warnings
import multiprocessing as mp
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import cv2
import mediapipe as mp_solutions
import numpy as np
import gc
from omegaconf import OmegaConf
from openhands.apis.inference import InferenceModel
# Suppress TensorFlow and Protobuf warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow logging
warnings.filterwarnings("ignore", category=UserWarning, module='google.protobuf.symbol_database')

app = Flask(__name__)
CORS(app)
N_FACE_LANDMARKS = 468
N_BODY_LANDMARKS = 33
N_HAND_LANDMARKS = 21
BATCH_SIZE = 16  # Define a suitable batch size
POOL = None
MODEL = None
mp_holistic = mp_solutions.solutions.holistic.Holistic(static_image_mode=False, model_complexity=2)
def init_pool(n_cores):
    global POOL
    if POOL is None:
        POOL = mp.Pool(n_cores)

def init_model():
    global MODEL
    if MODEL is None:
        cfg = OmegaConf.load("decoupled_gcn.yaml")
        MODEL = InferenceModel(cfg=cfg)
        MODEL.init_from_checkpoint_if_available()

# Define functions to process landmarks
def process_body_landmarks(component, n_points):
    kps = np.zeros((n_points, 3))
    conf = np.zeros(n_points)
    if component is not None:
        landmarks = component.landmark
        kps = np.array([[p.x, p.y, p.z] for p in landmarks])
        conf = np.array([p.visibility for p in landmarks])
    return kps, conf

def process_other_landmarks(component, n_points):
    kps = np.zeros((n_points, 3))
    conf = np.zeros(n_points)
    if component is not None:
        landmarks = component.landmark
        kps = np.array([[p.x, p.y, p.z] for p in landmarks])
        conf = np.ones(n_points)
    return kps, conf

# Define the function to extract holistic keypoints from frames
def get_holistic_keypoints(frames):
    holistic = mp_holistic
    keypoints = []
    confs = []

    for i in range(0, len(frames), BATCH_SIZE):
        batch_frames = frames[i:i + BATCH_SIZE]
        batch_keypoints = []
        batch_confs = []

        for frame in batch_frames:
            results = holistic.process(frame)

            body_data, body_conf = process_body_landmarks(results.pose_landmarks, N_BODY_LANDMARKS)
            face_data, face_conf = process_other_landmarks(results.face_landmarks, N_FACE_LANDMARKS)
            lh_data, lh_conf = process_other_landmarks(results.left_hand_landmarks, N_HAND_LANDMARKS)
            rh_data, rh_conf = process_other_landmarks(results.right_hand_landmarks, N_HAND_LANDMARKS)

            data = np.concatenate([body_data, face_data, lh_data, rh_data])
            conf = np.concatenate([body_conf, face_conf, lh_conf, rh_conf])

            batch_keypoints.append(data)
            batch_confs.append(conf)

        keypoints.extend(batch_keypoints)
        confs.extend(batch_confs)
    
    holistic.reset()
    del holistic
    gc.collect()

    keypoints = np.stack(keypoints)
    confs = np.stack(confs)
    return keypoints, confs

# Function to generate keypoints for frames
def gen_keypoints_for_frames(frames):
    pose_kps, pose_confs = get_holistic_keypoints(frames)
    body_kps = np.concatenate([pose_kps[:, :33, :], pose_kps[:, 501:, :]], axis=1)
    confs = np.concatenate([pose_confs[:, :33], pose_confs[:, 501:]], axis=1)

    d = {"keypoints": body_kps, "confidences": confs}
    return d

# Function to load frames from a video
def load_frames_from_video(video_path):
    frames = []
    vidcap = cv2.VideoCapture(video_path)
    while vidcap.isOpened():
        success, img = vidcap.read()
        if not success:
            break
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        frames.append(img)

    vidcap.release()
    return np.asarray(frames)

# Function to generate keypoints for a video segment
def gen_keypoints_for_video_segment(segment_frames):
    keypoints = gen_keypoints_for_frames(segment_frames)
    return keypoints

# Function to divide the video frames into segments
def divide_into_segments(frames, n_segments):
    segment_size = len(frames) // n_segments
    segments = [frames[i*segment_size : (i+1)*segment_size] for i in range(n_segments)]
    if len(frames) % n_segments != 0:
        remaining_frames = frames[n_segments*segment_size:]
        segments[-1] = np.concatenate([segments[-1], remaining_frames], axis=0)
    return segments

# Function to generate keypoints for a video using multiprocessing
def gen_keypoints_for_video(video_path, pool):
    vid_frames = load_frames_from_video(video_path)
    print(f"Loaded {len(vid_frames)} frames")

    n_cores = pool._processes  # Get the number of cores from the pool
    segments = divide_into_segments(vid_frames, n_cores)
    print(f"Divided into {len(segments)} segments")

    results = pool.map(gen_keypoints_for_video_segment, segments)
    print("Completed multiprocessing")

    # Combine results from all segments
    keypoints = np.concatenate([result['keypoints'] for result in results], axis=0)
    confidences = np.concatenate([result['confidences'] for result in results], axis=0)
    
    return {"keypoints": keypoints, "confidences": confidences}

def custom_test(model, keypoints):
    pred = model.my_test_inference(keypoints)
    return pred

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'video' not in request.files:
        return "No file part"
    file = request.files['video']
    if file.filename == '':
        return "No selected file"
    if file:
        # Ensure the uploads directory exists
        upload_dir = 'uploads'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        video_path = os.path.join(upload_dir, file.filename)
        file.save(video_path)
        
        keypoints = gen_keypoints_for_video(video_path, POOL)
        
        # Custom test with the model
        prediction = custom_test(MODEL, keypoints)
        
        # Clean up the uploaded video file
        os.remove(video_path)
        gc.collect()
        return jsonify({
            "prediction": prediction
        })

if __name__ == "__main__":
    init_pool(min(6, mp.cpu_count()))  # Initialize the pool with the desired number of cores
    init_model()  # Initialize the model
    app.run(debug=True)
