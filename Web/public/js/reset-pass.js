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
  const form = document.getElementById("resetForm");
  const password = document.getElementById("new-password");
  const password2 = document.getElementById("confirm-password");

  function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control error";
    let small = formControl.querySelector("small");
    if (!small) {
      small = document.createElement("small");
      formControl.appendChild(small);
    }
    small.innerText = message;
  }

  function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
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

    const isRequiredValid = checkRequired([password, password2]);
    const isPasswordValid = checkLength(password, 6, 25);
    const isPasswordMatchValid = checkPasswordMatch(password, password2);

    if (isRequiredValid && isPasswordValid && isPasswordMatchValid) {
      form.submit();
    }
  });
});
