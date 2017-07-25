console.log("Sanity Check!")


$(document).ready(function() {
  $.ajax({
    method: 'GET',
    url: '/scores',
    success: handleSuccess,
    error: handleError
  });

  function handleSuccess(jsonData) {
    jsonData.forEach(function(e) {
      $('#scores-target').text(`${e.name}`);
    });
  }

  function handleError(e) {
    $('#scores-target').text("Failed to load TOP DOGS.")
  }

}); //end of doc.ready function
