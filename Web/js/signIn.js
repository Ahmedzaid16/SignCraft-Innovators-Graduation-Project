document.getElementById("signinForm").addEventListener("submit", async function (event) {
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
      window.location.href = "index.html";
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