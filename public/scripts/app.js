/******************************
 *   CLIENT SIDE JAVASCRIPT   *
 ******************************/
let $scoresList;
let allScores = [];
let topDs = [];

//feed the right objects to browsers for speech recognition compatibility
//////////*************** must use "var" on lines 11, 12 & 13 ***************//////////
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

//words to recognize which will be used to trigger the player's move functions
let directions = ["up", "down", "left", "right"];

//set grammar format to use (in this case JSpeech Grammar Format) and properly format each element in the directions array;
let grammar = "#JSGF V1.0; grammar directions; public <direction> = " + directions.join(" | ") + " ;";

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
//set whether SR will continue to recognize or stop after endofspeech each time
recognition.continuous = true;

//starting the speech recognition & telling it what to do with the speech received:

//grab references to the output div and the HTML element so we can output disgnostic messages and use the transcribed words to trigger the move functions
let diagnostic = document.querySelector(".output");
//can use this (below) variable inside the INSTRUCTIONS text to print out a list of the acceptable words
let directionHTML = "";
//populate the directionHTML variable with the list of words
directions.forEach(function(ele) {
  directionHTML += "<span class='directionHTML'>" + ele + " </span>";
});

/******************************
 *   DOCUMENT.READY Function  *
 ******************************/

$(document).ready(function() {
  //give the array of all the scores as HTML to the scores-target
  $scoresList = $(".scores-target");

  $(".modal").modal();

/********************************
 *   AJAX REQUESTS to Express   *
 *******************************/

  //ajax INDEX 'GET' request
  $.ajax({
    method: "GET",
    url: "/scores",
    success: indexSuccess,
    error: indexError
  });

  //ajax NEW 'POST' request
  $(".newHSForm").on("submit", function(ele) {
    ele.preventDefault();
    $.ajax({
      method: "POST",
      url: "/scores",
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
      return b.highScore - a.highScore;
    });

    let topDogs = topScores.splice(0,3);
    topDogs.forEach(function(el) {
      $scoresList.append(`<tr><th class="score-name">${el.name}</th><th class="score-num">${el.highScore}</th></tr>`);
    });
    allScores = topDogs;
    //below: topDs for use later when checking new score against existing HS's
    topDogs.forEach(function(item) {
      topDs.push(item.highScore);
    });
  }

  //error with GET all scores
  function indexError() {
    $scoresList.text("Failed to load TOP DOGS.");
  }

  //POST new high score
  function newHSSuccess(jsonData) {
    allScores.push(jsonData);
    $scoresList.empty();
    indexSuccess(allScores);
  }

  //error with POST new high score
  function newHSError() {
    $scoresList.text("Error adding new high score");
  }

/**************************
 *   PLAYER/GAME SET-UP   *
 *************************/

  $(".agree-btn").on("click", reset);

  let p1 = new Player(3,1), p2 = new Player(1,2), p3 = new Player(1,1);
  let p4 = new Player(1,4), p5 = new Player(3,4), p6 = new Player(4,3);
  let p7 = new Player(2,2), p8 = new Player(2,1), p9 = new Player(4,1), p10 = new Player(4,4);

  let trgt1 = new Player(1,3), trgt2 = new Player(3,3), trgt3 = new Player(2,3);
  let trgt4 = new Player(4,1), trgt5 = new Player(1,1), trgt6 = new Player(2,2);
  let trgt7 = new Player(3,4), trgt8 = new Player(4,4), trgt9 = new Player(1,3), trgt10 = new Player(1,2);

  const fences = [[], [], [], [], [], [2,2], [3,2], [2,3], [3,3], [3,2], [3,3]];

  const levels =
  [
    [],
    [p1, trgt1],[p2, trgt2],
    [p3, trgt3],[p4, trgt4],
    [p5, trgt5],[p6, trgt6],
    [p7, trgt7],[p8, trgt8],
    [p9, trgt9],[p10,trgt10],
  ];

//TODO: Why does the line below work & the following line doesn't now????
  let g1 = new Game(levels[1][0], levels[1][1], 1);
  // setLevel(1);

  //Level & Score appear on page:
  function renderLevelAndScore() {
    document.querySelector(".score").innerHTML = `<h5 class="score-text">SCORE: ${g1.score}</h5>`;
    document.querySelector(".level").innerHTML = `<h4 class="level-header">LEVEL: ${g1.level}</h5>`;
  }
  renderLevelAndScore();

  //set the dog in its square on the grid
  function setPlayer() {
    let square = document.querySelector(g1.player.loc);
    let dog = document.querySelector(".player");
    square.appendChild(dog);
  }
  setPlayer();

  //set the ball in its square on the grid
  function setTarget() {
    document.querySelector(g1.target.loc).innerHTML = "<img src='images/ball-2.png' class='ball target'/>";
  }
  setTarget();

  //set up obstacles on the grid
  function setFences() {
    let fence = fences[g1.level], rw = fence[0], cl = fence[1];
    document.querySelector(`.row-${rw}.col-${cl}`).innerHTML = "<img src='images/fence-2.png' class='fence'/>";
  }

/**************************
 *   GAME PLAY FUNCTIONS  *
 *************************/
  $(".go-fetch").on("click", function() {

  //////////********************************** TIMER **********************************//////////
    let count = g1.seconds;
    let counter=setInterval(timer, 1000);

    function timer() {
      $(".timer").removeClass("animated tada");

      count = count - 1;
      if (count < 0) {
        clearInterval(counter);
        return;
      }

      if (count < 6) {
        $(".timer").addClass("animated swing infinite");
      }
      //check for win or loss when timer runs out
      if (count === 0) {
        document.querySelector(".timer").innerHTML = "TIME UP!";
        $(".timer").removeClass("animated swing infinite");
        $(".timer").addClass("animated tada");
      } else if (count === 1) {
        document.querySelector(".timer").innerHTML = count + " second";
      } else {
        document.querySelector(".timer").innerHTML = count + " seconds";
      }

      if (count === 0 && !checkForWin()) {
        //if it is a loss, check to see if the user got a high score
        if (!checkForHS()) {
          recognition.stop();
          $(".go-fetch").addClass('disabled');
          $(".loserModal").modal("open");
        } else {
          newHSModalOpen();
        }
      }
    } //end of timer function

  //////////**************************** SPEECH RECOGNITION ****************************//////////
    recognition.start();
    recognition.onresult = function(event) {
      if (count > 0) {
        //identify/grab the last element in the event.results array
        let last = event.results.length -1;
        //grab the first thing inside the "last" element identified above & pull the text from its "transcript"
        let direction = event.results[last][0].transcript;
        //my HTML tag with class ".output" will render the text of the transcript I set to the variable "direction"
        diagnostic.textContent = direction;

        let commands = direction.split(" ");
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
          //if WIN:
          if (checkForWin()) {
            let end = document.querySelector(".target");
            let sq = document.querySelector(g1.player.loc);
            recognition.stop();
            count = 1;
            sq.removeChild(end);
            $(".levelWinModal").modal("open");
          }
          setPlayer();
        });
      }
    };

    //Need to test site with lines 260-266 commented-out
    recognition.onspeechend = function() {
      recognition.stop();
    };

    recognition.onnomatch = function(event) {
      diagnostic.textContent = "GridDog doesn't recognize that command. " + event.error;
    };

    recognition.onerror = function(event) {
      diagnostic.textContent = "Error occured in recognition " + event.error;
    };

  //////////***************************** KEYPRESS MOVES *******************************//////////

    window.addEventListener("keypress", function(ele) {
      if (count > 0) {
        if (ele.keyCode === 119) {
          g1.player.moveUp();
        } else if (ele.keyCode === 115) {
          g1.player.moveDown();
        } else if (ele.keyCode === 97) {
          g1.player.moveLeft();
        } else if (ele.keyCode === 100) {
          g1.player.moveRight();
        }
        //if WIN:
        if (checkForWin()) {
          let end = document.querySelector(".target");
          let sq = document.querySelector(g1.player.loc);
          sq.removeChild(end);
          count = 1;
          recognition.stop();
          $(".levelWinModal").modal("open");
        }
        setPlayer();
      }
    });
  }); //end of GO-FETCH on-click function
  $(".continue-btn").on("click", levelUp);
  $(".no-continue-btn").on("click", newHSModalOpen);

  /**************************
   *   WIN/LOSE FUNCTIONS   *
   *************************/

  function setLevel(level) {
    if (g1.level === 3) {
      $(".chapter-1").toggleClass("chapter-2");
      $(".init-hidden").show();
    }
    g1 = new Game(levels[level][0], levels[level][1], level);
    if (g1.level > 4) {
      setFences();
    }
    setPlayer();
    setTarget();
    renderLevelAndScore();
  }

  function levelUp() {
    if (g1.level !== 10) {
      setLevel(g1.level + 1);
      diagnostic.textContent = "";
    } else {
      document.querySelector(".score").innerHTML = `<h5 class="score-text">SCORE: 1000</h5>`;
      $(".HS").attr("value", "1000");
      $(".HS").attr("readonly", "readonly");
      $(".newHSModal").modal("open");
    }
  }

  function checkForWin() {
    if (g1.player.loc === g1.target.loc) {
      return true;
    }
    return false;
  }

  function reset() {
    location.reload(true);
  }

  function checkForHS() {
    let result = [];
    topDs.forEach(function(el) {
      if (g1.score >= el) {
        result.push("yes");
      }
    });
    return result.includes("yes");
  }

  function newHSModalOpen() {
    $(".go-fetch").addClass('disabled');
    $(".HS").attr("value", `${g1.score}`);
    $(".HS").attr("readonly", "readonly");
    $(".newHSModal").modal("open");
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

//GAME CLASS, CONSTRUCTOR & METHODS:
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
    if (this.level < 4) {
      secs = 16;
    } else {
      secs = 31;
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
    if (this.level <= 3) {
      return 3;
    } else {
      return 4;
    }
  }
  calcColMax() {
    if (this.level <= 3) {
      return 3;
    } else {
      return 4;
    }
  }
} //end of GAME class
