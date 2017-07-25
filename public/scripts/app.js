console.log("Sanity Check!")


$(document).ready(function() {

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
    el = jsonData[0];
    $('#scores-target').text(`${el.name}, ${el.highScore}`);
  }

  //error with GET all scores
  function indexError(e) {
    $('#scores-target').text("Failed to load TOP DOGS.")
  }

  //POST new high score
  function newHSSuccess(jsonData) {
    console.log('reached new high score success function')
  }

  //error with POST new high score
  function newHSError(e) {
    console.log('error posting new high score: ' + err);
  }
}); //end of doc.ready function
