/* Server for noylitics */

var sys      = require('sys');
var path     = require('path');
var events   = require('events');
var http     = require('http');
var paperboy = require('../deps/paperboy');
var noy      = require('../lib/noylitics');
var stats    = require('../lib/statistics');
var collecta = require('../lib/collecta');
var PORT     = 8003;
var WEBROOT  = path.join(path.dirname(__filename), '../html');

sys.puts("Starting up Noylitics server.");
sys.puts(WEBROOT);

var statistics = stats.Statistics();

// statistics 
var handler = new noy.Handler();

statistics.addListener('event',handler.handleEvent);

// data collectas
var collecta = new collecta.Collecta(
				     {query: 'convergese', 
				      apikey: null,
				      jid: 'guest.collecta.com'
				     });
collecta.addListener('count', statistics.handleCount);

var twitter  = null;


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
	  if (!handler.doRoute(res, req_path[0])) 
	  {
	    res.sendHeader(404, {'Content-Type': 'text/plain'});
	    res.write('Sorry, no paper this morning!');
	    res.close();
	  }
	});
  });

server.listen(PORT);
