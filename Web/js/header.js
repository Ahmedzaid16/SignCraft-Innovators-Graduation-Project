const menuIcon = document.getElementById("menu-icon");
const menu = document.getElementById("menu");

// Event listener
menuIcon.addEventListener("click", () => menu.classList.toggle("show-menu"));

// document.querySelectorAll(".btn-lang").forEach(function (btn) {
//   btn.addEventListener("click", function () {
//     const ar = document.getElementById("ar");
//     const eng = document.getElementById("eng");

//     if (ar.style.display === "none") {
//       ar.style.display = "";
//       eng.style.display = "none";
//     } else {
//       ar.style.display = "none";
//       eng.style.display = "";
//     }
//   });
// });
