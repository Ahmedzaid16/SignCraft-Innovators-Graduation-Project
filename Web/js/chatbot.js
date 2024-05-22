// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Create the chatbot-ready div element
  const chatReady = document.createElement("div");
  chatReady.classList.add("chatbot-ready"); // Add the "chatbot-ready" class
  chatReady.id = "chat-ready"; // Set the ID to "chat-ready"
  // Create the chatbot-start div element
  const chatStart = document.createElement("div");
  chatStart.classList.add("chatbot-start"); // Add the "chatbot-start" class
  chatStart.classList.add("dis");
  chatStart.id = "chat-start"; // Set the ID to "chat-start"
  // Append the created div elements to the body
  document.body.appendChild(chatReady);
  document.body.appendChild(chatStart);
  // Populate chatReady section with initial HTML
  chatReady.innerHTML = `<div class="chatbot-close" id="close">
    <button><span id="close_mess">Close</span> <i class="fa-solid fa-xmark"></i></button>
  </div>
  <div class="chatbot-message" id="chatbot-message">
    <p class="one" id="help">Help & Support</p>
    <p class="two" id="hello_service">
    <span id="hello1">Hello</span>, <br />
    <span id="hello2">We're at your service, click here to start the conversation now!</span>
    </p>
  </div>
  <div class="chatbot-img" id="chatbot-img">
    <img src="images/chatbot.png" alt="chatbot" />
  </div>`;
  // Populate chatStart section with initial HTML
  chatStart.innerHTML = `<div class="chat">
  <h4 id="chat_robo">Chat With Robo</h4>
  <i id="close-chat" class="fa-solid fa-xmark fa-lg"></i>
</div>
<div class="messages">
  <div class="new-message" onclick="scrollToBottom()">
    <i class="fa-solid fa-chevron-down"></i>
    <p id="new_mess">New Message</p>
  </div>
  <div class="message">
    <img src="images/chatbot.png" alt="chatbot" />
    <p id="greetings">
      Greetings. I am Robo, your dedicated personal assistant, ready and
      at your service to provide insightful answers to any inquiries you
      may have.
    </p>
  </div>
  <div class="message">
    <p id="assist">
      How may I assist you today? Kindly choose from the following
      options to guide me in providing the support you require:
    </p>
  </div>
  <div class="options" id="options">
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

function chooseButton(buttonName, roboMessage) {
  console.log(buttonName);
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
