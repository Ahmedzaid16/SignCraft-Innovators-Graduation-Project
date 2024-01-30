// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Create the chatbot-ready div element
  const chatReady = document.createElement("div");
  chatReady.classList.add("chatbot-ready"); // Add the "chatbot-ready" class
  chatReady.id = "chat-ready"; // Set the ID to "chat-ready"
  // Create the chatbot-start div element
  const chatStart = document.createElement("div");
  chatStart.classList.add("chatbot-start"); // Add the "chatbot-start" class
  chatStart.id = "chat-start"; // Set the ID to "chat-start"
  // Append the created div elements to the body
  document.body.appendChild(chatReady);
  document.body.appendChild(chatStart);
  // Populate chatReady section with initial HTML
  chatReady.innerHTML = `<div class="chatbot-close" id="close">
    <button>Close <i class="fa-solid fa-xmark"></i></button>
  </div>
  <div class="chatbot-message" id="chatbot-message">
    <p class="one">Help & Support</p>
    <p class="two">
      Hello, <br />
      We're at your service, click here to start the conversation now!
    </p>
  </div>
  <div class="chatbot-img" id="chatbot-img">
    <img src="images/chatbot.png" alt="chatbot" />
  </div>`;
  // Populate chatStart section with initial HTML
  chatStart.innerHTML = `<div class="chat">
  <h4>Chat With Robo</h4>
  <i id="close-chat" class="fa-solid fa-xmark fa-lg"></i>
</div>
<div class="messages">
  <div class="new-message" onclick="scrollToBottom()">
    <i class="fa-solid fa-chevron-down"></i>
    <p>New Message</p>
  </div>
  <div class="message">
    <img src="images/chatbot.png" alt="chatbot" />
    <p>
      Greetings. I am Robo, your dedicated personal assistant, ready and
      at your service to provide insightful answers to any inquiries you
      may have.
    </p>
  </div>
  <div class="message">
    <p>
      How may I assist you today? Kindly choose from the following
      options to guide me in providing the support you require:
    </p>
  </div>
  <div class="options">
    <button
      id="one"
      onclick="chooseButton('Error in sign language App',\`Please take a screenshot of the error you encountered, whether it's related to avatar movement or written text (when using sign language), and send it to our <a = href='mailto: sherefalex34@gmail.com'>Email</a> along with details of the error. The error will be fixed as soon as possible.\`)"
    >
      Error in sign language App
    </button>
    <button
      id="two"
      onclick="chooseButton('Account-related Inquiries',\`1- If you have forgotten your account password, please go to the <a href='#'>Password Reset page</a>, enter your email, and a message with a link will be sent to your email. Click on the link to be able to set a new password.<br><br>2- If you are experiencing issues updating your personal information, please make sure to use a name that does not contain an ampersand (&), equals sign (=), underscore (_), apostrophe ('), dash (-), plus sign (+), comma (,), brackets (<,>), or more than one period (.).\`)"
    >
      Account-related Inquiries
    </button>
    <button
      id="three"
      onclick="chooseButton('Education and Courses',\`1- If you are facing issues accessing the learning platform or if the course videos are unavailable, please send us the details via <a = href='mailto: sherefalex34@gmail.com'>Email</a> along with some screenshots illustrating the problem.<br><br>2- If you would like us to provide another course for you, please provide us with the course details through our <a = href='mailto: sherefalex34@gmail.com'>Email</a>.\`)"
    >
      Education and Courses
    </button>
    <button
      id="four"
      onclick="chooseButton('Other',\`Please contact us via <a = href='mailto: sherefalex34@gmail.com'>Email</a> if you are experiencing any unmentioned issues.\`)"
    >
      Other
    </button>
  </div>
</div>`;
});

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

function chooseButton(buttonName, roboMessage) {
  // Select necessary elements from the DOM
  const messagesContainer = document.querySelector(".messages");
  var newMessageSection = document.querySelector(".new-message");
  var allButtons = document.querySelectorAll(".options button");

  // Create new elements for user message, robo message, and options
  var newDivUser = document.createElement("div");
  var newDivRobo = document.createElement("div");
  var newDivOptions = document.createElement("div");

  // Add classes to the newly created elements
  newDivUser.classList.add("user-message");
  newDivRobo.classList.add("robo-message");
  newDivOptions.classList.add("options");

  // Set innerHTML for user message and robo message
  newDivUser.innerHTML = `<p>${buttonName}</p>`;
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
  var lastFourButtons = Array.from(allButtons).slice(-4);
  lastFourButtons.forEach(function (button) {
    var clonedButton = button.cloneNode(true);
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