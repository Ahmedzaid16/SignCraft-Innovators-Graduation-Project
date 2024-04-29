const video = document.getElementById("video");
const play = document.getElementById("play");
const stop = document.getElementById("stop");
const progress = document.getElementById("progress");
const timestamp = document.getElementById("timestamp");
const videoDuration = document.getElementById("video-duration");
const videoDisplay = document.getElementById("video-display");
const videoOne = document.getElementById("one");
const full = document.getElementById("full");
const volumeBtn = document.querySelector(".controls .volume i");
const volumeSlider = document.querySelector(".controls .volume input");

videoOne.addEventListener("click", () => {
  videoDisplay.classList.add("show");
});

//Pause & play video
function toggleVideoStatus() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

//Update Pause & play icon
function updatePlayIcon() {
  if (video.paused) {
    play.innerHTML = '<i class="fa-solid fa-play fa-2x"></i>';
  } else {
    play.innerHTML = '<i class="fa-solid fa-pause fa-2x"></i>';
  }
}

//Update progress & timestamp
function updateProgress() {
  progress.value = (video.currentTime / video.duration) * 100;

  // Get minutes
  let mins = Math.floor(video.currentTime / 60);
  if (mins < 10) {
    mins = "0" + String(mins);
  }

  let currentMins = Math.floor(video.duration / 60);
  let currentSecs = Math.floor(video.duration % 60);

  // Get minutes
  let secs = Math.floor(video.currentTime % 60);
  if (secs < 10) {
    secs = "0" + String(secs);
  }

  timestamp.innerHTML = `${mins}:${secs}`;
  videoDuration.innerHTML = `${currentMins}:${currentSecs}`;
}

//Set video time to progress
function setVideoProgress() {
  video.currentTime = (+progress.value * video.duration) / 100;
}

//Stop video
function stopVideo() {
  video.currentTime = 0;
  video.pause();
}

// Event listeners
video.addEventListener("click", toggleVideoStatus);
video.addEventListener("pause", updatePlayIcon);
video.addEventListener("play", updatePlayIcon);
video.addEventListener("timeupdate", updateProgress);
play.addEventListener("click", toggleVideoStatus);
stop.addEventListener("click", stopVideo);
progress.addEventListener("change", setVideoProgress);

// Hide modal on outside click
window.addEventListener("click", (e) => {
  if (e.target == videoDisplay) {
    videoDisplay.classList.remove("show");
    video.pause();
  }
});

full.addEventListener("click", function () {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    /* Firefox */
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    /* Chrome, Safari & Opera */
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    /* IE/Edge */
    video.msRequestFullscreen();
  }
});

volumeBtn.addEventListener("click", () => {
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    video.volume = 0.5;
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    video.volume = 0.0;
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  volumeSlider.value = video.volume;
});

volumeSlider.addEventListener("input", (e) => {
  video.volume = e.target.value;
  if (e.target.value == 0) {
    return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
});

console.log(video.duration);
