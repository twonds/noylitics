/* Server for noylitics */

var
  sys = require('sys'),
  path = require('path'),
  http = require('http'),
  paperboy = require('../deps/paperboy'),

  PORT = 8003,
  WEBROOT = path.join(path.dirname(__filename), '../');

sys.puts(WEBROOT);

http.createServer(function(req, res) {
    paperboy
      .deliver(WEBROOT, req, res)
      .before(function() {
	  sys.puts('About to deliver: '+req.url);
	})
      .after(function() {
	  sys.puts('Delivered: '+req.url);
	})
      .error(function(code, msg) {
	  sys.puts(code);
	  sys.puts(msg);
	  sys.puts('Error delivering: '+req.url);

	  res.sendHeader(code, {'Content-Type': 'text/plain'});
	  res.write(msg);
	  res.close();
	})
      .otherwise(function() {
	  res.sendHeader(404, {'Content-Type': 'text/plain'});
	  res.write('Sorry, no paper this morning!');
	  res.close();
	});
  }).listen(PORT);