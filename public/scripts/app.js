/******************************
 *   CLIENT SIDE JAVASCRIPT   *
 ******************************/

console.log("Sanity Check!")
let $scoresList;
let allScores = [];


//feed the right objects to browsers for speech recognition compatibility
//////////*************** must use "var" on lines 11, 12 & 13 ***************//////////
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

//words to recognize which will be used to trigger the player's move functions
let directions = ["move", "up", "down", "left", "right"];

//set grammar format to use (in this case JSpeech Grammar Format) and properly format each element in the directions array;
let grammar = "#JSGF V1.0; grammar directions; public <direction> = " + directions.join(" | ") + " ;"

//define a speech recogntion instance to control the recognition for the app
let recognition = new SpeechRecognition();
//create a new speech grammar list to contain our grammar
let speechRecognitionList = new SpeechGrammarList();
//add our grammar to the SpeechGrammarList
speechRecognitionList.addFromString(grammar, 1);
//add the above to the speech recognition instance by setting it as the value of the "grammars" property/key.
recognition.grammars = speechRecognitionList;

//setting additional SR properties:
//set the language
recognition.lang = "en-US";
//set whether or not the SR system should return interim results
recognition.interimResults = false;
//set the number of alternative potenetial matches which should be returned per result
recognition.maxAlternatives = 1;

recognition.continuous = true;

//starting the speech recognition & telling it what to do with the speech received:

//grab references to the output div and the HTML element so we can output disgnostic messages and use the transcribed words to trigger the move functions
let diagnostic = document.querySelector(".output");
//grab the player HTML element so we can move it (this MAY not be needed with the way I have already set-up the player to move via WASD keys)
let bg = document.querySelector(".player")
//can use this (below) variable inside the INSTRUCTIONS text to print out a list of the acceptable words
let directionHTML = "";
//populate the directionHTML variable with the list of words
directions.forEach(function(ele) {
  directionHTML += "<span class='directionHTML'>" + ele + " </span>";
});

$(document).ready(function() {

  //give the array of all the scores as HTML to the scores-target
  $scoresList = $(".scores-target");

  /*this is currently what allows the test button to trigger the newHSForm
    modal to open when clicked. This will later need to be replaced so that
    the modal is triggered to open when a user's score is in the top 3!
  */
  $(".modal").modal();

/********************************
 *   AJAX REQUESTS to Express   *
 *******************************/

  //ajax INDEX 'GET' request
  $.ajax({
    method: 'GET',
    url: '/scores',
    success: indexSuccess,
    error: indexError
  });

  //ajax NEW 'POST' request
  $('#newHSForm').on('submit', function(ele) {
    ele.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/scores',
      data: $(this).serialize(),
      success: newHSSuccess,
      error: newHSError
    });
  });



/*********************************
 *   SUCCESS & ERROR FUNCTIONS   *
 ********************************/

  //GET all scores
  function indexSuccess(jsonData) {
    allScores = jsonData;
    let topScores = allScores.sort(function(a,b) {
      return b.highScore - a.highScore
    });
    console.log(topScores)
    let topDogs = topScores.splice(0,3);
    topDogs.forEach(function(el) {
      $scoresList.append(`<tr><th class="score-name">${el.name}</th><th class="score-num">${el.highScore}</th></tr>`);
    });
    allScores = topDogs;
  }

  //error with GET all scores
  function indexError() {
    $scoresList.text("Failed to load TOP DOGS.")
  }

  //POST new high score
  function newHSSuccess(jsonData) {
    console.log('reached new high score success function' + jsonData)
    allScores.push(jsonData);
    console.log(allScores);
    $scoresList.empty();
    indexSuccess(allScores);
  }

  //error with POST new high score
  function newHSError() {
    console.log('error posting new high score');
  }

/**************************
 *   PLAYER/GAME SET-UP   *
 *************************/

  let p1 = new Player(3,1);
  let p2 = new Player(1,2);
  let p3 = new Player(1,1);
  let p4 = new Player(3,3);
  let p5 = new Player(2,2);

  let trgt1 = new Player(1,3);
  let trgt2 = new Player(3,3);
  let trgt3 = new Player(2,3);
  let trgt4 = new Player(1,1);
  let trgt5 = new Player(1,1);

  const levels = [
    [],
    [p1, trgt1],
    [p2, trgt2],
    [p3, trgt3],
    [p4, trgt4],
    [p5, trgt5]
  ];

  setLevel(1);
  $(".agree-btn").on("click", reset);

  //Level & Score appear on page:
  function renderLevelAndScore() {
    document.querySelector('.score').innerHTML = `<h5 class="score-text">SCORE: ${g1.score}</h5>`;
    document.querySelector('.level').innerHTML = `<h4 class="level-header">LEVEL: ${g1.level}</h5>`;
  };
  renderLevelAndScore();


  //set the dog in its square on the grid
  function setPlayer() {
    let square = document.querySelector(g1.player.loc);
    let dog = document.querySelector(".player");
    square.appendChild(dog);
    //document.querySelector(g1.player.loc).innerHTML = '<img src="images/grid-dog-head.png" class="dog-head player"/>'
  }
  setPlayer();

  //set the ball in its square on the grid
  function setTarget() {
    document.querySelector(g1.target.loc).innerHTML = "<img src='images/ball-2.png' class='ball target'/>"
  }
  setTarget();

/**************************
 *   GAME PLAY FUNCTIONS  *
 *************************/
  $(".go-fetch").on("click", function() {

    //////////********************************** TIMER **********************************//////////
    //timer-related variables
    var count = g1.seconds;
    var counter=setInterval(timer, 1000);

    //timer function
    function timer() {
      $('.timer').removeClass("animated tada");
      count = count -1;
      if (count < 0) {
        clearInterval(counter);
        return;
      };
      if (count < 6) {
        $('.timer').addClass("animated swing infinite");
      };
      if (count === 0) {
        document.getElementById('timer').innerHTML = 'TIME UP!';
        $('.timer').removeClass("animated swing infinite");
        $('.timer').addClass("animated tada");
      } else if (count === 1) {
        document.getElementById('timer').innerHTML = count + ' second';
      } else {
        document.getElementById('timer').innerHTML = count + ' seconds';
      };
    }; //end of timer function

  //////////**************************** SPEECH RECOGNITION ****************************//////////
    recognition.start();
    console.log("Ready to receive command.")

    recognition.onresult = function(event) {
      if (count > 0) {
        let end = document.querySelector(".target");
        //identify/grab the last element in the event.results array
        let last = event.results.length -1;
        //grab the first thing inside the "last" element identified above & pull the text from its "transcript"
        let direction = event.results[last][0].transcript;
        //my HTML tag with class ".output" will render the text of the transcript I set to the variable "direction"
        diagnostic.textContent = direction;

        let commands = direction.split(" ")
        commands.forEach(function(ele) {
          if (ele === "up") {
            g1.player.moveUp();
          } else if (ele === "right") {
            g1.player.moveRight();
          } else if (ele === "left") {
            g1.player.moveLeft();
          } else if (ele === "down") {
            g1.player.moveDown();
          }
          //see how sure/confident the web speech API is in the word(s) it has identified
          console.log('Confidence: ' + event.results[0][0].confidence);
          let sq = document.querySelector(g1.player.loc);
          //if WIN:
          if (checkForWin()) {
            recognition.stop();
            count = 1;
            sq.removeChild(end);
            $('.levelWinModal').modal('open');
            $('.continue').on('click', levelUp);
          }
          setPlayer();
      });
    };
  };

    recognition.onspeechend = function() {
      recognition.stop();
    };

    recognition.onspeechstart = function() {
      recognition.start();
    }

    recognition.onnomatch = function(event) {
      diagnostic.textContent = "GridDog doesn't recognize that command."
    };

    recognition.onerror = function(event) {
      diagnostic.textContent = "Error occured in recognition " + event.error;
    }

  //////////***************************** KEYPRESS MOVES *******************************//////////

    window.addEventListener('keypress', function(ele) {
      if (count > 0) {
        let end = document.querySelector(".target");
        if ((ele.keyCode === 119)) {
          g1.player.moveUp();
        } else if (ele.keyCode === 115) {
          g1.player.moveDown();
        } else if (ele.keyCode === 97) {
          g1.player.moveLeft();
        } else if (ele.keyCode === 100) {
          g1.player.moveRight();
        }
        let sq = document.querySelector(g1.player.loc);
        //if WIN:
        if (checkForWin()) {
          count = 1;
          sq.removeChild(end);
          recognition.stop();
          $('#levelWinModal').modal('open');
          $('.continue').on('click', levelUp);
        }
        setPlayer();
      }
    });
  }); //end of GO-FETCH on-click function

  /**************************
   *   WIN/LOSE FUNCTIONS   *
   *************************/

  function checkForWin() {
    if (g1.player.loc === g1.target.loc) {
      console.log("win");
      return true;
    }
    console.log("not a winning move");
    return false;
  }

  function levelUp() {
    setLevel(g1.level + 1);
    diagnostic.textContent = "";
    document.querySelector(".timer").innerHTML = "";
  }

  function setLevel(level) {
    g1 = new Game(levels[level][0], levels[level][1], level);
    setPlayer();
    setTarget();
    renderLevelAndScore();
  }

  function reset() {
    setLevel(1);
  }

}); //end of doc.ready function

/***************
 *   CLASSES   *
 **************/

//   PLAYER CLASS, CONSTRUCTOR & METHODS:
class Player {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }
  get loc() {
    return this.calcLocation();
  }
  calcLocation() {
    return `.row-${this.row}.col-${this.col}`;
  }
  moveUp() {
    if (this.row > 1) {
      this.row = this.row - 1;
    }
    return this.loc;
  }
  moveDown() {
    if (this.row < this.game.rowMax) {
      this.row = this.row + 1;
    }
    return this.loc;
  }
  moveRight() {
    if (this.col < this.game.colMax) {
      this.col = this.col + 1;
    }
    return this.loc;
  }
  moveLeft() {
    if (this.col > 1) {
      this.col = this.col - 1;
    }
    return this.loc;
  }
} //end of PLAYER class



//   GAME CLASS, CONSTRUCTOR & METHODS:
class Game {
  constructor(player, target, level) {
    this.player = player;
    player.game = this;
    this.target = target;
    this.level = level;
  }
  get score() {
    return this.calcScore();
  }
  calcScore() {
    return (this.level - 1) * 100;
  }
  get seconds() {
    return this.calcSeconds();
  }
  calcSeconds() {
    let secs;
    if (this.level <= 3) {
      secs = 15;
    } else {
      secs = 30;
    }
    return secs;
  }
  get rowMax() {
    return this.calcRowMax();
  }
  get colMax() {
    return this.calcColMax();
  }
  calcRowMax() {
    if (this.level < 5) {
      return 3;
    } else {
      return 4;
    }
  }
  calcColMax() {
    if (this.level < 5) {
      return 3;
    } else {
      return 4;
    }
  }
} //end of GAME class


/* TODO: update game-grid appearance, include background-color, makes lines slate-blue & thicker */
/* TODO: add some more basic styling to instructions-box (padding, justify <p>) */

/* TODO: IMPORTANT  add ids to each game-grid square with the names currently in the boxes (A1-C3) */
/* TODO: "P" or some symbol representing Player rendering on game-grid in bottom-left corner */
/* TODO: "T" or some symbol representing Target rendering in random square of game-grid other than
    bottom-left corner */
/* QUESTION: should the "P" & "T" appear on doc.ready or when go-fetch is clicked? */

/* TODO: initialize score variable to zero */
/* TODO: connect value of the score variable to be displayed as "SCORE: " in navbar */
