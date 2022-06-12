/*
 * Create a list that holds all of your cards
 */
let cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// Create HTML for cards
function generateCard(card) {
  return `<li class="card ${card}" id="${card}"  data-card="${card}"></li>`;
}
//create HTML for leaderboard list
function generateList(list) {
  return `<li class="list">${list.time} <span>${list.level}</span></li>`;
}

const clickedCards = [];
let tempClickedCards;

let levelCounter = document.querySelector(".level");
let restart = document.querySelector(".restart");
let deckContainer = document.querySelector(".deck");
let leaderboard = document.querySelector(".leaderboard");

let level = 0;
let time = 0;
let timer = document.querySelector(".timer");
let liveTimer = 0;
var loseAudio = document.getElementById("loseAudio");

function generateLeaderboard() {
  const list = JSON.parse(window.localStorage.getItem("user"));

  let listHTML = list.map(function (card) {
    return generateList(card);
  });
  leaderboard.innerHTML = listHTML.join("");
}

/*
 * Display the cards on the page
 
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function startGame() {
  // Shuffle cards and create deck
  let cardHTML = cards.map(function (card) {
    return generateCard(card);
  });
  deckContainer.innerHTML = cardHTML.join("");
  levelCounter.innerText = level;
}
//staring game
startGame();
timerFunc();
//generating random number
const GenerateRandom = () => {
  return Math.ceil(Math.random() * 16).toString();
};
//generating unique random number
const rando = () => {
  let ran = GenerateRandom();

  while (clickedCards?.includes(ran)) {
    ran = GenerateRandom();
  }
  return ran;
};

function Card_lightup() {
  randomIndex = rando();

  let deck = document.querySelectorAll(".card");

  deck.forEach(function (card) {
    if (card.classList.contains(randomIndex)) {
      card.classList.add("open", "show");
      clickedCards.push(randomIndex);
      tempClickedCards = clickedCards;

      setTimeout(() => {
        card.classList.remove("open", "show");
      }, 500);
    }
  });
}
//game staring
Card_lightup();
matchCards();

//local storange
const score = [];

function modalWindow(data) {
  // Get the modal
  let modal = document.getElementById("modal");

  // Get modal content
  let modalContent = document.querySelector(".modal-content");

  // Display modal
  modal.style.display = "block";

  // Set content to be displayed
  modalContent.innerHTML =
    `<h2>${data == "lost" ? "Ohh Sorry!" : "Congratulation!"}</h2>` +
    `<p>You ${data} this game ${
      data == "lost" ? "😥😥" : "😮😮"
    }, your level is ${level}  and in ${time} seconds!</p>` +
    "<p>Play again!</p>";

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      Reset();
    }
  };
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function matchCards() {
  let deck = document.querySelectorAll(".card");

  deck.forEach(function (card) {
    card.addEventListener("click", function (evt) {
      if (tempClickedCards[0] == evt.target.id) {
        tempClickedCards = tempClickedCards.filter((id) => id != evt.target.id);
        card.classList.add("open", "show");
        const winAudio = document.getElementById("winAudio");
        winAudio.play();
        setTimeout(() => {
          card.classList.remove("open", "show");
        }, 500);
      } else {
        const loseAudio = document.getElementById("loseAudio");
        loseAudio.play();

        modalWindow("lost");
      }

      if (tempClickedCards.length == 0) {
        setTimeout(() => {
          if (clickedCards.length == 16) {
            deck.forEach(function (card) {
              card.classList.add("open", "show");
            });
            modalWindow("completed");
            return;
          }
          Card_lightup();
          // Increase move count
          level++;
          // Update level text
          levelCounter.innerText = level;
        }, 500);
      }
    });
  });
}

function increaseTime() {
  time++;
  // Update time
  timer.innerText = time;
}

// Increase time every second
function timerFunc() {
  liveTimer = setInterval(increaseTime, 1000);
}

// Stop time
function clearTimer() {
  clearInterval(liveTimer);
}

function Reset() {
  // Reset level
  level = 0;

  // Reset Clicked Cards
  clickedCards.length = 0;

  // Reset Time
  time = 0;
  timer.innerText = time;
  clearTimer();

  // Start game
  startGame();

  Card_lightup();
  matchCards();
  // Start timer
  timerFunc();
}

restart.addEventListener("click", Reset);
