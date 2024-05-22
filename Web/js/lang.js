document.addEventListener("DOMContentLoaded", () => {
  // Get the current URL
  var currentURL = window.location.href;

  // Define the URLs to check
  var url1_home = "http://localhost:4000/index.html";
  var url2_home = "http://localhost:4000/";
  var url3_courses = "http://localhost:4000/courses.html";

  const setLanguage = (lang) => {
    localStorage.setItem("lang", lang); // Store language preference in local storage
    console.log(`Language set to: ${lang}`);
    fetchTranslations(lang);
    updateButtonVisibility(lang);
    updateDirectionAndStylesheet(lang);
    location.reload();
  };

  const fetchTranslations = (lang) => {
    fetch(`/translations?lang=${lang}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((translations) => {
        document.getElementById("head_home").textContent =
          translations.Head_Home;
        document.getElementById("head_tran").textContent =
          translations.Head_Translate;
        document.getElementById("head_edu").textContent =
          translations.Head_Education;
        document.getElementById("head_logout").textContent =
          translations.Head_Logout;
        document.getElementById("home").textContent = translations.HOME_PAGE;
        document.getElementById("translate").textContent =
          translations.TRANSLATE_PAGE;
        document.getElementById("course").textContent =
          translations.EDUCATION_PAGE;
        document.querySelector(".email h3").textContent =
          translations.CONTACT_US;
        document.querySelector(".copy-right p").textContent =
          translations.COPYRIGHT;
        document.querySelector(".made p").textContent = translations.MADE_BY;
        if (currentURL === url3_courses) {
          document.querySelector(".one").textContent =
            translations.ARABIC_SIGN_LANGUAGE_COURSES;
          document.querySelector(".two").textContent =
            translations.LEARN_TO_SIGN_TODAY;
          document.querySelector(".three").textContent =
            translations.EACH_COURSE_DESCRIPTION;
          document.querySelector(".categories-info h2").textContent =
            translations.COURSE_CATEGORIES;
          document.querySelector(".categories-info p").textContent =
            translations.WE_VE_GOT_COURSES_FOR_EVERYONE;
          document.querySelector(".adult-categories p").textContent =
            translations.AGES_15;
          document.querySelector(".kids-categories p").textContent =
            translations.KIDS;
          document.getElementById("arsl-head").textContent =
            translations.arsl_head;
          document.querySelector("#adultCourses h4").textContent =
            translations.ADULT_ARSL_COURSES;
          document.querySelector("#adultCourses p").textContent =
            translations.ADULT_COURSES_DESCRIPTION;
          document.querySelector("#kidsCourses h4").textContent =
            translations.ARSL_COURSES_FOR_KIDS;
          document.querySelector("#kidsCourses p").textContent =
            translations.KIDS_COURSES_DESCRIPTION;
          document.querySelector("#myInput").placeholder =
            translations.SEARCH_FOR_COURSES;
          document.querySelector(".links .one").textContent = translations.MENU;
          // Update the button texts and onclick handlers
          document.getElementById("close_mess").textContent =
            translations.Close;
          document.getElementById("help").textContent =
            translations.HELP_SUPPORT;
          document.getElementById("hello1").textContent =
            translations.HELLO_MESSAGE_1;
          document.getElementById("hello2").textContent =
            translations.HELLO_MESSAGE_2;
          document.getElementById("chat_robo").textContent =
            translations.NEW_MESSAGE;
          document.getElementById("greetings").textContent =
            translations.ROBO_GREETINGS;
          document.getElementById("assist").textContent =
            translations.HOW_CAN_I_ASSIST;
          document.getElementById("assist").textContent =
            translations.HOW_CAN_I_ASSIST;
          document.getElementById("new_mess").textContent =
            translations.NEW_MESSAGE;

          const buttonsConfig = [
            {
              class: "btn_one",
              text: translations.CHOOSE_BUTTON_ERROR,
              message: `${translations.CHOOSE_BUTTON_ERROR_p1} <a href='mailto:sherefalex34@gmail.com'>${translations.CHOOSE_BUTTON_ERROR_p2}</a> ${translations.CHOOSE_BUTTON_ERROR_p3}`,
            },
            {
              class: "btn_two",
              text: translations.CHOOSE_BUTTON_ACCOUNT,
              message: `1- ${translations.CHOOSE_BUTTON_ACCOUNT_p1} <a target="_blank" href='../reset-password.html'>${translations.CHOOSE_BUTTON_ACCOUNT_p2}</a>, ${translations.CHOOSE_BUTTON_ACCOUNT_p3}<br><br>2- ${translations.CHOOSE_BUTTON_ACCOUNT_p4}`,
            },
            {
              class: "btn_three",
              text: translations.CHOOSE_BUTTON_EDUCATION,
              message: `1- ${translations.CHOOSE_BUTTON_EDUCATION_p1} <a href='mailto:sherefalex34@gmail.com'>${translations.CHOOSE_BUTTON_ERROR_p2}</a> ${translations.CHOOSE_BUTTON_EDUCATION_p2}<br><br>2- ${translations.CHOOSE_BUTTON_EDUCATION_p3} <a href='mailto:sherefalex34@gmail.com'>${translations.CHOOSE_BUTTON_ERROR_p2}</a>.`,
            },
            {
              class: "btn_four",
              text: translations.CHOOSE_BUTTON_OTHER,
              message: `${translations.CHOOSE_BUTTON_OTHER_p1} <a href='mailto:sherefalex34@gmail.com'>${translations.CHOOSE_BUTTON_ERROR_p2}</a> ${translations.CHOOSE_BUTTON_OTHER_p2}`,
            },
          ];

          const optionsContainer = document.querySelector(".options");

          buttonsConfig.forEach((btnConfig) => {
            const button = document.createElement("button");
            button.classList.add(btnConfig.class);
            button.textContent = btnConfig.text;
            button.onclick = () => {
              console.log(`Button ${btnConfig.text} clicked`); // Debug log
              chooseButton(btnConfig.text, btnConfig.message);
            };
            optionsContainer.appendChild(button);
          });
        } else if (currentURL === url1_home || currentURL === url2_home) {
          // Home section translations
          document.querySelector(".home-title").textContent =
            translations.HOME.TITLE;
          document.querySelector(".home-description").textContent =
            translations.HOME.DESCRIPTION;

          // About section translations
          document.querySelector(".about-title").textContent =
            translations.ABOUT.TITLE;
          document.querySelector(".about-intro").textContent =
            translations.ABOUT.INTRO;

          // Web section within about
          document.querySelector(".web-page").textContent =
            translations.ABOUT.WEB.page;
          document.querySelector(".about-web-description").textContent =
            translations.ABOUT.WEB.DESCRIPTION;

          // App section within about
          document.querySelector(".app-page").textContent =
            translations.ABOUT.APP.page;
          document.querySelector(".about-app-description").textContent =
            translations.ABOUT.APP.DESCRIPTION;

          // Education section within about
          document.querySelectorAll(".edu-page").forEach((element) => {
            element.textContent = translations.ABOUT.EDUCATION.page;
          });
          document
            .querySelectorAll(".about-education-description")
            .forEach((element) => {
              element.textContent = translations.ABOUT.EDUCATION.DESCRIPTION;
            });

          // Support section within about
          document.querySelector(".sup-page").textContent =
            translations.ABOUT.SUPPORT.page;
          document.querySelector(".about-support-description").textContent =
            translations.ABOUT.SUPPORT.DESCRIPTION;

          document.querySelectorAll(".sign-intro").forEach((element) => {
            element.textContent = translations.ABOUT.sign_intro;
          });
        }

        console.log("Translations updated:", translations);
      })
      .catch((error) => console.error("Error fetching translations:", error));
  };

  const updateButtonVisibility = (lang) => {
    const btnAr = document.getElementById("btn-ar");
    const btnEn = document.getElementById("btn-en");
    if (lang === "ar") {
      btnAr.style.display = "none";
      btnEn.style.display = "";
    } else {
      btnAr.style.display = "";
      btnEn.style.display = "none";
    }
  };

  const updateDirectionAndStylesheet = (lang) => {
    const rtlStylesheetId = "rtl-stylesheet";
    const existingRtlStylesheet = document.getElementById(rtlStylesheetId);

    if (lang === "ar") {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";

      if (!existingRtlStylesheet) {
        const link = document.createElement("link");
        link.id = rtlStylesheetId;
        link.rel = "stylesheet";
        link.href = "css/rtl.css";
        document.head.appendChild(link);
      }
    } else {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";

      if (existingRtlStylesheet) {
        existingRtlStylesheet.remove();
      }
    }
  };

  document.getElementById("btn-ar").addEventListener("click", (e) => {
    e.preventDefault();
    setLanguage("ar");
  });

  document.getElementById("btn-en").addEventListener("click", (e) => {
    e.preventDefault();
    setLanguage("en");
  });

  const currentLang = localStorage.getItem("lang") || "en"; // Retrieve language preference from local storage
  console.log(`Current language from local storage: ${currentLang}`);
  fetchTranslations(currentLang);
  updateButtonVisibility(currentLang);
  updateDirectionAndStylesheet(currentLang);
});
