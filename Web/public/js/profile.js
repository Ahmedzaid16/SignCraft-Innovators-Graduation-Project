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

document.getElementById("avatar").addEventListener("change", function () {
  // Check if a file has been selected
  if (this.files && this.files[0]) {
    // Get the selected file
    const file = this.files[0];

    // Create a FileReader to preview the selected image
    const reader = new FileReader();
    reader.onload = function (e) {
      // Update the image src attribute to display the selected image
      document.getElementById("avatar-img").src = e.target.result;
    };
    reader.readAsDataURL(file);

    // Automatically submit the form
    document.getElementById("avatar-form").submit();
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profile-form");
  const username = document.getElementById("name");

  function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control error";
    const small = formControl.querySelector("small");
    small.innerText = message;
  }

  function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
  }

  function checkRequired(inputArr) {
    let valid = true;
    inputArr.forEach(function (input) {
      if (input.value.trim() === "") {
        showError(input, `${getFieldName(input)} is required`);
        valid = false;
      } else {
        showSuccess(input);
      }
    });
    return valid;
  }

  function checkLength(input, min, max) {
    if (input.value.length < min) {
      showError(
        input,
        `${getFieldName(input)} must be at least ${min} characters`
      );
      return false;
    } else if (input.value.length > max) {
      showError(
        input,
        `${getFieldName(input)} must be less than ${max} characters`
      );
      return false;
    } else {
      showSuccess(input);
      return true;
    }
  }

  function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isRequiredValid = checkRequired([username]);
    const isUsernameValid = checkLength(username, 3, 15);

    if (isRequiredValid && isUsernameValid) {
      form.submit();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("change-form");
  const password = document.getElementById("new-password");
  const password2 = document.getElementById("confirm-password");
  const password3 = document.getElementById("current-password");

  function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control2 error";
    let small = formControl.querySelector("small");
    if (!small) {
      small = document.createElement("small");
      formControl.appendChild(small);
    }
    small.innerText = message;
  }

  function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control2 success";
    const small = formControl.querySelector("small");
    if (small) {
      formControl.removeChild(small);
    }
  }

  function checkRequired(inputArr) {
    let valid = true;
    inputArr.forEach(function (input) {
      if (input.value.trim() === "") {
        showError(input, `${getFieldName(input)} is required`);
        valid = false;
      } else {
        showSuccess(input);
      }
    });
    return valid;
  }

  function checkLength(input, min, max) {
    if (input.value.length < min) {
      showError(
        input,
        `${getFieldName(input)} must be at least ${min} characters`
      );
      return false;
    } else if (input.value.length > max) {
      showError(
        input,
        `${getFieldName(input)} must be less than ${max} characters`
      );
      return false;
    } else {
      showSuccess(input);
      return true;
    }
  }

  function checkPasswordMatch(input1, input2) {
    if (input1.value !== input2.value) {
      showError(input2, "Passwords do not match");
      return false;
    }
    return true;
  }

  function getFieldName(input) {
    return (
      input.placeholder.replace(" ", "").charAt(0).toUpperCase() +
      input.placeholder.slice(1)
    );
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isRequiredValid = checkRequired([password, password2 , password3]);
    const isPasswordValid3 = checkLength(password3, 6, 25);
    const isPasswordValid = checkLength(password, 6, 25);
    const isPasswordMatchValid = checkPasswordMatch(password, password2);

    if (isRequiredValid && isPasswordValid && isPasswordValid3 && isPasswordMatchValid) {
      form.submit();
    }
  });
});