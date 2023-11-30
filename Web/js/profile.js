document.addEventListener("DOMContentLoaded", function () {
  const personalInfoTab = document.querySelector(
    ".nav-section ul li:nth-child(1)"
  );
  const accountInfoTab = document.querySelector(
    ".nav-section ul li:nth-child(2)"
  );
  const emailSection = document.querySelector(".email-section");
  const passwordSection = document.querySelector(".password-section");
  const nameSection = document.querySelector(".name-section");
  const genderSection = document.querySelector(".gender-section");
  const saveSection = document.querySelector(".save-section");

  personalInfoTab.addEventListener("click", function () {
    personalInfoTab.classList.add("active");
    accountInfoTab.classList.remove("active");
    emailSection.style.display = "grid";
    passwordSection.style.display = "grid";
    saveSection.style.display = "grid";
    nameSection.style.display = "none";
    genderSection.style.display = "none";
    saveSection.style.display = "none";
  });

  accountInfoTab.addEventListener("click", function () {
    accountInfoTab.classList.add("active");
    personalInfoTab.classList.remove("active");
    emailSection.style.display = "none";
    passwordSection.style.display = "none";
    saveSection.style.display = "none";
    nameSection.style.display = "grid";
    genderSection.style.display = "grid";
    saveSection.style.display = "grid";

    // Change form content for Account Information
    if (nameSection && genderSection && saveSection) {
      nameSection.innerHTML = `
          <label for="name">Name</label>
          <input type="text" id="name"/>
        `;
      genderSection.innerHTML = `
          <label for="gender">Gender</label>
            <select id="gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
           </select>
        `;
      saveSection.innerHTML = `
          <button>Save</button>
        `;
    }
  });
});
document.getElementById("avatar").addEventListener("change", function (event) {
  const img = document.getElementById("avatar-img");
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      img.src = e.target.result;
      img.style.filter = "none";
    };

    reader.readAsDataURL(file);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const PasswordChangeSection = document.querySelector(
    ".password-change-section"
  );
  const ProfileContainerSection = document.querySelector(".profile-container");

  // Add event listener to a parent element
  document
    .querySelector(".password-change-section")
    .addEventListener("click", function (event) {
      // Check if the clicked element is the left arrow icon
      if (event.target.classList.contains("fa-chevron-left")) {
        ProfileContainerSection.classList.remove("hidden");
        PasswordChangeSection.classList.add("hidden");
        PasswordChangeSection.style.display = "none";
        ProfileContainerSection.style.display = "grid";
      }
    });

  // Add event listener for the right arrow icon
  document
    .querySelector(".fa-chevron-right")
    .addEventListener("click", function () {
      ProfileContainerSection.classList.add("hidden");
      PasswordChangeSection.classList.remove("hidden");
      PasswordChangeSection.style.display = "grid";
      ProfileContainerSection.style.display = "none";
      // Change form content for Password Change
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
              <input type="password" id="current-password" />
            </div>
            <div class="new-password-section">
              <label for="new-password">New Password</label>
              <div class="new-password-input">
                <input type="password" id="new-password" />
                <i class="fa-solid fa-lock" id="show-password"
                onclick="togglePasswordVisibility('new-password')" ></i>
              </div>
            </div>
            <div class="confirm-password-section">
              <label for="confirm-password">Confirm New Password</label>
              <div class="confirm-password-input">
                <input type="password" id="confirm-password" />
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
});
function togglePasswordVisibility(inputId) {
  var icon = "";
  var passwordInput = document.getElementById(inputId);
  if (inputId === "new-password") {
    icon = document.getElementById("show-password");
  } else {
    icon = document.getElementById("show-confirm-password");
  }
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.remove("fa-lock");
    icon.classList.add("fa-unlock");
  } else {
    passwordInput.type = "password";
    icon.classList.remove("fa-unlock");
    icon.classList.add("fa-lock");
  }
}
