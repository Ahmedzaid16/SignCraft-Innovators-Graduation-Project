const video = document.getElementById("video");
const divvideo = document.getElementById("divvideo");
const content = document.getElementById("unity-iframe");
const startRecordingSvg = document.getElementById("startRecordingSvg");
const unityReloadButton = document.getElementById("unity-reload-button");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const videoControls = document.getElementById("videoControls");
const inputParams = document.getElementById("inputParams");

// for Video
let stream = null;
let mediaRecorder = null;
let recordedblob = [];

const get_start = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log("successful access");
    video.srcObject = stream;
    videoControls.style.display = "flex"; // Show video controls
  } catch (error) {
    console.error("Error accessing camera:", error);
    return;
  }

  recordedblob = [];

  mediaRecorder = new MediaRecorder(video.srcObject);
  mediaRecorder.ondataavailable = (e) => {
    console.log("data is available for the media recorder");
    if (e.data.size > 0) {
      recordedblob.push(e.data);
    }
  };

  mediaRecorder.start();
};

const sendVideoToApi = async () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop(); // Stop the recording to gather data
  }

  // Wait for a short time to ensure data is gathered
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (recordedblob.length === 0) {
    console.log("No data to send.");
    return;
  }

  const videoSegment = new Blob(recordedblob, { type: "video/mp4" });
  const videoDataForm = new FormData();
  videoDataForm.append("video", videoSegment);
  console.log(videoDataForm);

  try {
    const uploadResponse = await axios.post(
      `https://jennet-elegant-ferret.ngrok-free.app/upload`,
      videoDataForm,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(uploadResponse.data);

    const translation = uploadResponse.data.prediction;
    inputParams.value === ""
      ? (inputParams.value = translation)
      : (inputParams.value += " " + translation);
  } catch (err) {
    console.log(err);
  }

  // Reset the recorded blob array to start recording a new segment
  recordedblob = [];

  // Restart the media recorder to continue recording
  mediaRecorder.start();
};

startRecordingSvg.addEventListener("click", () => {
  if (localStorage.getItem("dark-mode") === "enabled") {
    unityReloadButton.style.color = "#fff";
  } else {
    unityReloadButton.style.color = "#011627";
  }
  startRecordingSvg.style.fill = "#2ec4b6";
  content.contentWindow.postMessage("START_RECORDING", "*");
  content.style.display = "none";
  divvideo.style.display = "block";
  video.style.display = "block";
  get_start();
});

unityReloadButton.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    recordedblob = [];
    const tracks = mediaRecorder.stream.getTracks();
    tracks.forEach((track) => track.stop());
  }
  video.style.display = "none";
  divvideo.style.display = "none";
  unityReloadButton.style.color = "#2ec4b6";
  if (localStorage.getItem("dark-mode") === "enabled") {
    unityReloadButton.style.color = "#fff";
    startRecordingSvg.style.fill = "#fff";
  } else {
    unityReloadButton.style.color = "#2ec4b6";
    startRecordingSvg.style.fill = "#011627";
  }
  divvideo.style.display = "none";
  video.style.display = "none";
  content.style.display = "block";
  // Reload the iframe
  content.src = "/unity";
});

function stopVideoRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    recordedblob = [];
  }
  if (localStorage.getItem("dark-mode") === "enabled") {
    startRecordingSvg.style.fill = "#fff";
  } else {
    startRecordingSvg.style.fill = "#011627";
  }
}

playButton.addEventListener("click", () => {
  sendVideoToApi();
});

pauseButton.addEventListener("click", () => {
  videoControls.style.display = "none";
  stopVideoRecording();
});

const recordButton = document.getElementById("recordButton");
const mint = document.getElementById("mint");
const spinner = document.querySelector(".spinner");
const timer = document.querySelector(".timer");
const minutesSpan = document.querySelector(".minutes");
const secondsSpan = document.querySelector(".seconds");
let mediaRecorderAudio;
let audioChunks = [];
let audioBlob = null;
let recordingStartTimeAud;
let timerInterval;

// For Audio
recordButton.addEventListener("click", async () => {
  if (mediaRecorderAudio && mediaRecorderAudio.state === "recording") {
    stopAudioRecording();
  } else {
    await startAudioRecording();
  }
});

async function startAudioRecording() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderAudio = new MediaRecorder(stream);

    mediaRecorderAudio.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorderAudio.onstart = () => {
      recordButton.classList.add("loading");
      spinner.style.display = "flex"; // Show the spinner
      timer.style.display = "flex"; // Show the timer
      recordingStartTimeAud = Date.now();
      timerInterval = setInterval(updateTimer, 1000);
    };

    mediaRecorderAudio.onstop = async () => {
      recordButton.classList.remove("loading");
      spinner.style.display = "none"; // Hide the spinner
      timer.style.display = "none"; // Hide the timer
      clearInterval(timerInterval); // Stop the timer
      minutesSpan.textContent = "0"; // Reset the minutes text
      secondsSpan.textContent = "0"; // Reset the seconds text
      mint.style.display = "none";
      minutesSpan.style.display = "none";

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      audioChunks = [];

      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);

      // Test with WAV
      const wavBlob = await convertToWav(audioBuffer);
      // const downloadLink = document.createElement("a");
      // const audioURL = window.URL.createObjectURL(wavBlob);
      // downloadLink.href = audioURL;
      // downloadLink.download = "recorded_audio.wav";
      // downloadLink.textContent = "Download recorded audio (WAV)";
      // document.body.appendChild(downloadLink);

      // Optionally, automatically click the download link
      // downloadLink.click();

      const formData = new FormData();
      formData.append(
        "file",
        new File([wavBlob], "output3.wav", { type: "audio/wav" })
      );

      try {
        const response = await axios.post(
          "http://mustafakhaled.pythonanywhere.com/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Do not set Content-Type manually
            },
          }
        );
        console.log("Upload successful:", response.data);
        // Handle the response from Express.js backend
        console.log("Transcription:", response.data.transcription);
        inputParams.value = response.data.transcription;
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };

    mediaRecorderAudio.start();
  } else {
    console.error("getUserMedia not supported on your browser!");
  }
}

async function convertToWav(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const samples = [];

  for (let channel = 0; channel < numChannels; channel++) {
    samples[channel] = audioBuffer.getChannelData(channel);
  }

  const interleaved = interleave(samples, audioBuffer.length);
  const buffer = new ArrayBuffer(44 + interleaved.length * 2);
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + interleaved.length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2 * numChannels, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, interleaved.length * 2, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < interleaved.length; i++, offset += 2) {
    const sample = Math.max(-1, Math.min(1, interleaved[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  return new Blob([view], { type: "audio/wav" });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function interleave(samples, length) {
  const interleaved = new Float32Array(length * samples.length);
  for (let sampleIndex = 0; sampleIndex < length; sampleIndex++) {
    for (let channel = 0; channel < samples.length; channel++) {
      interleaved[sampleIndex * samples.length + channel] =
        samples[channel][sampleIndex];
    }
  }
  return interleaved;
}

function stopAudioRecording() {
  if (mediaRecorderAudio && mediaRecorderAudio.state === "recording") {
    mediaRecorderAudio.stop();
    const tracks = mediaRecorderAudio.stream.getTracks();
    tracks.forEach((track) => track.stop());
  }
}

function updateTimer() {
  const elapsedSeconds = Math.floor(
    (Date.now() - recordingStartTimeAud) / 1000
  );
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  if (minutes > 0) {
    if (minutes === 1) {
      mint.style.display = "inline-block";
      minutesSpan.style.display = "inline-block";
    }
    minutesSpan.textContent = `${minutes}`;
  } else {
    minutesSpan.textContent = "0";
  }
  secondsSpan.textContent = `${seconds < 10 ? "0" + seconds : seconds}`;
}

// Function to send message to Unity iframe
function sendMessageToUnity(message) {
  if (content.contentWindow) {
    content.contentWindow.postMessage(message, "*");
  } else {
    console.error("Unity iframe not initialized.");
  }
}

startRecordingSvg.addEventListener("click", () => {
  sendMessageToUnity("START_RECORDING");
});

// Add event listener for the button to send data to Unity
document.getElementById("button1").addEventListener("click", () => {
  if (content.style.display === "none") {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      recordedblob = [];
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    video.style.display = "none";
    divvideo.style.display = "none";
    unityReloadButton.style.color = "#2ec4b6";
    content.style.display = "block";
    content.src = "/unity";
  }
  var inputText = inputParams.value;
  sendMessageToUnity(inputText);
});

// let typingTimer;
// const doneTypingInterval = 5000; // 5 seconds

// async function correct() {
//   clearTimeout(typingTimer);

//   // Start a new timer
//   typingTimer = setTimeout(async () => {
//     // Declare variables
//     var input;
//     input = document.getElementById("text");
//     filter = input.value.trim();

//     try {
//       const response = await axios.post("/proxy-process", {
//         input_text: filter,
//       });

//       // Check if response data contains 'output' key
//       if ("output" in response.data) {
//         // Access the 'output' property
//         let output = response.data.output;

//         // If 'output' is an array, take the first element
//         if (Array.isArray(output)) {
//           output = output[0];
//         }

//         // Trim the output
//         output = output.trim();

//         console.log(output);
//       } else {
//         console.error("Error: Response does not contain 'output'");
//       }
//     } catch (error) {
//       console.error("Error correcting spelling:", error);
//     }
//   }, doneTypingInterval);
// }
