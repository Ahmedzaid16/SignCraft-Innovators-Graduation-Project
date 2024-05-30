const form = document.getElementById("signinForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

//show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

//show outline success
function showSuccess(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

//Check email is valid
function checkEmail(input) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/;
  if (re.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, "Email is not valid");
  }
}

//Check required fields
function checkRequired(inputArr) {
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
    } else {
      showSuccess(input);
    }
  });
}

//Check input lenght
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} mast be at least ${min} characters`
    );
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} mast be less than ${max} characters`
    );
  } else {
    showSuccess(input);
  }
}

//Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

//Event listeners
form.addEventListener("submit", function (e) {
  e.preventDefault();
  checkRequired([email, password]);
  checkEmail(email);
  checkLength(password, 6, 25);
});

document
  .getElementById("signinForm")
  .addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Extract email and password from the form
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Send a POST request to the server for sign-in
      const response = await fetch("http://localhost:4000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Parse the response data as JSON
      const data = await response.json();

      // Check if the response is successful (HTTP status code 200 OK)
      if (response.ok) {
        // Store the user ID in local storage
        localStorage.setItem("userId", data.userId);
        // Redirect to the Home page
        window.location.href = "/";
      } else {
        // Display an alert for invalid email or password
        alert("Invalid email or password");
      }
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      console.error("Error:", error);
      alert("Invalid email or password");
    }
  });
