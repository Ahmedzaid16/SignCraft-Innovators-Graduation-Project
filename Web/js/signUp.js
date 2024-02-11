document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const gender = document.querySelector('input[name="Gender"]:checked').value;
    const isSignLanguageSpeaker = document.querySelector(
      'input[name="Language"]'
    ).checked;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          gender,
          isSignLanguageSpeaker,
        }),
      });

      const data = await response.json();
      if (data.userId) {
        // Store the user ID in local storage
        localStorage.setItem("userId", data.userId);
        // Redirect to profile page or do any other necessary actions
        window.location.href = "index.html";
      } else {
        alert("Error creating user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating user");
    }
  });
