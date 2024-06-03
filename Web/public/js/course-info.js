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
var code = urlParams.get("course");

async function fetchCourses() {
  try {
    const response = await fetch("/findcourse", {
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

// Modify populateCourses function to use the fetched course data
async function populateCourses() {
  try {
    const courses = await fetchCourses();
    console.log("Courses data type:", typeof courses);
    console.log("Courses data:", courses);
    // Check if courses is an array
    if (!Array.isArray(courses)) {
      throw new Error("Courses data is not an array");
    }
    // Populate HTML with course data
    courses.forEach((course) => {
      intro.innerHTML = `<video src=${course.videoUrl} controls autoplay muted></video>`;
      courseName.innerHTML = `${course.name}`;
      categorie.innerHTML = `Categories: ${course.categories}`;
      duration.innerHTML = `Duration: ${course.duration} / ${course.lesson} lessons`;
      about.innerHTML = `Today, we're going to learn a cool game - it's called "Sign Language," and it's going to be a lot of fun! Explore New Words! We'll be learning new words that you use every day, like letters, days, colors, and even fruits! Why Learn Sign Language? Learning sign language helps us communicate better with our friends and family who might use it. It helps us understand each other and be even better friends! And that's not all! If you learn sign language, you'll be able to discover a whole new world of friends and exciting adventures! Are you ready to start? Let's kick off the fun and learn sign language together!`;
      if (course.categories == "kids") {
        aboutImg.innerHTML = `<img src="images/kids-about.png" alt="man img" />`;
        benfitImg.innerHTML = `<img src="images/benfit-head-kids.jpg" alt="kids" />`;
        learn.innerHTML = `<a href="course-lessons.html?course=${code}"><button>Learn Now</button></a>`;
        bottom.innerHTML = `<a href="course-lessons.html?course=${code}" class="img-link"><div class="bottom-left-image"><img src="images/learn-now-kids.png" alt="Bottom Left Image" class="kids-img" /><button class="learn-buttom">Learn Now</button></div></a>`;
      } else {
        bottom.innerHTML = `<a href="course-lessons.html?course=${code}" class="img-link"><div class="bottom-left-image"><img src="images/learn-now.png" alt="Bottom Left Image" /><button class="learn-buttom">Learn Now</button></div></a>`;
      }
      let lessonHTML = "";
      course.Lessondescription.forEach((lesson, index) => {
        lessonHTML += `<p${
          index === course.Lessondescription.length - 1 ? ' class="last"' : ""
        }>lesson ${index + 1} : ${lesson}</p>\n`;
      });
      // Set the HTML content for the contentLessons element
      contentLessons.innerHTML = lessonHTML;
    });
  } catch (error) {
    console.error("Error populating courses:", error);
  }
}

// Call the populateCourses function when the DOM is loaded
document.addEventListener("DOMContentLoaded", populateCourses);

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
