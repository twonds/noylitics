/* Statistics code for noylitics */
var sys = require('sys');
var utils = require('utils');


var Noylitics = exports;

Noylitics.Handler = function(emitter) {  
  this.emitter = emitter;

  this.subscribers = [];

  this.routes = {
    '/counts': '_handleCountReqs',
    '/ratings': '_handleRateReqs',
  };

  //this.emitter.addHandler('event', this.event.bind(this));
    
};

Noylitics.Handler.prototype = {

    event: function(data) {
    
	this.subscribers.forEach(function(res) {
	    res.sendHeader(200, {'Content-Type': 'text/plain'});
	    res.write(data);
	    res.close();
      });
    },


 doRoute: function(res, path)
 {
     
     sys.puts("doRoutes: " + sys.inspect(this.routes));
     sys.puts("doRoutes[path]: " + this.routes[path]);
      return false;
 }
};

