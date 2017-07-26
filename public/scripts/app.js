/******************************
 *   CLIENT SIDE JAVASCRIPT   *
 ******************************/

console.log("Sanity Check!")
let $scoresList;
let allScores = [];

$(document).ready(function() {

  //give the array of all the scores as HTML to the scores-target
  $scoresList = $("scores-target");

  /*this is currently what allows the test button to trigger the newHSForm
    modal to open when clicked. This will later need to be replaced so that
    the modal is triggered to open when a user's score is in the top 3!
  */
  $('.modal').modal();


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
      $('#scores-target').append(`<li>${el.name}, ${el.highScore}</li>`);
    });
    allScores = topDogs;
  }

  //error with GET all scores
  function indexError() {
    $('#scores-target').text("Failed to load TOP DOGS.")
  }

  //POST new high score
  function newHSSuccess(jsonData) {
    console.log('reached new high score success function' + jsonData)
    allScores.push(jsonData);
    console.log(allScores);
    $("#scores-target").empty();
    indexSuccess(allScores);
  }

  //error with POST new high score
  function newHSError() {
    console.log('error posting new high score');
  }


/**********************
 *   GAME FUNCTIONS   *
 **********************/

  let p1 = new Player(3,1);
  console.log(p1.loc);

  const trgt = new Player(1,3);
  console.log(trgt.loc);

  let g1 = new Game(p1, trgt, 1);
  console.log(g1.score, g1.seconds);

  document.getElementById('score').innerHTML = `<h5>SCORE: ${g1.score}</h5>`;

  //initial game-grid showing P for player in bottom-left corner
  function setPlayer() {
    document.querySelector(p1.loc).innerHTML = '<h1 id="player">P</h1>'
  }
  setPlayer();


  //initial game-grid will have hard-coded target (T) in top-right corner
  function setTarget() {
    document.querySelector(trgt.loc).innerHTML = '<h1 id="target">T</h1>'
  }
  setTarget();



  //when go fetch is clicked:
  $('#go-fetch').on('click', function(e) {

    //////////********************************** TIMER **********************************//////////
    //timer-related variables
    /*TODO: when different levels/grid-sizes are incorporated, the count will need
      to be set according to difficulty (so, not always set to 10 seconds) */
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
      }
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

    //////////********************************** MOVES **********************************//////////


  }); //end of GO-FETCH on-click function




}); //end of doc.ready function



/***************
 *   CLASSES   *
 **************/

  class Player {
    constructor(row, col) {
      this.row = row;
      this.col = col;
    }
    get loc() {
      return this.calcLocation();
    }
    calcLocation() {
      return `${this.row}.${this.col}`;
    }
  }

  class Game {
    constructor(player, target, level) {
      this.player = player;
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
        secs = 30;
      } else {
        secs = 45;
      }
      return secs;
    }
  }







/* TODO: update game-grid appearance, include background-color, makes lines slate-blue & thicker */
/* TODO: add some more basic styling to instructions-box (padding, justify <p>) */

/* TODO: IMPORTANT  add ids to each game-grid square with the names currently in the boxes (A1-C3) */
/* TODO: "P" or some symbol representing Player rendering on game-grid in bottom-left corner */
/* TODO: "T" or some symbol representing Target rendering in random square of game-grid other than
    bottom-left corner */
/* QUESTION: should the "P" & "T" appear on doc.ready or when go-fetch is clicked? */

/* TODO: initialize score variable to zero */
/* TODO: connect value of the score variable to be displayed as "SCORE: " in navbar */
