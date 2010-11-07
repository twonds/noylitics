/* Server for noylitics */
var sys      = require('sys');
var path     = require('path');
var events   = require('events');
var http     = require('http');
var paperboy = require('../deps/node-paperboy');
var noy      = require('../lib/noylitics');
var stats    = require('../lib/stats');
var collecta = require('../lib/collecta');
var utils    = require('../lib/utils');
var twitter  = require('../lib/twitter');
var PORT     = 8003;
var WEBROOT  = path.join(path.dirname(__filename), '../html');

sys.puts("Starting up Noylitics server.");
sys.puts(WEBROOT);

var statistics = new stats.Statistics();
var handleCounts = stats.createBoundedWrapper(statistics, statistics.handleCount);
var handleRatings = stats.createBoundedWrapper(statistics, statistics.handleRating);

// statistics 
var handler = new noy.Handler();
statistics.addListener('event', stats.createBoundedWrapper(handler, handler.handleEvent));
statistics.addListener('rating', stats.createBoundedWrapper(handler, handler.handleRatingEvent));

// query
var s_query = 'happy';

// data collectas
var collecta = new collecta.Collecta(
				     {query: s_query, 
				      apikey: null,
				      jid: 'guest.collecta.com'
				     });
collecta.addListener('count', handleCounts);
collecta.addListener('rating', handleRatings);

// :-)
// var twitlecta  = new twitter.TwitterCollector('convergese');
var twitlecta  = new twitter.TwitterCollector(s_query);
twitlecta.addListener('tweet', stats.createBoundedWrapper(handler, handler.handleTweet));
twitlecta.addListener('count', handleCounts);
twitlecta.addListener('rating', handleRatings);
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
	  res.write(msg, "utf8");
	  res.close();
	})
      .otherwise(function() {
	  req_path = req.url.split('?');
	  if(!handler.doRoute(res, req_path[0])) 
	  {
	      res.sendHeader(404, {'Content-Type': 'text/plain'});
	      res.write('Sorry, no paper this morning!');
	      res.close();
	  }
      });
});

server.listen(PORT);
