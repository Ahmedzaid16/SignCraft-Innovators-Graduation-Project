// Function to toggle the visibility of content
function toggleContent() {
  // Get the plus or minus icon element by id
  var plusMinusIcon = document.getElementById("icon");
  // Get the content element
  var content = document.getElementById("section1-content");
  // Toggle the "show" class on the content element to control visibility
  content.classList.toggle("show");
  // Check if the "show" class is present after the toggle and update the plus/minus icon
  if (content.classList.contains("show")) {
    // If content is visible, change icon to minus
    plusMinusIcon.classList.remove("fa-plus");
    plusMinusIcon.classList.add("fa-minus");
  } else {
    // If content is hidden, change icon to plus
    plusMinusIcon.classList.remove("fa-minus");
    plusMinusIcon.classList.add("fa-plus");
  }
}

// This Function Show or Hide an image Based on the Scroll Position
function showImageOnScroll() {
  // Define the scroll threshold (in pixels) to trigger the image visibility.
  const scrollThreshold = 400;
  // Check if the User has Scrolled beyond the defined threshold
  const isScrolled = window.scrollY > scrollThreshold;
  // Select the image element (div) with the id
  const bottomLeftImage = document.getElementById("bottom");
  /* Set the display of the image (div) based on the scroll condition 
   If scrolled, set display to "block" (visible) ; otherwise, set it "none" (hidden) */
  bottomLeftImage.style.display = isScrolled ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", function () {
  // Call the function to handle initial state
  showImageOnScroll();
  // Add a scroll event listener to trigger the function when the user scrolls.
  window.addEventListener("scroll", showImageOnScroll);

  // Select the Elements with their IDs
  var intro = document.getElementById("intro");
  var courseName = document.getElementById("course-name");
  var categorie = document.getElementById("categorie");
  var duration = document.getElementById("duration");
  var about = document.getElementById("about");
  var aboutImg = document.getElementById("about-img");
  var benfitImg = document.getElementById("benfit-img");
  var learn = document.getElementById("learn");
  var bottom = document.getElementById("bottom");
  var contentLessons = document.getElementById("section1-content");

  // Create a URLSearchParams object to handle query parameters in the current URL
  var urlParams = new URLSearchParams(window.location.search);
  /* Retrieve the value associated with the "course" parameter from the query string
  For example, if the URL is "/course-info.html?course=primary", courseLink will be "primary" */
  var courseLink = urlParams.get("course");
  // Update HTML content if courseLink = primary (content for kids)
  if (courseLink === "primary") {
    intro.innerHTML = `<video src="videos/kids-intro.mp4" controls autoplay muted></video>`;
    courseName.innerHTML = `Primary School ArSL`;
    categorie.innerHTML = `Categories: Kids`;
    duration.innerHTML = `Duration: 14m 18s / 23 lessons`;
    about.innerHTML = `Today, we're going to learn a cool game - it's called "Sign Language," and it's going to be a lot of fun! Explore New Words! We'll be learning new words that you use every day, like letters, days, colors, and even fruits! Why Learn Sign Language? Learning sign language helps us communicate better with our friends and family who might use it. It helps us understand each other and be even better friends! And that's not all! If you learn sign language, you'll be able to discover a whole new world of friends and exciting adventures! Are you ready to start? Let's kick off the fun and learn sign language together!`;
    aboutImg.innerHTML = `<img src="images/kids-about.png" alt="man img" />`;
    benfitImg.innerHTML = `<img src="images/benfit-head-kids.jpg" alt="kids" />`;
    learn.innerHTML = `<a href="course-lessons.html?course=primary"><button>Learn Now</button></a>`;
    bottom.innerHTML = `<a href="course-lessons.html?course=primary" class="img-link"><div class="bottom-left-image"><img src="images/learn-now-kids.png" alt="Bottom Left Image" class="kids-img" /><button class="learn-buttom">Learn Now</button></div></a>`;
    contentLessons.innerHTML = `<p>Lesson 1: Stop - 🤚</p>
    <p>Lesson 2: Notice - 👀</p>
    <p>Lesson 3: Think - 🤔</p>
    <p>Lesson 4: Respect - 👏</p>
    <p>Lesson 5: Are you okay? - 🤔👍</p>
    <p>Lesson 6: Good evening - 🌆</p>
    <p>Lesson 7: Hello - 👋</p>
    <p>Lesson 8: How are you? - 🤔👋</p>
    <p>Lesson 9: Thank you - 🙏</p>
    <p>Lesson 10: What's your name? - 🤔👂</p>
    <p>Lesson 11: Encouragement - 👏💪</p>
    <p>Lesson 12: Tolerance - ☮️</p>
    <p>Lesson 13: Kindness towards others - 😊🤝</p>
    <p>Lesson 14: Kindness to oneself - 😌💕</p>
    <p>Lesson 15: Self-confidence - 💪🙂</p>
    <p>Lesson 16: Self-forgiveness - ☮️😌</p>
    <p>Lesson 17: Frustration - 😟</p>
    <p>Lesson 18: Sadness - 😢</p>
    <p>Lesson 19: Jealousy - 😠</p>
    <p>Lesson 20: Interest - ❤️</p>
    <p>Lesson 21: Fear - 😨</p>
    <p>Lesson 22: Tension - 😬</p>
    <p class="last">Lesson 23: Determination - 🎨💪</p>
    `;
  } else if (courseLink === "arsl-with-caption") {
    intro.innerHTML = `<video src="videos/adult-intro2.mp4" controls autoplay muted></video>`;
    courseName.innerHTML = `ArSL With Caption`;
    duration.innerHTML = `Duration: 22m 53s / 15 lessons`;
    learn.innerHTML = `<a href="course-lessons.html?course=arsl-with-caption"><button>Learn Now</button></a>`;
    bottom.innerHTML = `<a href="course-lessons.html?course=arsl-with-caption" class="img-link"><div class="bottom-left-image"><img src="images/learn-now.png" alt="Bottom Left Image" /><button>Learn Now</button></div></a>`;
    contentLessons.innerHTML = `<p>Lesson 1: The Letters</p>
    <p>Lesson 2: The Feeling Is</p>
    <p>Lesson 3: The Numbers Are</p>
    <p>Lesson 4: The Colors Are</p>
    <p>Lesson 5: Prayer</p>
    <p>Lesson 6: The Hospital Is</p>
    <p>Lesson 7: Fast Food</p>
    <p>Lesson 8: Currencies</p>
    <p>Lesson 9: The Family</p>
    <p>Lesson 10: The House Is</p>
    <p>Lesson 11: The Foods Are</p>
    <p>Lesson 12: Introduce Yourself</p>
    <p>Lesson 13: A Week</p>
    <p>Lesson 14: City Streets</p>
    <p class="last">Lesson 15: Basic Means of Transportation</p>    
    `;
  }
});

// Function to open the share window when click on share course
function openShareModal() {
  var modal = document.getElementById("shareModal");
  // make the window visible
  modal.style.display = "flex";
}

// Function to close the share window
function closeShareModal() {
  var modal = document.getElementById("shareModal");
  // make the window hidden
  modal.style.display = "none";
}

// Event listener to open the share window when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  var shareButton = document.querySelector(".share");
  // Add a click event listener to the share button, to open share window
  shareButton.addEventListener("click", openShareModal);
});