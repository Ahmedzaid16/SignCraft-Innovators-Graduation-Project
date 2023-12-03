function toggleContent(sectionId) {
  var plusMinusIcon = document.getElementById("icon");
  var content = document.getElementById(sectionId + "-content");
  content.classList.toggle("show");
  if (content.classList.contains("show")) {
    plusMinusIcon.classList.remove("fa-plus");
    plusMinusIcon.classList.add("fa-minus");
  } else {
    plusMinusIcon.classList.remove("fa-minus");
    plusMinusIcon.classList.add("fa-plus");
  }
}

function showImageOnScroll() {
  var bottomLeftImage = document.getElementById("bottom");
  const scrollThreshold = 400;
  const isScrolled = window.scrollY > scrollThreshold;
  bottomLeftImage.style.display = isScrolled ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", function () {
  showImageOnScroll(); // Call the function to handle initial state

  window.addEventListener("scroll", showImageOnScroll);

  var intro = document.getElementById("intro");
  var categorie = document.getElementById("categorie");
  var duration = document.getElementById("duration");
  var about = document.getElementById("about");
  var aboutImg = document.getElementById("about-img");
  var benfitImg = document.getElementById("benfit-img");
  var learn = document.getElementById("learn");
  var lst = document.getElementById("lst");
  var before = document.getElementById("bef");
  var bottom = document.getElementById("bottom");

  var urlParams = new URLSearchParams(window.location.search);
  var courseLink = urlParams.get("course");

  if (courseLink === "primary") {
    intro.innerHTML = `<video src="videos/kids-intro.mp4" controls autoplay muted></video>`;
    categorie.innerHTML = `Categories: Kids`;
    duration.innerHTML = `Duration: 14m 18s / 23 lessons`;
    about.innerHTML = `Today, we're going to learn a cool game - it's called "Sign Language," and it's going to be a lot of fun! Explore New Words! We'll be learning new words that you use every day, like letters, days, colors, and even fruits! Why Learn Sign Language? Learning sign language helps us communicate better with our friends and family who might use it. It helps us understand each other and be even better friends! And that's not all! If you learn sign language, you'll be able to discover a whole new world of friends and exciting adventures! Are you ready to start? Let's kick off the fun and learn sign language together!`;
    aboutImg.innerHTML = `<img src="images/kids-about.png" alt="man img" />`;
    benfitImg.innerHTML = `<img src="images/benfit-head-kids.jpg" alt="kids" />`;
    learn.innerHTML = `<a href="course-lessons.html?course=primary" class="primary"><button>Learn Now</button></a>`;
    bottom.innerHTML = `<a href="course-lessons.html?course=primary" class="img-link"><div class="bottom-left-image"><img src="images/learn-now-kids.png" alt="Bottom Left Image" class="kids-img" /><button class="learn-buttom">Learn Now</button></div></a>`;
    lst.style.display = "none";
    before.classList.add("last");
  }
});
function openShareModal() {
  var modal = document.getElementById("shareModal");
  modal.style.display = "flex";
}

function closeShareModal() {
  var modal = document.getElementById("shareModal");
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  // ... (existing code)

  var shareButton = document.querySelector(".share");
  shareButton.addEventListener("click", openShareModal);
});
