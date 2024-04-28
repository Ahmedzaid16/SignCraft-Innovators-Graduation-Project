const openAdd = document.getElementById("openAdd");
const openAddInfo = document.getElementById("openAddInfo");
const openAddVideo = document.getElementById("openAddVideo");
const modify = document.getElementById("modify");
const remove = document.getElementById("remove");
const close = document.getElementById("close");
const closeInfo = document.getElementById("close-info");
const closeVideo = document.getElementById("close-video");
const closeMod = document.getElementById("close-mod");
const closeRem = document.getElementById("close-rem");
const closeAcc = document.getElementById("close-acc");
const DelAccountBtn = document.getElementById("DelAccountBtn");
const modalAdd = document.getElementById("modal-add");
const modalAddInfo = document.getElementById("modal-add-info");
const modalAddVideo = document.getElementById("modal-add-video");
const modalMod = document.getElementById("modal-mod");
const modalRem = document.getElementById("modal-rem");
const showDeleteAccount = document.getElementById("showDeleteAccount");
const uploadAdd = document.getElementById("custom-image-upload-add");
const uploadAddInfo = document.getElementById("custom-video-upload-add");
const deviceVideo = document.getElementById("device-video");
const urlVideo = document.getElementById("url-video");
const radioUpload = document.getElementById("radio-upload");
const radioUrl = document.getElementById("radio-url");
const formAdd = document.getElementById("addform");
const formMod = document.getElementById("form-mod");
const formRem = document.getElementById("form-rem");
const forminfo = document.getElementById("addFormInfo");

// Function to remove the "show-modal" class
const closeModal = () => {
  modalAdd.classList.remove("show-modal");
};
// Attach the event listener to the "close" button for Add modal
close.addEventListener("click", closeModal);

// Function to remove the "show-modal" class
const closeModalInfo = () => {
  modalAddInfo.classList.remove("show-modal");
};
// Attach the event listener to the "close" button for Add modal
closeInfo.addEventListener("click", closeModalInfo);

// Function to remove the "show-modal" class
const closeModalVideo = () => {
  modalAddVideo.classList.remove("show-modal");
};
// Attach the event listener to the "close" button for Add modal
closeVideo.addEventListener("click", closeModalVideo);

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

// Function to remove the "show-modal" class for Remove modal
const deleteUserAccount = () => {
  showDeleteAccount.classList.remove("show-modal");
};
// Attach the event listener to the "close" button for Remove modal
closeAcc.addEventListener("click", deleteUserAccount);

// Function to  show modal
const addModal = () => {
  modalAdd.classList.add("show-modal");
};
const addModalInfo = () => {
  modalAddInfo.classList.add("show-modal");
};
const addModalVideo = () => {
  modalAddVideo.classList.add("show-modal");
};
const modModal = () => {
  modalMod.classList.add("show-modal");
};
const remModal = () => {
  modalRem.classList.add("show-modal");
};
const showManage = () => {
  showDeleteAccount.classList.add("show-modal");
};

// Show Add modal
openAdd.addEventListener("click", addModal);
openAddInfo.addEventListener("click", addModalInfo);
openAddVideo.addEventListener("click", addModalVideo);
modify.addEventListener("click", modModal);
remove.addEventListener("click", remModal);
DelAccountBtn.addEventListener("click", showManage);

////////////////////////////////
// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == modalAdd ? modalAdd.classList.remove("show-modal") : false
);

// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == modalAddInfo ? modalAddInfo.classList.remove("show-modal") : false
);

// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == modalAddVideo
    ? modalAddVideo.classList.remove("show-modal")
    : false
);

// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == modalMod ? modalMod.classList.remove("show-modal") : false
);

// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == modalRem ? modalRem.classList.remove("show-modal") : false
);

// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == showDeleteAccount
    ? showDeleteAccount.classList.remove("show-modal")
    : false
);

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

// Handle form submission
formAdd.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  // Extracting values from form fields
  const code = document.getElementById("codeAdd").value;
  const name = document.getElementById("nameAdd").value;
  const lesson = document.getElementById("lessonAdd").value;
  const Categories = document.getElementById("CategoriesAdd").value;
  const description = document.getElementById("descriptionAdd").value;
  const imageFile = document.getElementById("custom-image-upload-add").files[0];

  // Read the image file as a data URL
  const reader = new FileReader();
  reader.onload = async (event) => {
    const imageBase64 = event.target.result;

    // Construct JSON object
    const data = {
      code: code,
      name: name,
      lesson: lesson,
      categories: Categories,
      description: description,
      image: imageBase64,
    };

    try {
      const response = await fetch("http://localhost:4000/create-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Course created successfully
        alert("Course created successfully!");
        modalAdd.classList.remove("show-modal");
        formAdd.reset();
      } else {
        // Error creating course
        const data = await response.json();
        alert(`Error: ${data.msg}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the course.");
    }
  };

  reader.readAsDataURL(imageFile);
});

formMod.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  // Extract updated course data from the form
  const imageFile = document.getElementById("custom-image-upload-mod").files[0];

  // Read the image file as a data URL
  const reader = new FileReader();
  reader.onload = async (event) => {
    const imageBase64 = event.target.result;
    const updatedData = {
      name: document.getElementById("name-mod").value,
      categories: document.getElementById("Categories-mod").value,
      lesson: document.getElementById("lesson-mod").value, // Assuming lesson is a number
      description: document.getElementById("description-mod").value,
      imageUrl: "",
    };

    // Extract course code from the form
    const code = document.getElementById("code-mod").value;

    try {
      // Send a request to update the course data
      const response = await fetch("http://localhost:4000/updateCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, updatedData, imageBase64 }),
      });

      if (response.ok) {
        alert("Course updated successfully!");
      } else {
        const data = await response.json();
        alert(`Error: ${data.msg}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the course.");
    }
  };
  reader.readAsDataURL(imageFile);
});

formRem.addEventListener("submit", async (e) => {
  e.preventDefault();
  const code = document.getElementById("code-rem").value;
  try {
    const response = await fetch("http://localhost:4000/deleteCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      alert("Course deleted successfully!");
    } else {
      const data = await response.json();
      alert(`Error: ${data.msg}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while deleting the course.");
  }
});

forminfo.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  // Extract updated course data from the form
  const description = document.getElementById("descriptionAddinfo").value;
  const descriptionArray = description.split(/\r?\n/);
  const videoFile = document.getElementById("custom-video-upload-add").files[0];

  const formData = new FormData(); // Create FormData object
  formData.append("video", videoFile); // Append video file to FormData

  // Add other form data to FormData
  formData.append("duration", document.getElementById("durationAddinfo").value);
  formData.append("Lessondescription", JSON.stringify(descriptionArray));
  formData.append("code", document.getElementById("codeAddinfo").value);

  try {
    // Send a request to update the course data
    const response = await fetch("http://localhost:4000/updateCourseinfo", {
      method: "POST",
      body: formData, // Use FormData as body
    });

    if (response.ok) {
      alert("Course updated successfully!");
    } else {
      const data = await response.json();
      alert(`Error: ${data.msg}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while updating the course.");
  }
});

// Update the getCourses function to navigate to a new page with course info
const getCourses = async () => {
  try {
    const response = await fetch("http://localhost:4000/courses");
    if (response.ok) {
      const courses = await response.json();
      // Store courses data in local storage
      localStorage.setItem("courses", JSON.stringify(courses));
      // Redirect to the new page
      window.location.href = "controlCoursesView.html"; // Replace with the actual URL of your new page
    } else {
      console.error("Failed to fetch courses");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Attach the getCourses function to the "View Course" button click event
const viewCourseButton = document.getElementById("view-course");
viewCourseButton.addEventListener("click", getCourses);

function ok() {
  Swal.fire("Done");
}
