document.addEventListener("DOMContentLoaded", function () {
  // Select necessary elements from the DOM
  const messagesContainer = document.querySelector(".messages");
  const close = document.getElementById("close");
  const closeChat = document.getElementById("close-chat");
  const chatbotMessage = document.getElementById("chatbot-message");
  const chatbotImg = document.getElementById("chatbot-img");
  const chatReady = document.getElementById("chat-ready");
  const chatStart = document.getElementById("chat-start");
  var allButtons = document.querySelectorAll(".options button");

  // Event listener for the close button
  close.addEventListener("click", function () {
    // Hide the close button and the chatbot message
    close.style.display = "none";
    chatbotMessage.style.display = "none";
  });

  // Event listener for clicking on the chatbot image
  chatbotImg.addEventListener("click", function () {
    // Hide the chat-ready section, show the chat-start section, and scroll to the top
    chatReady.style.display = "none";
    chatStart.style.top = "0px";
    chatStart.classList.remove("dis");
    messagesContainer.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Event listener for clicking on the close-chat button
  closeChat.addEventListener("click", function () {
    // Show the chat-ready section, hide the chat-start section, and clear messages and options
    chatReady.style.display = "flex";
    chatStart.style.top = "600px";
    chatStart.classList.add("dis");
    document
      .querySelectorAll(".user-message, .robo-message")
      .forEach(function (element) {
        element.remove();
      });
    Array.from(document.querySelectorAll(".options"))
      .slice(1)
      .forEach(function (element) {
        element.remove();
      });
    // Enable all option buttons
    allButtons.forEach(function (button) {
      button.disabled = false;
      button.classList.remove("disabled");
    });
  });

  // Add 'onscroll' event listener to the messages container
  messagesContainer.onscroll = function () {
    // Calculate the difference between the scroll height and the client height
    var scrollDifference =
      messagesContainer.scrollHeight - messagesContainer.clientHeight;

    // Hide the "New Message" section if the user has scrolled to the bottom
    var newMessageSection = document.querySelector(".new-message");
    if (scrollDifference <= messagesContainer.scrollTop) {
      newMessageSection.style.display = "none";
    }
  };
});

function chooseButton(buttonId) {
  // Define responses based on button id
  let roboMessage = "";
  const lang = localStorage.getItem("lang");
  if (lang === "en") {
    switch (buttonId) {
      case "one":
        roboMessage = `<span>Please take a screenshot of the error you encountered, whether it's related to avatar movement or written text (when using sign language), and send it to our <a href='mailto:sherefalex34@gmail.com'>Email</a> along with details of the error. The error will be fixed as soon as possible.</span>`;
        break;
      case "two":
        roboMessage = `<span>1- If you have forgotten your account password, please go to the <a href='/reset'>Password Reset page</a>, enter your email, and a message with a link will be sent to your email. Click on the link to be able to set a new password.</span><br><br><span>2- If you are experiencing issues updating your personal information, please make sure to use a name that does not contain an ampersand (&), equals sign (=), underscore (_), apostrophe ('), dash (-), plus sign (+), comma (,), brackets (<,>), or more than one period (.).</span>`;
        break;
      case "three":
        roboMessage = `<span>1- If you are facing issues accessing the learning platform or if the course videos are unavailable, please send us the details via <a href='mailto:sherefalex34@gmail.com'>Email</a> along with some screenshots illustrating the problem.</span><br><br><span>2- If you would like us to provide another course for you, please provide us with the course details through our <a href='mailto:sherefalex34@gmail.com'>Email</a>.</span>`;
        break;
      case "four":
        roboMessage = `<span>Please contact us via <a href='mailto:sherefalex34@gmail.com'>Email</a> if you are experiencing any unmentioned issues.</span>`;
        break;
      default:
        roboMessage = "Default message if no case matches"; // Add a default case if needed
    }
  } else if (lang === "ar") {
    switch (buttonId) {
      case "one":
        roboMessage = `<span>يرجى التقاط لقطة شاشة للخطأ الذي واجهته، سواء كان ذلك يتعلق بحركة الافاتار أو النص المكتوب (عند استخدام لغة الإشارة)، وإرسالها إلى <a href='mailto:sherefalex34@gmail.com'>البريد الإلكتروني</a> لدينا مع تفاصيل الخطأ. سيتم إصلاح الخطأ في أقرب وقت ممكن.</span>`;
        break;
      case "two":
        roboMessage = `<span>1- إذا نسيت كلمة المرور الخاصة بحسابك، يرجى الانتقال إلى <a href='/reset'>صفحة إعادة تعيين كلمة المرور</a>، أدخل بريدك الإلكتروني، وسيتم إرسال رسالة بريد إلكتروني تحتوي على رابط إلى بريدك الإلكتروني. انقر فوق الرابط لتتمكن من ضبط كلمة مرور جديدة.</span><br><br><span>2- إذا كنت تواجه مشاكل في تحديث معلوماتك الشخصية، يرجى التأكد من استخدام اسم لا يحتوي على علامة التعجب (&)، علامة اليساوي (=)، شرطة سفلية (_)، علامة اقتباس ('،)، شرطة (-)، علامة زائد (+)، فاصلة (،)، أقواس زاوية (<،>)، أو أكثر من نقطة واحدة (.).</span>`;
        break;
      case "three":
        roboMessage = `<span>1- إذا كنت تواجه مشكلات في الوصول إلى منصة التعلم أو إذا كانت مقاطع الفيديو التعليمية غير متاحة، يرجى إرسال لنا التفاصيل عبر <a href='mailto:sherefalex34@gmail.com'>البريد الإلكتروني</a> مع بعض اللقطات لشرح المشكلة.</span><br><br><span>2- إذا كنت ترغب في أن نقدم لك دورة أخرى، يرجى تقديم تفاصيل الدورة من خلال <a href='mailto:sherefalex34@gmail.com'>البريد الإلكتروني</a> الخاص بنا.</span>`;
        break;
      case "four":
        roboMessage = `<span>يرجى الاتصال بنا عبر <a href='mailto:sherefalex34@gmail.com'>البريد الإلكتروني</a> إذا كنت تواجه أي مشاكل غير مذكورة.</span>`;
        break;
      default:
        roboMessage = "الرسالة الافتراضية إذا لم يتم التطابق مع أي حالة"; // Add a default case if needed
    }
  }

  // Select necessary elements from the DOM
  const messagesContainer = document.querySelector(".messages");
  const newMessageSection = document.querySelector(".new-message");
  const allButtons = document.querySelectorAll(".options button");

  // Create new elements for user message, robo message, and options
  const newDivUser = document.createElement("div");
  const newDivRobo = document.createElement("div");
  const newDivOptions = document.createElement("div");

  // Add classes to the newly created elements
  newDivUser.classList.add("user-message");
  newDivRobo.classList.add("robo-message");
  newDivOptions.classList.add("options");

  // Set innerHTML for user message and robo message
  const buttonText = document.getElementById(buttonId).textContent.trim();
  newDivUser.innerHTML = `<p>${buttonText}</p>`;
  newDivRobo.innerHTML = `<img src="images/chatbot.png" alt="chatbot" /> <p>${roboMessage}</p>`;

  // Adjust styling for the robo message
  newDivRobo.style.marginTop = "20px";

  // Append user message to the messages container and scroll into view
  messagesContainer.appendChild(newDivUser);
  newDivUser.scrollIntoView({ behavior: "smooth" });

  // Display the "New Message" section
  newMessageSection.style.display = "flex";

  // Append robo message and options to the messages container
  messagesContainer.appendChild(newDivRobo);
  messagesContainer.appendChild(newDivOptions);

  // Clone and append the last four option buttons, disable them, and add a "disabled" class
  const lastFourButtons = Array.from(allButtons).slice(-4);
  lastFourButtons.forEach(function (button) {
    const clonedButton = button.cloneNode(true);
    clonedButton.onclick = button.onclick; // Reattach event listener
    newDivOptions.appendChild(clonedButton);
    button.disabled = true;
    button.classList.add("disabled");
  });
}

function scrollToBottom() {
  // Get the messages container
  var messagesContainer = document.querySelector(".messages");

  // Scroll to the bottom of the messages container with smooth behavior
  messagesContainer.scrollTo({
    top: messagesContainer.scrollHeight,
    behavior: "smooth",
  });

  // Hide the "New Message" section
  var newMessageSection = document.querySelector(".new-message");
  newMessageSection.style.display = "none";
}
