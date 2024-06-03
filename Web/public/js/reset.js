const colorOptions = ["#FDFFFC", "#2ec3b6", "#011627", "#FF9F1C", "#E71D36"];
let bNum = 2;
let bSize = 8;
let bSpeed = 3;
let bDep = 0.01;
let bDist = 40;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let spots = [];
let hue = 0;

const mouse = {
  x: undefined,
  y: undefined,
};

function init() {
  spots = []; // Initialize or reset the spots array
}

canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
  for (let i = 0; i < bNum; i++) {
    spots.push(new Particle());
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * bSize + 0.1;
    this.speedX = Math.random() * bSpeed - bSpeed / 2;
    this.speedY = Math.random() * bSpeed - bSpeed / 2;
    this.color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > bDep) this.size -= bDep;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function handleParticle() {
  for (let i = 0; i < spots.length; i++) {
    spots[i].update();
    spots[i].draw();
    for (let j = i; j < spots.length; j++) {
      const dx = spots[i].x - spots[j].x;
      const dy = spots[i].y - spots[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < bDist) {
        ctx.beginPath();
        ctx.strokeStyle = spots[i].color;
        ctx.lineWidth = spots[i].size / 3;
        ctx.moveTo(spots[i].x, spots[i].y);
        ctx.lineTo(spots[j].x, spots[j].y);
        ctx.stroke();
      }
    }
    if (spots[i].size <= bDep) {
      spots.splice(i, 1);
      i--;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticle();
  hue++;
  requestAnimationFrame(animate);
}

animate();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const email = document.getElementById("email");

  // Show input error message
  function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control error";
    const small = formControl.querySelector("small");
    small.innerText = message;
  }

  // Show outline success
  function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
  }

  // Check email is valid
  function checkEmail(input) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
      showSuccess(input);
      return true;
    } else {
      showError(input, "Email is not valid");
      return false;
    }
  }

  // Check required fields
  function checkRequired(inputArr) {
    let isValid = true;
    inputArr.forEach(function (input) {
      if (input.value.trim() === "") {
        showError(input, `${getFieldName(input)} is required`);
        isValid = false;
      } else {
        showSuccess(input);
      }
    });
    return isValid;
  }

  // Get field name
  function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
  }

  // Event listeners
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isRequiredValid = checkRequired([email]);
    const isEmailValid = checkEmail(email);

    if (isRequiredValid && isEmailValid) {
      form.submit(); // Programmatically submit the form if all validations pass
    }
  });
});
