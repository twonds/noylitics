/* Statistics code for noylitics */
var sys = require('sys');
var utils = require('utils');


var Noylitics = exports;

Noylitics.Handler = function(emitter) {  
  this.emitter = emitter;

  this.subscribers = [];
  this.tweetSubscribers = [];

  this.routes = {
    '/counts': '_handleCountReqs',
    '/ratings': '_handleRateReqs',
  };

  //this.emitter.addHandler('event', this.event.bind(this));
    
};

Noylitics.Handler.prototype = {

    handleEvent: function(type,counts) {
	sys.puts("Handle event");
	for(subscriber in this.subscribers)
	{
	    
	    this.subscribers[subscriber].sendHeader(200, { "Content-Type" : "text/plain" });
	    
	    sys.puts("streaming: " + JSON.stringify([counts]));
	    this.subscribers[subscriber].write(JSON.stringify(counts));
	    sys.puts("streamed: " + JSON.stringify([counts]));
	    
	    this.subscribers[subscriber].close();
	}
	this.subscribers = [];
    },

    handleTweet: function(userName, tweetText) {
	sys.puts("Handle event");
	for(subscriber in this.tweetSubscribers)
	{
	    
	    this.tweetSubscribers[subscriber].sendHeader(200, { "Content-Type" : "text/plain" });
	    
	    sys.puts("streaming: " + JSON.stringify({"user":userName,"tweet":tweetText}));
	    this.tweetSubscribers[subscriber].write(JSON.stringify({"user":userName,"tweet":tweetText}));
	    sys.puts("streamed: " + JSON.stringify({"user":userName,"tweet":tweetText}));
	    
	    this.tweetSubscribers[subscriber].close();
	}
	this.tweetSubscribers = [];
    },
    
    //_handleCountReqs(

    doRoute: function(res, path)
    {
	if(path == "/counts")
	{
	    this.subscribers.push(res);
	    return true;
	}	
	else if(path == "/tweets")
	{
	    this.tweetSubscribers.push(res);
	    return true
	}
      return false;
    }
};

