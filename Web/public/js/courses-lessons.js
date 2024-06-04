const video = document.getElementById("video");
const play = document.getElementById("play");
const stop = document.getElementById("stop");
const progress = document.getElementById("progress");
const timestamp = document.getElementById("timestamp");
const lessons = document.getElementById("coures-content");
const courseName = document.getElementById("course-name");
const videoDuration = document.getElementById("video-duration");
const videoDisplay = document.getElementById("video-display");
const duration = document.getElementById("durationCourse");
const full = document.getElementById("full");
const volumeBtn = document.querySelector(".controls .volume i");
const volumeSlider = document.querySelector(".controls .volume input");

let lastProgressUpdate = -1; // Initialize to -1 to ensure the first update
let first = false;

function toggleVideoStatus() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function updatePlayIcon() {
  if (video.paused) {
    play.innerHTML = '<i class="fa-solid fa-play fa-2x"></i>';
  } else {
    play.innerHTML = '<i class="fa-solid fa-pause fa-2x"></i>';
  }
}

async function updateProgress() {
  let currentProgress = (video.currentTime / video.duration) * 100;
  currentProgress = parseFloat(currentProgress.toFixed(1)); // Format to one decimal place
  progress.value = currentProgress;

  // Get minutes and seconds for current time
  let mins = Math.floor(video.currentTime / 60);
  let secs = Math.floor(video.currentTime % 60);
  if (mins < 10) {
    mins = "0" + mins;
  }
  if (secs < 10) {
    secs = "0" + secs;
  }

  // Get minutes and seconds for video duration
  let currentMins = Math.floor(video.duration / 60);
  let currentSecs = Math.floor(video.duration % 60);

  timestamp.innerHTML = `${mins}:${secs}`;
  videoDuration.innerHTML = `${currentMins}:${currentSecs}`;

  if (first && Math.abs(currentProgress - lastProgressUpdate) >= 1) {
    const videoId = video.src;
    console.log(
      `Updating progress from ${lastProgressUpdate} to ${currentProgress}`
    );

    try {
      const response = await fetch("/updateProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl: videoId,
          currentTime: video.currentTime,
          duration: video.duration,
          progress: currentProgress,
        }),
      });

      if (response.ok) {
        console.log("Progress updated successfully!");
        lastProgressUpdate = currentProgress;
      } else {
        console.error("Error updating progress:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  }
  first = true;
}

function setVideoProgress() {
  video.currentTime = (+progress.value * video.duration) / 100;
}

function stopVideo() {
  video.currentTime = 0;
  video.pause();
}

video.addEventListener("click", toggleVideoStatus);
video.addEventListener("pause", updatePlayIcon);
video.addEventListener("play", updatePlayIcon);
video.addEventListener("timeupdate", updateProgress);
play.addEventListener("click", toggleVideoStatus);
stop.addEventListener("click", stopVideo);
progress.addEventListener("change", setVideoProgress);

videoDisplay.addEventListener("click", (e) => {
  if (e.target == videoDisplay) {
    videoDisplay.classList.remove("show");
    video.pause();
    window.location.reload();
  }
});

full.addEventListener("click", function () {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
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

async function openLessonVideo(videoUrl) {
  try {
    const response = await fetch(
      `/getProgress?videoUrl=${encodeURIComponent(videoUrl)}`
    );
    if (response.ok) {
      const data = await response.json();
      video.src = videoUrl;
      video.currentTime = data.currentTime || 0; // Set the video's current time
      videoDisplay.classList.add("show");
    } else {
      console.error("Error fetching progress:", response.statusText);
      video.src = videoUrl; // Fallback to starting from the beginning if there's an error
      videoDisplay.classList.add("show");
    }
  } catch (error) {
    console.error("Error fetching progress:", error);
    video.src = videoUrl; // Fallback to starting from the beginning if there's an error
    videoDisplay.classList.add("show");
  }
}
