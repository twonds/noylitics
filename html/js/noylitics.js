/* Noylitics client */

function sortByCount(chocula,dracula) {
    return(dracula.count - chocula.count);
}

function Count(key, count) {
    this.key = key;
    this.count = count;
}

function Counts(type) {
    this.counts = [];
    
    this.add = function(key, count) {
	for(var i = 0; i < this.counts.length; i++) {
	    if(this.counts[i].key == key) {
		this.counts[i].count = count;
		return;
	    }
	}
	this.counts.push(new Count(key,count));
    }
    
    this.sortedByCount = function() {
	return this.counts.sort(sortByCount);
    }
}

var authorCounts = new Counts();
var urlCounts = new Counts();

function log(msg) {
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

function buildRankings(data) {
    $('#displayAuthorRanking').empty();
    $('#displayURLRanking').empty();

    //author
    for(var key in data.author) {
	authorCounts.add(key, data.author[key]);
    }
    
    var authorByCount = authorCounts.sortedByCount();
    for(var i = 0; i < authorByCount.length; i++) {
	var rankingText = authorByCount[i].key + " - " + authorByCount[i].count;
	$('#displayAuthorRanking').append('<div class="rank">' + rankingText + '</div>');
    } 

    //urls
    for(var key in data.url) {
	urlCounts.add(key, data.url[key]);
    }
    
    var urlByCount = urlCounts.sortedByCount();
    for(var i = 0; i < urlByCount.length; i++) {
	var rankingText = urlByCount[i].key + " - " + urlByCount[i].count;
	$('#displayURLRanking').append('<div class="rank">' + rankingText + '</div>');
    } 
}

function handleEvent(event, data) {
    buildRankings(data);
}

function waitForMsg(){
  /* This requests the event url for statistics events.
     When it complete (or errors)*/
  $.ajax({
      type: "GET",
      url: "/counts",
      dataType: 'json',
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
