/* This Function Scrolls Smoothly To The Specified HTML Element With The Given 'elementId'
   (id="adultCourses" or id="kidsCourses") */
function scrollToElement(elementId) {
  // Retrieve the Document Object Model (DOM) Element Using the Provided 'elementId'
  var element = document.getElementById(elementId);
  // Scroll the Element into view Smoothly
  element.scrollIntoView({ behavior: "smooth" });
}

// Modify fetchCourses function to fetch course data from the new endpoint
async function fetchCourses() {
  try {
    const response = await fetch("http://localhost:4000/courses");
    const courses = await response.json();
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

// Modify populateCourses function to use the fetched course data
async function populateCourses() {
  try {
    const courses = await fetchCourses();
    const adultCoursesContainer = document.getElementById(
      "adult-courses-videos"
    );
    const kidsCoursesContainer = document.getElementById("kids-courses-videos");

    // Clear existing content
    adultCoursesContainer.innerHTML = "";
    kidsCoursesContainer.innerHTML = "";

    // Populate HTML with course data
    courses.forEach((course) => {
      const courseLink = document.createElement("a");
      courseLink.href = `course-info.html?course=${course.code}`;
      courseLink.classList.add("course");

      const courseContent = document.createElement("div");
      courseContent.classList.add("course-content");

      const courseImg = document.createElement("div");
      courseImg.classList.add("course-img");

      const img = document.createElement("img");
      img.src = course.imageUrl; // Assuming you have an 'imageUrl' field in your course data
      img.alt = "course img";

      const span = document.createElement("span");

      courseImg.appendChild(img);

      const courseInfo = document.createElement("div");
      courseInfo.classList.add("course-info");
      
      const h4 = document.createElement("h4");
      const p = document.createElement("p");
      if (localStorage.getItem("lang") == "en") {
        h4.textContent = course.name; // Assuming you have a 'name' field in your course data
        p.textContent = course.description; // Assuming you have a 'description' field in your course data
        span.textContent = `${course.lesson} Lessons`;
      } else {
        h4.textContent = course.name_ar;
        p.textContent = course.description_ar;
        span.textContent = `${course.lesson} درس`;
      }

      courseImg.appendChild(span);
      courseInfo.appendChild(h4);
      courseInfo.appendChild(p);

      courseContent.appendChild(courseImg);
      courseContent.appendChild(courseInfo);

      courseLink.appendChild(courseContent);

      // Check if the course is for adults or kids and append it to the respective container
      if (course.categories === "adult") {
        adultCoursesContainer.appendChild(courseLink);
      } else if (course.categories === "kids") {
        kidsCoursesContainer.appendChild(courseLink);
      }
    });
  } catch (error) {
    console.error("Error populating courses:", error);
  }
}

// Call the populateCourses function when the DOM is loaded
document.addEventListener("DOMContentLoaded", populateCourses);
