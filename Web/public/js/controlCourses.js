const uploadAdd = document.getElementById("custom-image-upload-add");
const uploadAddInfo = document.getElementById("custom-video-upload-add");
const deviceVideo = document.getElementById("device-video");
const urlVideo = document.getElementById("url-video");
const radioUpload = document.getElementById("radio-upload");
const radioUrl = document.getElementById("radio-url");

// Upload allow to upload images only
uploadAdd.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
  if (file && allowedTypes.includes(file.type)) {
  } else {
    // Invalid file type
    alert("Please select a valid image file (JPEG, PNG, JPG or GIF).");
    event.target.value = ""; // Clear the input
  }
});

// Upload allow to upload images only
uploadAddInfo.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const allowedTypes = [
    "video/jpeg",
    "video/omv",
    "video/wmv",
    "video/mpg",
    "video/webm",
    "video/ogv",
    "video/mov",
    "video/asx",
    "video/mpeg",
    "video/mp4",
    "video/m4v",
    "video/avi",
  ];
  if (file && allowedTypes.includes(file.type)) {
  } else {
    // Invalid file type
    alert(
      "Please select a valid video file (omv, wmv, mpg, webm, ogv, mov, asx, mpeg, mp4, m4v or avi)."
    );
    event.target.value = ""; // Clear the input
  }
});

// Event listener for radio buttons
radioUpload.addEventListener("change", () => {
  if (radioUpload.checked) {
    console.log("ok");
    deviceVideo.classList.add("show-video");
    urlVideo.classList.remove("show-url");
  }
});

radioUrl.addEventListener("change", () => {
  if (radioUrl.checked) {
    console.log("ok");
    urlVideo.classList.add("show-url");
    deviceVideo.classList.remove("show-video");
  }
});