const cardsContainer = document.getElementById("cards-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const currentEl = document.getElementById("current");
const ShowBtn = document.getElementById("show");
const hideBtn = document.getElementById("hide");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");

// Keep track of current card
let currentActiveCard = 0;

// Store DOM cards
const cardsEl = [];

// Store card data
// const cardsData = getCardsData();

// Store card data
const cardsData = [
  {
    question: "احباط",
    src: "/images/الاحباط.png",
  },
  {
    question: "توقف",
    src: "/images/stop.png",
  },
  {
    question: "التوتر",
    src: "/images/التوتر.png",
  },
  {
    question: "الحزن",
    src: "/images/الحزن.png",
  },
  {
    question: "الخوف",
    src: "/images/الخوف.png",
  },
  {
    question: "مرحباً",
    src: "/images/مرحبا.png",
  },
  {
    question: "الاهتمام",
    src: "/images/الاهتمام.jpeg",
  },
  {
    question: "ما اسمك؟",
    src: "/images/ما اسمك؟.jpeg",
  },
  {
    question: "التصميم",
    src: "/images/التصميم.jpeg",
  },
  {
    question: "لاحظ",
    src: "/images/لاحظ.jpeg",
  },
  {
    question: "الغيرة",
    src: "/images/الغيره.jpeg",
  },
  {
    question: "كيف حالك؟",
    src: "/images/كيف حالك.jpeg",
  },
  {
    question: "فَكر",
    src: "/images/فكر.jpeg",
  },
  {
    question: "التشجيع",
    src: "/images/التشجيع.jpeg",
  },
  {
    question: "احترام",
    src: "/images/احترام.jpeg",
  },
  {
    question: "التسامح",
    src: "/images/التسامح.jpeg",
  },
  {
    question: "هل انت بخير",
    src: "/images/هل انت بخير.jpeg",
  },
  {
    question: "تصبح علي خير",
    src: "/images/تصبح علي خير.jpeg",
  },
  {
    question: "شكراً",
    src: "/images/شكرا.png",
  },
];

// Create all cards
function createCards() {
  cardsData.forEach((data, index) => createCard(data, index));
}

// Create a single card in DOM
function createCard(data, index) {
  const card = document.createElement("div");
  card.classList.add("card");

  if (index === 0) {
    card.classList.add("active");
  }

  card.innerHTML = `
  <div class="inner-card">
    <div class="inner-card-front">
      <p>${data.question}</p>
    </div>
    <div class="inner-card-back">
      <img src="${data.src}" alt="">
    </div>
  </div> `;
  card.addEventListener("click", () => card.classList.toggle("show-answer"));

  // Add to DOM cards
  cardsEl.push(card);
  cardsContainer.appendChild(card);
  updateCurrentText();
}

// Show number of cards
function updateCurrentText() {
  currentEl.innerHTML = `${currentActiveCard + 1}/${cardsEl.length}`;
}

createCards();

// Event listeners
// Next button
nextBtn.addEventListener("click", () => {
  cardsEl[currentActiveCard].className = "card left";
  currentActiveCard = currentActiveCard + 1;
  if (currentActiveCard > cardsEl.length - 1) {
    currentActiveCard = cardsEl.length - 1;
  }

  cardsEl[currentActiveCard].className = "card active";
  updateCurrentText();
});

// prev button
prevBtn.addEventListener("click", () => {
  cardsEl[currentActiveCard].className = "card right";
  currentActiveCard = currentActiveCard - 1;
  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  }

  cardsEl[currentActiveCard].className = "card active";
  updateCurrentText();
});
