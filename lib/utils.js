/* Utility functions for noylitics */
var sys = require('sys');

var utils = exports;
// create a bind wrapper to keep scope.
utils.bind = function (object, method) {
    return function() {
	return method.apply(object, arguments);
    };
};

// match  all urls and return a list 
utils.urlMatch = function (data) {
  var url_pattern = new RegExp("((http|https)(:\/\/))?([a-zA-Z]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?", "gi");


  return data.match(url_pattern) || [];

  
};