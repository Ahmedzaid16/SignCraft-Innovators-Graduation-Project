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

    // Update HTML content for the "Name," "Gender," and "Save" sections.
    if (nameSection && genderSection && saveSection) {
      nameSection.innerHTML = `
          <label for="name">Name</label>
          <input type="text" id="name" class="name-input" autocomplete="on">
        `;
      genderSection.innerHTML = `
          <label for="gender">Gender</label>
            <select name="gender" id="gender" class="gender-input" autocomplete="off">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
        `;
      saveSection.innerHTML = `
          <button>Save</button>
        `;
    }
  });

  rightArrow.addEventListener("click", function () {
    PasswordChangeSection.style.display = "grid";
    ProfileContainerSection.style.display = "none";
    if (PasswordChangeSection) {
      PasswordChangeSection.innerHTML = `
        <div class="back-arrow-and-h2">
        <i class="fa-sharp fa-solid fa-chevron-left fa-beat fa-lg"></i>
          <h2>Change Your Password</h2>
        </div>
        <div class="change-form">
          <form action="" class="change-password">
            <div class="current-password-section">
              <label for="current-password">Enter your current password</label>
              <input type="password" id="current-password" autocomplete="off" />
            </div>
            <div class="new-password-section">
              <label for="new-password">New Password</label>
              <div class="new-password-input">
                <input type="password" id="new-password" autocomplete="off" />
                <i class="fa-solid fa-lock" id="show-password"
                onclick="togglePasswordVisibility('new-password')" ></i>
              </div>
            </div>
            <div class="confirm-password-section">
              <label for="confirm-password">Confirm New Password</label>
              <div class="confirm-password-input">
                <input type="password" id="confirm-password" autocomplete="off" />
                <i class="fa-solid fa-lock" id="show-confirm-password"
                onclick="togglePasswordVisibility('confirm-password')" ></i>
              </div>
            </div>
            <p>*You will be signed out when you save.</p>
            <button>Save</button>
          </form>
        </div>
        `;
    }
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

document.getElementById("avatar").addEventListener("change", function (event) {
  // Get the image element and the selected file.
  const img = document.getElementById("avatar-img");
  const file = event.target.files[0];

  // Check if a file is selected.
  if (file) {
    // Create a FileReader to read the file as a data URL.
    const reader = new FileReader();

    // Set up a callback function to be executed when the reading is complete.
    reader.onload = function (e) {
      // Set the image source to the data URL.
      img.src = e.target.result;
      // make the image filter none
      img.style.filter = "none";
    };

    // Read the file as a data URL.
    reader.readAsDataURL(file);
  }
});

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
