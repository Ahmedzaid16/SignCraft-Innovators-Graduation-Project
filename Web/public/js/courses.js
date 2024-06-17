/* This Function Scrolls Smoothly To The Specified HTML Element With The Given 'elementId'
   (id="adultCourses" or id="kidsCourses") */
function scrollToElement(elementId) {
  // Retrieve the Document Object Model (DOM) Element Using the Provided 'elementId'
  var element = document.getElementById(elementId);
  // Scroll the Element into view Smoothly
  element.scrollIntoView({ behavior: "smooth" });
}

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
    const response = await axios.post("/proxy-correct", {
      text: filter,
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

const sliderContainer = document.querySelector(".slider-container");
const slideRight = document.querySelector(".right-slide");
const slideLeft = document.querySelector(".left-slide");
const downButton = document.querySelector(".down-button");
const upButton = document.querySelector(".up-button");
const slidesLength = slideRight.querySelectorAll("div").length;

activeSlideIndex = 0;

slideLeft.style.top = `-${(slidesLength - 1) * 70}vh`;

upButton.addEventListener("click", () => changeSlide("up"));
downButton.addEventListener("click", () => changeSlide("down"));

const changeSlide = (direction) => {
  const sliderHeight = sliderContainer.clientHeight;
  if (direction === "up") {
    activeSlideIndex++;
    if (activeSlideIndex > slidesLength - 1) {
      activeSlideIndex = 0;
    }
  } else if (direction === "down") {
    activeSlideIndex--;
    if (activeSlideIndex < 0) {
      activeSlideIndex = slidesLength - 1;
    }
  }

  slideRight.style.transform = `translateY(-${
    activeSlideIndex * sliderHeight
  }px)`;
  slideLeft.style.transform = `translateY(${
    activeSlideIndex * sliderHeight
  }px)`;
};

const autoChangeSlide = () => {
  changeSlide("up");
};

setInterval(autoChangeSlide, 5000);
