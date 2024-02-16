document.addEventListener("DOMContentLoaded", function () {
  // Fetch the Save button element
  const saveNewPasswordButton = document.getElementById("save");

  // Add a click event listener to the Save button
  saveNewPasswordButton.addEventListener("click", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Fetch the input values
    // Call the function to get the email from the URL
    const extractedEmail = getEmailFromURL();
    const newPassword = document.getElementById("new-password").value;
    const configPassword = document.getElementById("confirm-password").value;
    if (newPassword.trim() === "") {
      alert("new Password is empty");
      return;
    } else if (configPassword.trim() === "") {
      alert("confirm password is empty");
      return;
    } else if (newPassword !== configPassword) {
      alert("new Password not equal confirm password");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/resetPass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: newPassword,
          email: extractedEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Data successfully updated
        alert("Password updated successfully!");
        // Perform logout after password update
        window.location.href = "signIn.html";
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

function getEmailFromURL() {
  // Get the current URL
  var currentURL = window.location.href;

  // Find the position of "email="
  var emailIndex = currentURL.indexOf("email=");

  // Check if "email=" is found in the URL
  if (emailIndex !== -1) {
    // Extract the email value from the URL
    var email = currentURL.substring(emailIndex + 6);

    // Output the email address
    console.log(email);

    return email;
  } else {
    console.log("Email parameter not found in the URL");
    return null;
  }
}
