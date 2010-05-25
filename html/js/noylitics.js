/* Noylitics client */

function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}


function handleEvent(event, data) {
  $('#display').append('<div></div>').append('<strong></strong>').append(document.createTextNode(event));
  $('#display').append('<div></div>').append(document.createTextNode(data));
  
}

function waitForMsg(){
  /* This requests the event url for statistics events.
     When it complete (or errors)*/
  $.ajax({
    type: "GET",
	url: "events",
	
	async: true, /* If set to non-async, browser shows page as "Loading.."*/
	cache: false,
	timeout:50000, /* Timeout in ms */
	
	success: function(data){ 
	handleEvent("new", data); 
	setTimeout(
		   'waitForMsg()', /* Request next message */
		   1000 /* ..after 1 seconds */
		   );
      },
   error: function(XMLHttpRequest, textStatus, errorThrown){
	handleEvent("error", textStatus + " (" + errorThrown + ")");
	setTimeout('waitForMsg()', /* Try again after.. */
		   "15000"); /* milliseconds (15seconds) */
      },
  });
};


$(document).ready(function () {
    log("Starting up....");
    
    waitForMsg();
    
    
  });
