document.addEventListener("DOMContentLoaded", () => {
  const setLanguage = (lang) => {
    localStorage.setItem("lang", lang); // Store language preference in local storage
    console.log(`Language set to: ${lang}`);
    fetchTranslations(lang);
    updateButtonVisibility(lang);
    updateDirectionAndStylesheet(lang);
    const currentPath = window.location.pathname;
    console.log(currentPath);
    if (currentPath === "/courses") {
      window.location.href = `/courses?lang=${lang}`;
    } else {
      location.reload();
    }
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
        Object.keys(translations).forEach((key) => {
          const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
          elements.forEach((element) => {
            if (
              element.tagName === "INPUT" &&
              element.hasAttribute("placeholder")
            ) {
              element.setAttribute("placeholder", translations[key]);
            } else {
              element.textContent = translations[key];
            }
          });
        });
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