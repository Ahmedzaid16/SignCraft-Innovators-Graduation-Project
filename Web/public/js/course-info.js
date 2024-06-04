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
