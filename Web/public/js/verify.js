const updateVerifyEmail = async () => {
  const userId = localStorage.getItem("userId");

  try {
    const response = await fetch("http://localhost:4000/verifyEmail", {
      method: "POST", // Change to POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      alert("Email Varified");
    } else {
      alert("Can not Verify your Email");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while Email Varified");
  }
};
updateVerifyEmail();
