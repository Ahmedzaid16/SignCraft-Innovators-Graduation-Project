//Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countDown = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// Create the AJAX Request
function getQuestion() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      createBullets(qCount); // Create bullets and set questions count
      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);
      // Start timer
      countdown(15, qCount);
      // Click on submit
      submitButton.onclick = () => {
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        let correctAnswerElement = document.querySelector(
          `input[data-answer="${theRightAnswer}"]`
        );
        if (correctAnswerElement) {
          let correctLabel = correctAnswerElement.nextElementSibling; // Get the associated label
          if (correctLabel) {
            correctLabel.classList.add("correct");
          } else {
            console.error(
              `No label found for the right answer: ${theRightAnswer}`
            );
          }
        } else {
          console.error(
            `No input element found for the right answer: ${theRightAnswer}`
          );
        }

        // Add class 'incorrect' to all wrong answer elements
        let allAnswerElements = document.querySelectorAll(
          'input[name="question"]'
        );
        allAnswerElements.forEach((answerElement) => {
          if (answerElement.dataset.answer !== theRightAnswer) {
            let incorrectLabel = answerElement.nextElementSibling; // Get the associated label
            if (incorrectLabel) {
              incorrectLabel.classList.add("incorrect");
            }
          }
        });

        currentIndex++;
        checkAnswer(theRightAnswer, qCount);
        // Delay the following actions by 2 seconds (2000 milliseconds)
        setTimeout(() => {
          quizArea.innerHTML = "";
          answerArea.innerHTML = "";
          addQuestionData(questionsObject[currentIndex], qCount);
          handleBullets();
          clearInterval(countdownInterval);
          countdown(15, qCount);
          showResults(qCount);
        }, 2000);
      };
    }
  };
  myRequest.open("GET", "/html_questions.json", true);
  myRequest.send();
}
getQuestion();

function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i == 0) {
      theBullet.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("img");
    questionTitle.src = obj["title"];
    let questionText = document.createTextNode(obj["title"]);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    for (let i = 1; i <= 3; i++) {
      let mainDev = document.createElement("div");
      mainDev.className = "answer";
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      // if (i === 1) {
      //   radioInput.checked = true;
      // }
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDev.appendChild(radioInput);
      mainDev.appendChild(theLabel);
      answerArea.appendChild(mainDev);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, ${rightAnswers} From ${count}`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResults;
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDown.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
