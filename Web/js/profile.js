document.addEventListener("DOMContentLoaded", function () {
  const personalInfoTab = document.querySelector(
    ".nav-section ul li:nth-child(1)"
  );
  const accountInfoTab = document.querySelector(
    ".nav-section ul li:nth-child(2)"
  );
  const emailSection = document.querySelector(".email-section");
  const passwordSection = document.querySelector(".password-section");
  const nameSection = document.querySelector(".name-section");
  const genderSection = document.querySelector(".gender-section");
  const saveSection = document.querySelector(".save-section");

  personalInfoTab.addEventListener("click", function () {
    personalInfoTab.classList.add("active");
    accountInfoTab.classList.remove("active");
    emailSection.style.display = "grid";
    passwordSection.style.display = "grid";
    saveSection.style.display = "grid";
    nameSection.style.display = "none";
    genderSection.style.display = "none";
    saveSection.style.display = "none";
  });

  accountInfoTab.addEventListener("click", function () {
    accountInfoTab.classList.add("active");
    personalInfoTab.classList.remove("active");
    emailSection.style.display = "none";
    passwordSection.style.display = "none";
    saveSection.style.display = "none";
    nameSection.style.display = "grid";
    genderSection.style.display = "grid";
    saveSection.style.display = "grid";

    // Change form content for Account Information
    if (nameSection && genderSection && saveSection) {
      nameSection.innerHTML = `
          <label for="name">Name</label>
          <input type="text" id="name"/>
        `;
      genderSection.innerHTML = `
          <label for="gender">Gender</label>
            <select id="gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
           </select>
        `;
      saveSection.innerHTML = `
          <button>Save</button>
        `;
    }
  });
});
