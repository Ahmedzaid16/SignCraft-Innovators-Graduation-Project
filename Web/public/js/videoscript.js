const video = document.getElementById("video");
const divvideo = document.getElementById("divvideo");
const content = document.getElementById("unity-iframe");
const startRecordingSvg = document.getElementById("startRecordingSvg");
const unityReloadButton = document.getElementById("unity-reload-button");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const videoControls = document.getElementById("videoControls");

// for Video
let stream = null;
let mediaRecorder = null;
let recordedblob = [];
let record_bl = null;
let translationLabel = null; // Keep track of translation label

let recordingStartTime = null;
let lastSendTime = null;

const get_start = async () => {
  // Remove the translation label if it exists
  if (translationLabel) {
    translationLabel.remove();
    translationLabel = null;
  }

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
  recordingStartTime = new Date(); // Mark the start time of recording
  lastSendTime = recordingStartTime; // Initialize last send time
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

    const currentTime = new Date();
    const segmentStartTime = lastSendTime;
    const segmentEndTime = currentTime;
    lastSendTime = currentTime; // Update last send time

    if (!translationLabel) {
      translationLabel = document.createElement("div");
      translationLabel.setAttribute("id", "translationLabel");
      divvideo.appendChild(translationLabel);
    }

    const newTranslation = document.createElement("div");
    newTranslation.style.marginTop = "5px";
    const url = URL.createObjectURL(videoSegment);
    newTranslation.innerHTML = `
      <strong>Segment from ${segmentStartTime.toLocaleTimeString()} to ${segmentEndTime.toLocaleTimeString()}:</strong>
      <label style="resize:none; background-color:#fff; color:black; border-radius: 10px; padding:10px; margin: 5px;">${translation}</label>
      <a href="${url}" download="segment_${segmentStartTime
      .toLocaleTimeString()
      .replace(/:/g, "_")}_${segmentEndTime
      .toLocaleTimeString()
      .replace(/:/g, "_")}.mp4">Download the recorded segment</a>
    `;
    translationLabel.appendChild(newTranslation);
  } catch (err) {
    console.log(err);
  }

  // Reset the recorded blob array to start recording a new segment
  recordedblob = [];

  // Restart the media recorder to continue recording
  mediaRecorder.start();
};

startRecordingSvg.addEventListener("click", () => {
  unityReloadButton.style.color = "black";
  startRecordingSvg.style.fill = "#2ec4b6";
  content.contentWindow.postMessage("START_RECORDING", "*");
  content.style.display = "none";
  divvideo.style.display = "block";
  video.style.display = "block";
  get_start();
});

unityReloadButton.addEventListener("click", () => {
  stopVideoRecording();
  unityReloadButton.style.color = "#2ec4b6";
  startRecordingSvg.style.fill = "black";
  divvideo.style.display = "none";
  video.style.display = "none";
  content.style.display = "block";
  // Reload the iframe
  content.src = "/unity";
});

function stopVideoRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    const tracks = video.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
  }
  video.style.display = "none";
  divvideo.style.display = "none";
}

playButton.addEventListener("click", () => {
  sendVideoToApi();
});

pauseButton.addEventListener("click", () => {
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

      audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      audioChunks = [];
      const formData = new FormData();
      formData.append(
        "file",
        new File([audioBlob], "output.wav", { type: "audio/wav" })
      );
      // formData.append(
      //   "file",
      //   new File([audioBlob], "output.wav", { type: "audio/wav" })
      // );

      try {
        const response = await axios.post(
          "https://203e-41-43-246-7.ngrok-free.app/upload",
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
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };

    mediaRecorderAudio.start();
  } else {
    console.error("getUserMedia not supported on your browser!");
  }
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

// async function uploadToServer(audioBlob) {
//   const formData = new FormData();
//   formData.append(
//     "file",
//     new File([audioBlob], "output.wav", { type: "audio/wav" })
//   );

//   try {
//     const response = await axios.post(
//       "https://0917-41-43-246-7.ngrok-free.app/upload",
//       formData,
//       {
//         headers: {
//           // "Content-Type": "multipart/form-data", // Do not set Content-Type manually
//         },
//       }
//     );
//     console.log("Upload successful:", response.data);
//     // Handle the response from Express.js backend
//     console.log("Transcription:", response.data.transcription);
//   } catch (error) {
//     console.error("Upload failed:", error);
//   }
// }

// Function to send message to Unity iframe
function sendMessageToUnity(message) {
  if (content.contentWindow) {
    content.contentWindow.postMessage(message, "*");
  }
}

startRecordingSvg.addEventListener("click", () => {
  sendMessageToUnity("START_RECORDING");
});

unityReloadButton.addEventListener("click", () => {
  sendMessageToUnity("STOP_RECORDING");
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
