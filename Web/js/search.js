async function search() {
  // Declare variables
  var input, filter, ulAdult, ulKids, aAdult, aKids, i, txtValue, correctedText;
  input = document.getElementById("myInput");
  filter = input.value.trim().toLowerCase();
  ulAdult = document.getElementById("adultCourses");
  ulKids = document.getElementById("kidsCourses");
  aAdult = ulAdult.getElementsByTagName("a");
  aKids = ulKids.getElementsByTagName("a");

  try {
    const response = await axios.post('http://localhost:4000/proxy-correct', {
      text: filter
    });
    correctedText = response.data.corrected_text.trim().toUpperCase();
    console.log(correctedText);

    // Loop through all adult course items, and hide those who don't match the search query
    for (i = 0; i < aAdult.length; i++) {
      txtValue = aAdult[i].textContent || aAdult[i].innerText;
      if (txtValue.toUpperCase().indexOf(correctedText) > -1) {
        aAdult[i].style.display = "";
      } else {
        aAdult[i].style.display = "none";
      }
    }

    // Loop through all kids course items, and hide those who don't match the search query
    for (i = 0; i < aKids.length; i++) {
      txtValue = aKids[i].textContent || aKids[i].innerText;
      if (txtValue.toUpperCase().indexOf(correctedText) > -1) {
        aKids[i].style.display = "";
      } else {
        aKids[i].style.display = "none";
      }
    }
  } catch (error) {
    console.error("Error correcting spelling:", error);
  }
}
