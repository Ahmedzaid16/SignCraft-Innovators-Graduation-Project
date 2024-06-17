document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const email = document.getElementById("email");

  // Show input error message
  function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control error";
    const small = formControl.querySelector("small");
    small.innerText = message;
  }

  // Show outline success
  function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
  }

  // Check email is valid
  function checkEmail(input) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
      showSuccess(input);
      return true;
    } else {
      showError(input, "Email is not valid");
      return false;
    }
  }

  // Check required fields
  function checkRequired(inputArr) {
    let isValid = true;
    inputArr.forEach(function (input) {
      if (input.value.trim() === "") {
        showError(input, `${getFieldName(input)} is required`);
        isValid = false;
      } else {
        showSuccess(input);
      }
    });
    return isValid;
  }

  // Get field name
  function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
  }

  // Event listeners
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isRequiredValid = checkRequired([email]);
    const isEmailValid = checkEmail(email);

    if (isRequiredValid && isEmailValid) {
      form.submit(); // Programmatically submit the form if all validations pass
    }
  });
});
