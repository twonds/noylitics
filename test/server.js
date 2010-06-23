/* Server for noylitics */
var sys      = require('sys');
var path     = require('path');
var events   = require('events');
var http     = require('http');
var paperboy = require('../deps/node-paperboy');
var noy      = require('../lib/noylitics');
var stats    = require('../lib/stats');
//var collecta = require('../lib/collecta');
var utils    = require('../lib/utils');
var twitter  = require('../lib/twitter');
var PORT     = 8003;
var WEBROOT  = path.join(path.dirname(__filename), '../html');

sys.puts("Starting up Noylitics server.");
sys.puts(WEBROOT);

var statistics = new stats.Statistics();

// statistics 
var handler = new noy.Handler();
statistics.addListener('event', stats.createBoundedWrapper(handler, handler.event));


// data collectas
//var collecta = new collecta.Collecta(
//				     {query: 'convergese', 
//				      apikey: null,
//				      jid: 'guest.collecta.com'
//				     });
//collecta.addListener('count', statistics.handleCount);
//collecta.addListener('rating', statistics.handleRating);

// :-)
var twitlecta  = new twitter.TwitterCollector();
var handleCounts = stats.createBoundedWrapper(statistics, statistics.handleCount);
var handleRatings = stats.createBoundedWrapper(statistics, statistics.handleRating);

twitlecta.addListener('count', handleCounts);
twitlecta.addListener('rate', handleRatings);
twitlecta.run();

// Web Server for serving static files and handling AJAX calls.

var server = http.createServer(function(req, res) {
    paperboy
      .deliver(WEBROOT, req, res)
      .before(function() {
	  sys.puts('About to deliver: '+req.url);
	})
      .after(function() {
	  sys.puts('Delivered: '+req.url);
	})
      .error(function(code, msg) {
	  sys.puts('Error delivering: '+req.url);
	  sys.puts(code);
	  sys.puts(msg);
	  res.sendHeader(code, {'Content-Type': 'text/plain'});
	  res.write(msg);
	  res.close();
	})
      .otherwise(function() {
	  req_path = req.url.split('?');
	  if (req_path[0] == "/counts") 
	  {
	      statistics.addListener('event', function(eventType, type, identifier, value) {
		  res.sendHeader(200, { "Content-Type" : "text/plain" });
		  sys.puts("sending: " + type + " : " + identifier + " : " + value);
		  res.write(type + " : " + identifier + " : " + value);
		  res.close();
	      });
	  }
	  else
	  {
	  res.sendHeader(404, {'Content-Type': 'text/plain'});
	  res.write('Sorry, no paper this morning!');
	  res.close();
	  }
      });
  });

server.listen(PORT);
