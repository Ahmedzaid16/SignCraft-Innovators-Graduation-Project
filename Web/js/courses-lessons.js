function loadVideo(videoSource) {
  var iframe = document.getElementById("lesson-iframe");
  var newSrc = "https://www.youtube.com/embed/" + videoSource;
  iframe.src = newSrc;

  var allLessonElements = document.querySelectorAll("li");
  allLessonElements.forEach(function (element) {
    element.classList.remove("active-lesson");
  });

  var clickedElement = document.getElementById(videoSource);
  clickedElement.classList.add("active-lesson");
}

document.addEventListener("DOMContentLoaded", function () {
  var iframe = document.getElementById("lesson-iframe");
  var ul = document.getElementById("lessons-video");
  var urlParams = new URLSearchParams(window.location.search);
  var courseLink = urlParams.get("course");

  if (courseLink === "egyptian") {
    var newSrc =
      "https://www.youtube.com/embed/watch?v=Tw44A1185uc&list=PLaQzmDaYayMCuW3Y0LhKnYON8u5_QQYsW&index=1&ab_channel=هحببكفىالإشارة";
    iframe.src = newSrc;
    var lessonsEgyptianData = [
      { id: "Tw44A1185uc", index: 1, title: "Lesson 1" },
      { id: "MuVrNSmBkxo", index: 2, title: "Lesson 2" },
      { id: "QdgQfTQsJfY", index: 3, title: "Lesson 3" },
      { id: "YNUKpiHT-Hs", index: 4, title: "Lesson 4" },
      { id: "pDuIpvUF6WY", index: 5, title: "Lesson 5" },
      { id: "YEoM31uvBSs", index: 6, title: "Lesson 6" },
      { id: "jUc7tat2EwU", index: 7, title: "Lesson 7" },
      { id: "LQrdyMBg5to", index: 8, title: "Lesson 8" },
      { id: "O_ifFcw9Nys", index: 9, title: "Lesson 9" },
      { id: "dBBYbFmT55c", index: 10, title: "Lesson 10" },
      { id: "S5uFRBrn1Sk", index: 11, title: "Lesson 11" },
      { id: "oGqzEtz6Cqs", index: 12, title: "Lesson 12" },
      { id: "-qTCsl9hDPQ", index: 13, title: "Lesson 13" },
      { id: "7RDnVq8NWi8", index: 14, title: "Lesson 14" },
      { id: "ju6p5v1XVn8", index: 15, title: "Lesson 15" },
      { id: "8-2njSIPaoo", index: 16, title: "Lesson 16" },
      { id: "KpbwLDiUDaM", index: 17, title: "Lesson 17" },
      { id: "rQTFL8aemn4", index: 18, title: "Lesson 18" },
      { id: "3CGj-2ipuK0", index: 19, title: "Lesson 19" },
      { id: "h92VztuIvNw", index: 20, title: "Lesson 20" },
      { id: "SlNRUfgpblw", index: 21, title: "Lesson 21" },
      { id: "XM0TOfAw8_8", index: 22, title: "Lesson 22" },
      { id: "nPfcYjdEeBU", index: 23, title: "Lesson 23" },
      { id: "T53Jm0SfAS8", index: 24, title: "Lesson 24" },
    ];

    ul.innerHTML = lessonsEgyptianData
      .map(
        (lesson) => `
    <li
      id="watch?v=${lesson.id}&list=PLaQzmDaYayMCuW3Y0LhKnYON8u5_QQYsW&index=${lesson.index}&ab_channel=هحببكفىالإشارة"
      onclick="loadVideo('watch?v=${lesson.id}&list=PLaQzmDaYayMCuW3Y0LhKnYON8u5_QQYsW&index=${lesson.index}&ab_channel=هحببكفىالإشارة')"
    >
      ${lesson.title}
    </li>`
      )
      .join("");
  } else {
    var newSrc =
      "https://www.youtube.com/embed/watch?v=pHrxqpjq8FM&list=PLc4t1-K0nthvFoov4oOYlKDqfNnqjZr9X&index=1&ab_channel=اهلاسمسم-AhlanSimsim";
    iframe.src = newSrc;
    var lessonsPrimaryData = [
      { id: "pHrxqpjq8FM", index: 1, title: "Lesson 1" },
      { id: "-pH73HawpDs", index: 2, title: "Lesson 2" },
      { id: "5K5Sze7a0oQ", index: 3, title: "Lesson 3" },
      { id: "BxgUhSajimo", index: 4, title: "Lesson 4" },
      { id: "WGPAqARqt8o", index: 5, title: "Lesson 5" },
      { id: "JONHdldJaPY", index: 6, title: "Lesson 6" },
      { id: "gdl0Xkemch0", index: 7, title: "Lesson 7" },
      { id: "LEpIsR5jCkM", index: 8, title: "Lesson 8" },
      { id: "baWiYV2xDyk", index: 9, title: "Lesson 9" },
      { id: "QIc-xladQ2Y", index: 10, title: "Lesson 10" },
      { id: "4QKXNEZ_H40", index: 11, title: "Lesson 11" },
      { id: "dTREL9rXRIw", index: 12, title: "Lesson 12" },
      { id: "YVZejGgQxa8", index: 13, title: "Lesson 13" },
      { id: "upXVtCEOCOc", index: 14, title: "Lesson 14" },
      { id: "vStFq7-wAMo", index: 15, title: "Lesson 15" },
      { id: "1waDiMCBTYk", index: 16, title: "Lesson 16" },
      { id: "liViWdQKDV8", index: 17, title: "Lesson 17" },
      { id: "Evl65aBB-rY", index: 18, title: "Lesson 18" },
      { id: "9SiJw_gC6H0", index: 19, title: "Lesson 19" },
      { id: "10tmbSL04ZI", index: 20, title: "Lesson 20" },
      { id: "1-ph-F2yswQ", index: 21, title: "Lesson 21" },
      { id: "DxeCx8NOdbc", index: 22, title: "Lesson 22" },
      { id: "2uCDNoPNIAg", index: 23, title: "Lesson 23" },
    ];
    ul.innerHTML = lessonsPrimaryData
      .map(
        (lesson) => `
  <li
  id="watch?v=${lesson.id}&list=PLc4t1-K0nthvFoov4oOYlKDqfNnqjZr9X&index=${lesson.index}&ab_channel=اهلاسمسم-AhlanSimsim"
  onclick="loadVideo('watch?v=${lesson.id}&list=PLc4t1-K0nthvFoov4oOYlKDqfNnqjZr9X&index=${lesson.index}&ab_channel=اهلاسمسم-AhlanSimsim')"
  >
    ${lesson.title}
  </li>`
      )
      .join("");
  }
});
