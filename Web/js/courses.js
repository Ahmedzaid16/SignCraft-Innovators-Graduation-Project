/* This Function Scrolls Smoothly To The Specified HTML Element With The Given 'elementId'
   (id="adultCourses" or id="kidsCourses") */
function scrollToElement(elementId) {
  // Retrieve the Document Object Model (DOM) Element Using the Provided 'elementId'
  var element = document.getElementById(elementId);
  // Scroll the Element into view Smoothly
  element.scrollIntoView({ behavior: "smooth" });
}

// This Function Show or Hide an image Based on the Scroll Position
function showImageOnScroll() {
  // Define the scroll threshold (in pixels) to trigger the image visibility.
  const scrollThreshold = 200;
  // Check if the User has Scrolled beyond the defined threshold
  const isScrolled = window.scrollY > scrollThreshold;
  // Select the image element with the class "bottom-left-image"
  const bottomLeftImage = document.querySelector(".bottom-left-image");
  /* Set the opacity of the image based on the scroll condition 
  If scrolled, set opacity to 1 (visible); otherwise, set it to 0 (hidden) */
  bottomLeftImage.style.opacity = isScrolled ? 1 : 0;
}
// Add a scroll event listener to trigger the function when the user scrolls.
window.addEventListener("scroll", showImageOnScroll);
