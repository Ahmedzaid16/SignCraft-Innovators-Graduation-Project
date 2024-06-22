from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import speech_recognition as sr
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'samples'
ALLOWED_EXTENSIONS = {'wav', 'aiff', 'flac', 'mp3', 'm4a'}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_to_wav(filepath, filename):
    file_extension = filename.rsplit('.', 1)[1].lower()
    wav_filename = filename.rsplit('.', 1)[0] + '.wav'
    wav_filepath = os.path.join(app.config['UPLOAD_FOLDER'], wav_filename)

    if file_extension == 'mp3':
        audio = AudioSegment.from_mp3(filepath)
    elif file_extension == 'aiff':
        audio = AudioSegment.from_file(filepath, 'aiff')
    elif file_extension == 'flac':
        audio = AudioSegment.from_file(filepath, 'flac')
    elif file_extension == 'm4a':
        audio = AudioSegment.from_file(filepath, 'm4a')
    else:
        return filepath  # No conversion needed for WAV

    audio.export(wav_filepath, format='wav')
    return wav_filepath

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        # Convert the file to WAV if necessary
        wav_filepath = convert_to_wav(filename, file.filename)

        # Perform transcription using SpeechRecognition
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_filepath) as audio_file:
            audio_data = recognizer.record(audio_file)
            # Specify the language as 'ar-EG' for Egyptian Arabic
            transcription = recognizer.recognize_google(audio_data, language='ar-EG')

        return jsonify({"transcription": transcription})
    else:
        return jsonify({"error": "File type not allowed"}), 400

if __name__ == '__main__':
    app.run(debug=True)
