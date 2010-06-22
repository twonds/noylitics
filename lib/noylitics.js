/* Statistics code for noylitics */
var sys = require('sys');

// Bind again
if (!Function.prototype.bind) {
    Function.prototype.bind = function (obj)
    {
        var func = this;
        return function () { return func.apply(obj, arguments); };
    };
}


var Noylitics = exports;


Noylitics.Handler = function(emitter) {  
  this.emitter = emitter;

  this.subscribers = [];

  this.routes = {'/events': '_handleRequest'};

  //this.emitter.addHandler('event', this.event.bind(this));
    
};

Noylitics.Handler.prototype = {


 event: function(data) {
    
    this.subscribers.forEach(function(res) {
	 res.sendHeader(200, {'Content-Type': 'text/plain'});
	 res.write(data);
	 res.close();
      });
  }


 doRoute: function(res, path)
 {
   
   sys.puts(this.routes);
   sys.puts(this.routes[path]);
   return false;
 }
};

