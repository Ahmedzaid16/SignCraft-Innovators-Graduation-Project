const openAdd = document.getElementById("openAdd");
const modify = document.getElementById("modify");
const remove = document.getElementById("remove");
const close = document.getElementById("close");
const closeMod = document.getElementById("close-mod");
const closeRem = document.getElementById("close-rem");
const modalAdd = document.getElementById("modal-add");
const modalMod = document.getElementById("modal-mod");
const modalRem = document.getElementById("modal-rem");
const upload = document.getElementById("custom-image-upload");

// Function to remove the "show-modal" class
const closeModal = () => {
  modalAdd.classList.remove("show-modal");
};

// Attach the event listener to the "close" button for Add modal
close.addEventListener("click", closeModal);

// Function to remove the "show-modal" class for Modify modal
const closeModalMod = () => {
  modalMod.classList.remove("show-modal");
};

// Attach the event listener to the "close" button for Modify modal
closeMod.addEventListener("click", closeModalMod);

// Function to remove the "show-modal" class for Remove modal
const closeModalRem = () => {
  modalRem.classList.remove("show-modal");
};

// Attach the event listener to the "close" button for Remove modal
closeRem.addEventListener("click", closeModalRem);

// Function to  show modal
const addModal = () => {
  modalAdd.classList.add("show-modal");
};
const modModal = () => {
  modalMod.classList.add("show-modal");
};
const remModal = () => {
  modalRem.classList.add("show-modal");
};

// Show Add modal
openAdd.addEventListener("click", addModal);
modify.addEventListener("click", modModal);
remove.addEventListener("click", remModal);

////////////////////////////////
// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == modalAdd ? modalAdd.classList.remove("show-modal") : false
);
// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == modalMod ? modalMod.classList.remove("show-modal") : false
);
// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == modalRem ? modalRem.classList.remove("show-modal") : false
);

// Upload allow to upload images only
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
