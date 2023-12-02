function scrollToElement(elementId) {
  var element = document.getElementById(elementId);
  element.scrollIntoView({ behavior: "smooth" });
}

const bottomLeftImage = document.querySelector(".bottom-left-image");
function showImageOnScroll() {
  const scrollThreshold = 200;
  const isScrolled = window.scrollY > scrollThreshold;
  bottomLeftImage.style.opacity = isScrolled ? 1 : 0;
}
window.addEventListener("scroll", showImageOnScroll);
