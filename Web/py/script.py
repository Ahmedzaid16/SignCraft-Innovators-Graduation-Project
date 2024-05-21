# import cv2
import sys
# import gc
# import numpy as np
# import mediapipe as mp
# import multiprocessing
# from omegaconf import OmegaConf
# # from openhands.apis.inference import InferenceModel
# from joblib import delayed
# from natsort import natsorted
# from glob import glob

# mp_holistic = mp.solutions.holistic
# # x = mp_holistic.Holistic(static_image_mode=False, model_complexity=2)
# N_FACE_LANDMARKS = 468
# N_BODY_LANDMARKS = 33
# N_HAND_LANDMARKS = 21




# class Counter(object):
#     # https://stackoverflow.com/a/47562583/
#     def __init__(self, initval=0):
#         self.val = multiprocessing.RawValue("i", initval)
#         self.lock = multiprocessing.Lock()

#     def increment(self):
#         with self.lock:
#             self.val.value += 1

#     @property
#     def value(self):
#         return self.val.value


# def process_body_landmarks(component, n_points):
#     kps = np.zeros((n_points, 3))
#     conf = np.zeros(n_points)
#     if component is not None:
#         landmarks = component.landmark
#         kps = np.array([[p.x, p.y, p.z] for p in landmarks])
#         conf = np.array([p.visibility for p in landmarks])
#     return kps, conf



# def process_other_landmarks(component, n_points):
#     kps = np.zeros((n_points, 3))
#     conf = np.zeros(n_points)
#     if component is not None:
#         landmarks = component.landmark
#         kps = np.array([[p.x, p.y, p.z] for p in landmarks])
#         conf = np.ones(n_points)
#     return kps, conf



# def get_holistic_keypoints( frames, holistic=mp_holistic.Holistic(static_image_mode=False, model_complexity=2)):
# #     """
# #     For videos, it's optimal to create with `static_image_mode=False` for each video.
# #     https://google.github.io/mediapipe/solutions/holistic.html#static_image_mode
# #     """

#     keypoints = []
#     confs = []

#     for frame in frames:
#         results = holistic.process(frame)

#         body_data, body_conf = process_body_landmarks(results.pose_landmarks, N_BODY_LANDMARKS)
#         face_data, face_conf = process_other_landmarks(results.face_landmarks, N_FACE_LANDMARKS)
#         lh_data, lh_conf = process_other_landmarks(results.left_hand_landmarks, N_HAND_LANDMARKS)
#         rh_data, rh_conf = process_other_landmarks(results.right_hand_landmarks, N_HAND_LANDMARKS)

#         data = np.concatenate([body_data, face_data, lh_data, rh_data])
#         conf = np.concatenate([body_conf, face_conf, lh_conf, rh_conf])

#         keypoints.append(data)
#         confs.append(conf)

#     # TODO: Reuse the same object when this issue is fixed: https://github.com/google/mediapipe/issues/2152
#     holistic.reset()
#     del holistic
#     gc.collect()

#     keypoints = np.stack(keypoints)
#     confs = np.stack(confs)
#     return keypoints, confs




# def gen_keypoints_for_frames(frames):

#     pose_kps, pose_confs = get_holistic_keypoints(frames)
#     body_kps = np.concatenate([pose_kps[:, :33, :], pose_kps[:, 501:, :]], axis=1)

#     confs = np.concatenate([pose_confs[:, :33], pose_confs[:, 501:]], axis=1)

#     d = {"keypoints": body_kps, "confidences": confs}
#     return d



# def load_frames_from_video(video_path):
#     frames = []
#     vidcap = cv2.VideoCapture(video_path)
#     while vidcap.isOpened():
#         success, img = vidcap.read()
#         if not success:
#             break
#         img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#         # img = cv2.resize(img, (640, 480))
#         frames.append(img)

#     vidcap.release()
#     # cv2.destroyAllWindows()
#     return np.asarray(frames)



# #expected to reseive an array of framaes of shape (#frames,w,h,#chanels) ex: (47, 720, 1280, 3)
# def gen_keypoints_for_video(video_path):
#     '''
#     input: expected to reseive an array of frames of shape (#frames,w,h,#chanels) ex: (47, 720, 1280, 3)
#     output: the keypoints for the input video. keypoints are dict object with keypoints and confidences as keys
#     '''
#     # video = np.asarray(video)
#     vid_frames = load_frames_from_video(video_path)
#     keypoints = gen_keypoints_for_frames(vid_frames)
#     return keypoints



# def init():
#     cfg = OmegaConf.load("E:/Web/py/decoupled_gcn.yaml")
#     model = InferenceModel(cfg=cfg)
#     model.init_from_checkpoint_if_available()
#     return model

# def test_model(model):
#     #model.my_test_inference(test_file)
#     pred = model.test_inference()

# def custom_test(model,test_file):
    #model.my_test_inference(test_file)
    # pred = model.my_test_inference(test_file)
    # return pred


if __name__ == '__main__':

    video_path = sys.argv[1]
    # inference_model = init()
    # output_to_script = gen_keypoints_for_video(video_path)
    # output_to_script = custom_test(inference_model,output_to_script)
    # print(output_to_script)
    print('OK')
    #sys.stdout.flush()

# المسار الخاص بالفيديو 
#video_path = sys.argv[1]
#print(video_path)
# الاراي الي هتدخل للموديل 
# inference_model = init()
# output_to_script = gen_keypoints_for_video(video_path)
# output_to_script = custom_test(inference_model,output_to_script)
#print(video_path)
#sys.stdout.flush()
