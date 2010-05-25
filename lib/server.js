/* Server for noylitics */

var sys      = require('sys');
var path     = require('path');
var events   = require('events');
var http     = require('http');
var paperboy = require('../deps/paperboy');
var noy      = require('../lib/noylitics');
var PORT     = 8003;
var WEBROOT  = path.join(path.dirname(__filename), '../html');

sys.puts("Starting up Noylitics server.");
sys.puts(WEBROOT);

var stats_emitter = new events.EventEmitter();

// statistics 
var handler = new noy.Handler(stats_emitter);

// data collectas
var collecta = null;
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
	  if (!handler.doRoute(req_path[0])) 
	  {
	    res.sendHeader(404, {'Content-Type': 'text/plain'});
	    res.write('Sorry, no paper this morning!');
	    res.close();
	  }
	});
  });

server.listen(PORT);
