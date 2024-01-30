// Function to load a YouTube video into the specified iframe
function loadVideo(videoSource) {
  // Get the iframe element by its ID
  var iframe = document.getElementById("lesson-iframe");
  // Create the new source URL for the YouTube video using the provided video source ID
  var newSrc = "https://www.youtube.com/embed/" + videoSource;
  // Set the iframe's source to the new URL, loading the specified video
  iframe.src = newSrc;
}

// Function to load a video into the specified video container and update the active lesson
function loadVideo2(videoSource) {
  // Get the container element that holds the videos
  var videosContainer = document.getElementById("videos");
  // Set the inner HTML of the videos container to include a video element with controls and autoplay
  videosContainer.innerHTML = `<video id="video-of-lesson" src="" controls autoplay></video>`;
  // Get the video element by its ID
  var videoOfLesson = document.getElementById("video-of-lesson");
  // Create the new source URL for the video using the provided video source
  var newSrc = "videos/" + videoSource;
  // Set the video element's source to the new URL, loading the specified video
  videoOfLesson.src = newSrc;
  // Get all elements with the "li" tag (assumed to be lesson elements)
  var allLessonElements = document.querySelectorAll("li");
  // Remove the "active-lesson" class from all lesson elements
  allLessonElements.forEach(function (element) {
    element.classList.remove("active-lesson");
  });
  // Get the clicked element by its ID
  var clickedElement = document.getElementById(videoSource);
  // Add the "active-lesson" class to the clicked lesson element, marking it as active
  clickedElement.classList.add("active-lesson");
}

// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  // Get references to important elements in the HTML document
  var videosContainer = document.getElementById("videos");
  var iframe = document.getElementById("lesson-iframe");
  var ul = document.getElementById("lessons-video");
  // Parse URL parameters to determine the course type
  var urlParams = new URLSearchParams(window.location.search);
  var courseLink = urlParams.get("course");
  // Check the course type and load corresponding content
  if (courseLink === "egyptian") {
    // Set the initial video source for the Egyptian course
    var newSrc =
      "https://www.youtube.com/embed/watch?v=Tw44A1185uc&list=PLaQzmDaYayMCuW3Y0LhKnYON8u5_QQYsW&index=1&ab_channel=هحببكفىالإشارة";
    iframe.src = newSrc;
    // Define an array of lesson data for the Egyptian course
    var lessonsEgyptianData = [
      { id: "Tw44A1185uc", index: 1 },
      { id: "MuVrNSmBkxo", index: 2 },
      { id: "QdgQfTQsJfY", index: 3 },
      { id: "YNUKpiHT-Hs", index: 4 },
      { id: "pDuIpvUF6WY", index: 5 },
      { id: "YEoM31uvBSs", index: 6 },
      { id: "jUc7tat2EwU", index: 7 },
      { id: "LQrdyMBg5to", index: 8 },
      { id: "O_ifFcw9Nys", index: 9 },
      { id: "dBBYbFmT55c", index: 10 },
      { id: "S5uFRBrn1Sk", index: 11 },
      { id: "oGqzEtz6Cqs", index: 12 },
      { id: "-qTCsl9hDPQ", index: 13 },
      { id: "7RDnVq8NWi8", index: 14 },
      { id: "ju6p5v1XVn8", index: 15 },
      { id: "8-2njSIPaoo", index: 16 },
      { id: "KpbwLDiUDaM", index: 17 },
      { id: "rQTFL8aemn4", index: 18 },
      { id: "3CGj-2ipuK0", index: 19 },
      { id: "h92VztuIvNw", index: 20 },
      { id: "SlNRUfgpblw", index: 21 },
      { id: "XM0TOfAw8_8", index: 22 },
      { id: "nPfcYjdEeBU", index: 23 },
      { id: "T53Jm0SfAS8", index: 24 },
    ];
    // Populate the lesson list (ul) with links based on lesson data
    ul.innerHTML = lessonsEgyptianData
      .map(
        (lesson) => `
    <li
      id="watch?v=${lesson.id}&list=PLaQzmDaYayMCuW3Y0LhKnYON8u5_QQYsW&index=${lesson.index}&ab_channel=هحببكفىالإشارة"
      onclick="loadVideo('watch?v=${lesson.id}&list=PLaQzmDaYayMCuW3Y0LhKnYON8u5_QQYsW&index=${lesson.index}&ab_channel=هحببكفىالإشارة')"
    >
      lesson ${lesson.index}
    </li>`
      )
      .join("");
  } else if (courseLink === "arsl-with-caption") {
    // Set the initial video source for the ArSL with caption course
    videosContainer.innerHTML = `<video id="video-of-lesson" src="videos/adult-courses/ArSl-with-caption/ArSl-with-caption (1).mp4" controls autoplay></video>`;
    // Clear the lesson list for this course type
    ul.innerHTML = "";
    // Populate the lesson list based on the number of lessons
    for (let index = 1; index <= 15; index++) {
      const isActive = index === 1;
      ul.innerHTML += `
        <li
            ${isActive ? 'class="active-lesson"' : ""} 
            id="adult-courses/ArSl-with-caption/ArSl-with-caption (${index}).mp4"
            onclick="loadVideo2('adult-courses/ArSl-with-caption/ArSl-with-caption (${index}).mp4')"
        >
            lesson ${index}
        </li>`;
    }
  } else {
    // Set the initial video source for the default course type (kids-courses)
    videosContainer.innerHTML = `<video id="video-of-lesson" src="videos/kids-courses/Primary School ArSL/kids-arsl (1).mp4" controls autoplay></video>`;
    // Clear the lesson list for this course type
    ul.innerHTML = "";
    // Populate the lesson list based on the number of lessons
    for (let index = 1; index <= 23; index++) {
      const isActive = index === 1;
      ul.innerHTML += `
        <li
            ${isActive ? 'class="active-lesson"' : ""} 
            id="kids-courses/Primary School ArSL/kids-arsl (${index}).mp4"
            onclick="loadVideo2('kids-courses/Primary School ArSL/kids-arsl (${index}).mp4')"
        >
            lesson ${index}
        </li>`;
    }
  }
});
