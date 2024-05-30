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

// Assume you have retrieved the user ID from somewhere
const userId = localStorage.getItem("userId");

// Function to dynamically change the "Sign in" link to a circle avatar
function updateSignInLink() {
  const signInLink = document.getElementById("signInLink");
  const education = document.getElementById("education");
  if (userId) {
    // If user ID is present, change the "Sign in" link to a circle avatar linking to profile.html
    signInLink.innerHTML = `
      <a href="/profile">
        <div class="circle-avatar">
          <img style="width: 45px;height: 45px;border-radius: 50%;object-fit: cover;" src="images/dark-avatar.jpg" alt="avatar"
          id="avatar-img"
        />
        </div>
      </a>
    `;
    education.innerHTML = `<a href="/courses" class="edu" data-i18n="Head_Education">Education</a>`;
    // Call the function to update the avatar image when the page loads
    updateAvatarImage();
  }
}

// Function to handle logout
function logout() {
  localStorage.removeItem("userId");
  // Hide the Logout link
  document.getElementById("logoutLink").style.display = "none";
}

// Function to update the header based on user authentication status
function updateHeader() {
  if (userId) {
    // If user is authenticated, show the Logout link and hide the Sign in link
    document.getElementById("logoutLink").style.display = "block";
  } else {
    // If user is not authenticated, show the Sign in link and hide the Logout link
    document.getElementById("logoutLink").style.display = "none";
  }
}

// Call the functions to update the header when the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  updateSignInLink();
  updateHeader();
});
