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
var first = false;

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
async function updateProgress() {
  const userId = localStorage.getItem("userId");
  progress.value = (video.currentTime / video.duration) * 100;
  // Get minutes.[[
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

  const videoId = video.src; // Use video URL as identifier
  // Example assuming you have userId, videoUrl, currentTime, duration, and progress values
  if (first) {
    fetch("http://localhost:4000/updateProgress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        videoUrl: videoId,
        currentTime: video.currentTime,
        duration: video.duration,
        progress: progress.value,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Progress updated successfully!");
          // ... any additional actions after successful update ...
        } else {
          // Handle error (e.g., display error message to user)
          console.error("Error updating progress:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error updating progress:", error);
      });
  }
  first = true;
}

//Set video time to progress
async function setVideoProgress() {
  video.currentTime = (+progress.value * video.duration) / 100;
}

//Stop video
async function stopVideo() {
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

videoDisplay.addEventListener("click", (e) => {
  if (e.target == videoDisplay) {
    videoDisplay.classList.remove("show");
    video.pause();

    // Trigger progress update when closing the modal
    window.location.reload();
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

var urlParams = new URLSearchParams(window.location.search);
var code = urlParams.get("course");

async function fetchCourses() {
  try {
    const response = await fetch("http://localhost:4000/findcourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    const course = await response.json();
    // Wrap the single course object into an array
    return Array.isArray(course) ? course : [course];
  } catch (error) {
    console.error("Error fetching course:", error);
    return [];
  }
}

async function fetchProgressData(videoUrl) {
  try {
    const userId = localStorage.getItem("userId");
    const response = await fetch("http://localhost:4000/getProgress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId, // Replace userId with actual user ID
        videoUrl: videoUrl,
      }),
    });
    if (response.ok) {
      const progressData = await response.json();
      // Use progressValue as needed, e.g., updating the progress bar
      return progressData;
    } else {
      throw new Error("Failed to fetch progress data from server");
    }
  } catch (error) {
    console.error("Error fetching progress data from server:", error);
  }
}

// Modify populateCourses function to use the fetched course data
async function populateCourses() {
  try {
    const courses = await fetchCourses();
    // Check if courses is an array
    if (!Array.isArray(courses)) {
      throw new Error("Courses data is not an array");
    }
    // Populate HTML with course data
    for (const course of courses) {
      // Use for...of loop to allow asynchronous code
      courseName.textContent = course.name;
      duration.textContent = course.duration;

      let lessonHTML = "";
      for (let index = 0; index < course.Lessondescription.length; index++) {
        const lesson = course.Lessondescription[index];
        const videoUrl = course.listvideoUrl[index];
        const progressData = await fetchProgressData(videoUrl);
        const progressValue = progressData ? progressData.progress : 0;
        lessonHTML += `
        <div class="box" onclick="openLessonVideo('${videoUrl}')">
          <i class="fa-solid fa-circle-play"></i>
          <p class="lesson">${index + 1}.${lesson}</p>
          <div class="progress-courses p-relative">
            <span class="blue" style="width: ${progressValue}%">
              <span class="bg-blue">${progressValue}%</span>
            </span>
          </div>
        </div>`;
      }
      // Set the HTML content for the contentLessons element
      lessons.innerHTML = lessonHTML;
    }
  } catch (error) {
    console.error("Error populating courses:", error);
  }
}

// Function to open lesson video
// Load progress from local storage when opening a lesson
async function openLessonVideo(videoUrl) {
  video.src = videoUrl;
  videoDisplay.classList.add("show");

  const progressData = await fetchProgressData(videoUrl);
  if (progressData) {
    video.currentTime = progressData.currentTime;
    progress.value = progressData.progress;
  }
}

// Call the populateCourses function when the DOM is loaded
document.addEventListener("DOMContentLoaded", populateCourses);
