const video = document.getElementById("video");
const recorded_v_elem = document.querySelector("#display_video");
const divvideo = document.getElementById("divvideo");
const content = document.getElementById("unity-iframe");
const startRecordingSvg = document.getElementById("startRecordingSvg");
const unityReloadButton = document.getElementById("unity-reload-button");

// for Video
let stream = null;
let mediaRecorder = null;
let recordedblob = [];
let record_bl = null;
let translationLabel = null; // Keep track of translation label

const get_start = async () => {
  // Remove the translation label if it exists
  if (translationLabel) {
    translationLabel.remove();
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log("successful access");
    video.srcObject = stream;
  } catch (error) {
    console.error("Error accessing camera:", error);
    return;
  }

  recordedblob = [];

  mediaRecorder = new MediaRecorder(video.srcObject);
  mediaRecorder.ondataavailable = (e) => {
    console.log("data is available for the media recorder");
    recordedblob.push(e.data);
  };

  mediaRecorder.start();

  setTimeout(() => {
    mediaRecorder.stop();
    const track = stream.getTracks();
    track[0].stop();
    console.log("successful stop");
  }, 3000); // Automatically stop recording after 3 seconds

  mediaRecorder.onstop = async () => {
    video.style.display = "none";
    recorded_v_elem.style.display = "block";

    const superbuffer = new Blob(recordedblob, { type: "video/mp4" });
    recorded_v_elem.src = window.URL.createObjectURL(superbuffer);
    recorded_v_elem.controls = true;

    recorded_v_elem.onloadedmetadata = () => {
      recorded_v_elem.play().catch((error) => {
        console.log("Error playing video:", error);
      });
    };

    record_bl = new Blob(recordedblob, { type: "video/mp4" });

    // Automatically send the video for translation
    const videoDataForm = new FormData();
    videoDataForm.append("video", record_bl);
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
      translationLabel = document.createElement("div");
      translationLabel.setAttribute("id", "translationLabel");
      translationLabel.innerHTML = `<div><label> the translation </label></div> <br> <div>
              <label style="resize:none; background-color:#fff; color:black; border-radius: 10px; padding:10px; margin: 20px 5px;">${translation}<label></div>`;
      divvideo.appendChild(translationLabel);
    } catch (err) {
      console.log(err);
    }
  };
};

startRecordingSvg.addEventListener("click", () => {
  unityReloadButton.style.color = "black";
  startRecordingSvg.style.fill = "#2ec4b6";
  content.contentWindow.postMessage("START_RECORDING", "*");
  content.style.display = "none";
  divvideo.style.display = "block";
  video.style.display = "block";
  recorded_v_elem.style.display = "none";
  get_start();
});

unityReloadButton.addEventListener("click", () => {
  unityReloadButton.style.color = "#2ec4b6";
  startRecordingSvg.style.fill = "black";
  divvideo.style.display = "none";
  recorded_v_elem.style.display = "none";
  video.style.display = "none";
  content.style.display = "block";
  // Reload the iframe
  const unityIframe = document.getElementById("unity-iframe");
  unityIframe.src = "/unity";
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

const recordButton = document.getElementById("recordButton");
const mint = document.getElementById("mint");
const spinner = document.querySelector(".spinner");
const timer = document.querySelector(".timer");
const minutesSpan = document.querySelector(".minutes");
const secondsSpan = document.querySelector(".seconds");
let mediaRecorderAudio;
let audioChunks = [];
let recordingStartTime;
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
      recordingStartTime = Date.now();
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

      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      audioChunks = [];

      await uploadToServer(audioBlob);
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
  const elapsedSeconds = Math.floor((Date.now() - recordingStartTime) / 1000);
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

async function uploadToServer(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");

  try {
    const response = await fetch("/uploadAudio", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("Upload successful:", data);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
