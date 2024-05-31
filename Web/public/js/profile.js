// When the document is fully loaded, set up event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Select the li Element with the Class and Position in the List (ul).
  const personalInfoTab = document.querySelector(
    ".nav-section ul li:nth-child(1)"
  );
  const accountInfoTab = document.querySelector(
    ".nav-section ul li:nth-child(2)"
  );
  // Select the Elements with their Classes
  const PasswordChangeSection = document.querySelector(
    ".password-change-section"
  );
  const ProfileContainerSection = document.querySelector(".profile-container");
  const emailSection = document.querySelector(".email-section");
  const passwordSection = document.querySelector(".password-section");
  const nameSection = document.querySelector(".name-section");
  const genderSection = document.querySelector(".gender-section");
  const saveSection = document.querySelector(".save-section");
  const rightArrow = document.querySelector(".fa-chevron-right");

  // add Event listener (Click) for the "Personal Info"
  personalInfoTab.addEventListener("click", function () {
    // Add Class Active to "Personal Info"
    personalInfoTab.classList.add("active");
    accountInfoTab.classList.remove("active");
    /* Show the email section, and password section
       Hide the name section, gender section, and save button */
    emailSection.style.display = "grid";
    passwordSection.style.display = "grid";
    nameSection.style.display = "none";
    genderSection.style.display = "none";
    saveSection.style.display = "none";
  });

  accountInfoTab.addEventListener("click", function () {
    accountInfoTab.classList.add("active");
    personalInfoTab.classList.remove("active");
    /* Hide the email section, and password section
       Show the name section, gender section, and save button */
    emailSection.style.display = "none";
    passwordSection.style.display = "none";
    nameSection.style.display = "grid";
    genderSection.style.display = "grid";
    saveSection.style.display = "grid";
  });

  rightArrow.addEventListener("click", function () {
    PasswordChangeSection.style.display = "grid";
    ProfileContainerSection.style.display = "none";
  });

  PasswordChangeSection.addEventListener("click", function (event) {
    // Check if the clicked element has the class "fa-chevron-left"
    if (event.target.classList.contains("fa-chevron-left")) {
      // If true, hide the password change section and show the profile container section.
      PasswordChangeSection.style.display = "none";
      ProfileContainerSection.style.display = "grid";
    }
  });
});

const updateAvatarImage = async () => {
  const userId = localStorage.getItem("userId");

  try {
    const response = await fetch("http://localhost:4000/uploadAvatar", {
      method: "POST", // Change to POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
      }),
    });

    const avatarUrl = await response.json();
    console.log(avatarUrl);
    if (response.ok) {
      if (avatarUrl) {
        const img = document.getElementById("avatar-img");
        img.src = avatarUrl.avatarUrl; // Update to access the correct property
        img.style.filter = "none";
      }
    } else {
      alert("Error uploading profile avatar");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while uploading profile avatar");
  }
};

// Call the function to update the avatar image when the page loads
updateAvatarImage();

document.getElementById("avatar").addEventListener("change", function (event) {
  const img = document.getElementById("avatar-img");
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      img.src = e.target.result;
      img.style.filter = "none";

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("avatar", file);
      const userId = localStorage.getItem("userId");
      // Send FormData to server for upload
      uploadImageToServer(formData, userId);
    };

    reader.readAsDataURL(file);
  }
});

async function uploadImageToServer(formData, userId) {
  try {
    // Append the user ID to the FormData
    formData.append("userId", userId);

    const response = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Image uploaded successfully:", data);
    // You can perform additional actions if needed
  } catch (error) {
    console.error("Error uploading image:", error);
    // Handle errors if necessary
  }
}

// Function to toggle the visibility of a password input field be click on lock icon.
function togglePasswordVisibility(inputId) {
  var icon = "";
  var passwordInput = document.getElementById(inputId);
  // Determine which icon to use based on the input field.
  if (inputId === "new-password") {
    icon = document.getElementById("show-password");
  } else {
    icon = document.getElementById("show-confirm-password");
  }
  // make password Visible or Hidden.
  if (passwordInput.type === "password") {
    //switch input type to text (password) and update the icon.
    passwordInput.type = "text";
    icon.classList.remove("fa-lock");
    icon.classList.add("fa-unlock");
  } else {
    //switch input type to password and update the icon.
    passwordInput.type = "password";
    icon.classList.remove("fa-unlock");
    icon.classList.add("fa-lock");
  }
}

// Function to fetch user data
async function getUserData() {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "signIn.html";
      return;
    }
    console.log(userId);
    const response = await fetch("http://localhost:4000/getUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await response.json();
    console.log(userData);
    // Update the HTML elements with user data
    document.getElementById("avatar-img").src = userData.avatarUrl;
    document.getElementById("email").value = userData.email;
    document.getElementById("name").value = userData.name;
    document.getElementById("gender").value = userData.gender;
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Handle errors if necessary
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Fetch the Save button element
  const saveButton = document.getElementById("saveButton");

  // Add a click event listener to the Save button
  saveButton.addEventListener("click", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Fetch the input values
    const name = document.getElementById("name").value;
    const gender = document.getElementById("gender").value;
    if (name.trim() === "") {
      alert("name is empty");
      return;
    }

    // Fetch the user ID
    const userId = localStorage.getItem("userId");

    // Prepare the data to be updated
    const updatedData = {
      username: name,
      gender: gender,
    };

    try {
      const response = await fetch("http://localhost:4000/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          data: updatedData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Data successfully updated
        alert("Profile information updated successfully!");
      } else {
        // Error updating data
        alert("Error updating profile information");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating profile information");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Fetch the Save button element
  const saveNewPasswordButton = document.getElementById("saveNewPassword");

  // Add a click event listener to the Save button
  saveNewPasswordButton.addEventListener("click", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Fetch the input values
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const configPassword = document.getElementById("confirm-password").value;
    const email = document.getElementById("email").value;
    if (currentPassword.trim() === "") {
      alert("currentPassword is empty");
      return;
    } else if (newPassword.trim() === "") {
      alert("new Password is empty");
      return;
    } else if (configPassword.trim() === "") {
      alert("confirm password is empty");
      return;
    } else if (newPassword !== configPassword) {
      alert("new Password not equal confirm password");
      return;
    }
    // Fetch the user ID
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch("http://localhost:4000/updatePass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          currentPassword: currentPassword,
          newPassword: newPassword,
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Data successfully updated
        alert("Password updated successfully!");
        // Perform logout after password update
        window.location.href = "index.html";
        localStorage.removeItem("userId");
        // Hide the Logout link
        document.getElementById("logoutLink").style.display = "none";
      } else {
        // Error updating data
        alert("Error updating password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating password");
    }
  });
});

// Call the function to fetch user data when the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  getUserData();
});