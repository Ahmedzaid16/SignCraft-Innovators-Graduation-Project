document.addEventListener("DOMContentLoaded", function () {
  const footer = document.querySelector(".footer");
  footer.innerHTML = `<div class="content">
      <div class="one">
        <a href="#" class="logo">
          <i class="fa-solid fa-hands-asl-interpreting"></i>
          <h3>Sign Language</h3>
        </a>
        <ul class="social">
          <li>
            <a href="#" class="face">
              <i class="fab fa-facebook-f"></i>
            </a>
          </li>
          <li>
            <a href="#" class="linkedin">
              <i class="fab fa-linkedin"></i>
            </a>
          </li>
          <li>
            <a href="#" class="github">
              <i class="fab fa-github"></i>
            </a>
          </li>
        </ul>
      </div>
      <div class="two">
        <ul class="links">
          <li><a class="one" href="#">Menu</a></li>
          <li><a href="#">Home Page</a></li>
          <li><a href="#">Translate page</a></li>
          <li><a href="courses.html">Education Page</a></li>
          <li><a href="course-info.html">Courses</a></li>
        </ul>
      </div>
      <div class="three">
        <div class="email">
          <i class="fa-solid fa-envelope fa-fw"></i>
          <h3>Contact Us</h3>
        </div>
        <a href="mailto:signlanguage568@gmail.com">signlanguage568@gmail.com</a>
      </div>
    </div>
    <div class="copy-right">
      <p>Copyright &copy; 2024 Sign Language</p>
    </div>
    <div class="made">
      <p>Made by SignCraft Innovators</p>
    </div>`;
});
