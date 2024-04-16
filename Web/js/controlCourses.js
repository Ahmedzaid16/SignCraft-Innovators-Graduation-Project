const open = document.getElementById("open");
const close = document.getElementById("close");
const modal = document.getElementById("modal");
const upload = document.getElementById("custom-image-upload");

// Show modal
open.addEventListener("click", () => modal.classList.add("show-modal"));

//Hide modal
close.addEventListener("click", () => modal.classList.remove("show-modal"));

// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == modal ? modal.classList.remove("show-modal") : false
);

upload.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
  if (file && allowedTypes.includes(file.type)) {
  } else {
    // Invalid file type
    alert("Please select a valid image file (JPEG, PNG, JPG or GIF).");
    event.target.value = ""; // Clear the input
  }
});
