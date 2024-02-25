async function search() {
  // Declare variables
  var input, filter, ulAdult, ulKids, aAdult, aKids, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.trim().toUpperCase();
  ulAdult = document.getElementById("adultCourses");
  ulKids = document.getElementById("kidsCourses");
  aAdult = ulAdult.getElementsByTagName("a");
  aKids = ulKids.getElementsByTagName("a");
  try {
    const correct = await fetch(`http://localhost:4000/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: filter,
      }),
    });

    const correctedResult = await correct.json();
    var result = correctedResult.correctedText;
    console.log(result);

    // Loop through all adult course items, and hide those who don't match the search query
    for (i = 0; i < aAdult.length; i++) {
      txtValue = aAdult[i].textContent || aAdult[i].innerText;
      if (txtValue.toUpperCase().indexOf(result) > -1) {
        aAdult[i].style.display = "";
      } else {
        aAdult[i].style.display = "none";
      }
    }

    // Loop through all kids course items, and hide those who don't match the search query
    for (i = 0; i < aKids.length; i++) {
      txtValue = aKids[i].textContent || aKids[i].innerText;
      if (txtValue.toUpperCase().indexOf(result) > -1) {
        aKids[i].style.display = "";
      } else {
        aKids[i].style.display = "none";
      }
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}
