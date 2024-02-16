document.addEventListener("DOMContentLoaded", async () => {
  const send = document.getElementById("send");
  send.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    try {
      const EmailResponse = await fetch(`http://localhost:4000/sendemail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const responseData = await EmailResponse.json();
      console.log(responseData.userEmail);
      if (EmailResponse.ok) {
        alert("We will send you an email if your account exist.");
      } else {
        alert("This account doesn't exist.");
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  });
});
