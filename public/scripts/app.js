console.log("Sanity Check!")

$(document).ready(function() {
  $.ajax({
    method: 'GET',
    url: '/scores',
    success: handleSuccess,
    error: handleError
  });

  function handleSuccess(jsonData) {
    return jsonData
  }

  function handleError(e) {

  }

}); //end of doc.ready function
