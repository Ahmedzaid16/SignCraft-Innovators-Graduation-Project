document.addEventListener("DOMContentLoaded", function () {
  // Fetch the Save button element
  const education = document.getElementById("education");

  // Add a click event listener to the Save button
  education.addEventListener("click", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Fetch the user ID
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await fetch("http://localhost:4000/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        });

        const check = await response.json();
        console.log(check);
        if (response.ok) {
          if (!check.check) {
            alert(
              "Please Verify your Email First,check the Spam if you didn't find it"
            );
          }else{
            window.location.href = "courses";
          }
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while GET Verify");
      }
    } else {
      window.location.href = "signIn";
    }
  });
});
