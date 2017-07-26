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
  $('#newHSForm').on('submit', function(e) {
    e.preventDefault();
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
  function indexError(e) {
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
  function newHSError(e) {
    console.log('error posting new high score');
  }


/******************************
 *   HELPER/OTHER FUNCTIONS   *
 ******************************/

  $('#go-fetch').on('click', function(e) {
    var count = 10;
    var counter=setInterval(timer, 1000);

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
      } else {
        document.getElementById('timer').innerHTML = count + ' seconds';
      };
    }; //end of timer function
  }); //end of GO-FETCH on-click function

}); //end of doc.ready function
