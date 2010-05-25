/* Statistics code for noylitics */
var sys = require('sys');


var Noylitics = exports;


Noylitics.Handler = function() {
  
  this.routes = {'/events': '_handleEvent'};
  
};

Noylitics.Handler.prototype = {
 doRoute: function(path)
 {
   sys.puts(this.routes);
   sys.puts(this.routes[path]);
   return false;
 }
};

