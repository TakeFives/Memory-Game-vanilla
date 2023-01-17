
const gameCards = document.querySelectorAll('.game-card');
const restartButton = document.querySelector('.restart-button');
const playAgainLink = document.querySelector('.play-again');

let cardHasFlipped = false;
let freezeBoard = false;

let cardOne;
let cardTwo;

let moves = 0;
let counter = document.querySelector(".moves");
let score = document.querySelector(".score");

let popUp = document.querySelector('.popup');
const popUpPlayAgain = document.querySelector('.play-again');

function flipCard () {
  if (freezeBoard) return;
  if (this === cardOne) return;

  this.classList.add('flip-card');

  if(!cardHasFlipped){
    cardHasFlipped = true;
    cardOne = this;    
    return;
  }

  cardTwo = this;
  
  checkIfMatch();
  moveCounter();
  wellDone();
}

function checkIfMatch() {

  if(cardOne.dataset.framework === cardTwo.dataset.framework){
    freezeCards();
    return;
  }
  undoFlipCards();
}

function freezeCards() {
  cardOne.removeEventListener('click', flipCard);
  cardTwo.removeEventListener('click', flipCard);
  cardOne.classList.add('match');
  cardTwo.classList.add('match');
  resetBoard();
}

function undoFlipCards(){
  freezeBoard = true;
  setTimeout(() =>{
    cardOne.classList.remove('flip-card');
    cardTwo.classList.remove('flip-card');
    resetBoard();
  }, 1000);
}

function resetBoard(){
  cardHasFlipped = false;
  freezeBoard = false;
  cardOne = null;
  cardTwo = null;
}

(function shuffle(){
  gameCards.forEach( gameCard => {
    let random = Math.floor(Math.random() * 12);
    gameCard.style.order = random;
  });
})();

function moveCounter(){
  moves++;
  counter.innerHTML = moves;
  score.innerHTML = moves;
}

function restart() {
  gameCards.forEach( el => el.classList.remove('flip-card','match'));

  moves = 0;
  counter.innerHTML = moves;

  (function shuffle(){
    gameCards.forEach( gameCard => {
      let random = Math.floor(Math.random() * 12);
      gameCard.style.order = random;
    });
  })();

}

function wellDone(){
  let matchCards = document.getElementsByClassName('match');
  
  if(matchCards.length === 12){
    popUp.style.display = 'flex';
    
    let someScore = localStorage.getItem('score');

    if(someScore === null){
      localStorage.setItem('score', moves);
    } else {
      let newSomeScore = someScore.split(',');
      newSomeScore.push(moves);

      if (newSomeScore.length > 10){
        newSomeScore.shift();
      }

      localStorage.setItem('score', newSomeScore.join(','));
   
    }
  }
};

function closeModal(){
  popUp.style.display = 'none';
  restart();
}

const scoreTable = document.querySelector('.scores-table');
const topScoresTable = document.createElement('table');
topScoresTable.classList.add('previous-scores');
let row = topScoresTable.insertRow();
let cell;
let perrow = 1;
const localStorageScores = localStorage.getItem('score') || ''
const allScores = localStorageScores.split(',');
// console.log(allScores)

allScores.forEach((value, i) => {
  cell = row.insertCell();
  cell.innerHTML = value;

  let next = i + 1;
    if (next % perrow === 0 && next !== allScores.length) { 
         row = topScoresTable.insertRow(); 
       };
  });
  
scoreTable.appendChild(topScoresTable);

if(localStorageScores === ''){  
  scoreTable.style.display = 'none';
}

const closePopupButton = document.querySelector('.close-popup');


popUp.style.display = 'none';
restartButton.addEventListener('click', restart)
playAgainLink.addEventListener('click', closeModal); 
closePopupButton.addEventListener('click', closeModal); 
gameCards.forEach( el => el.addEventListener ('click', flipCard));