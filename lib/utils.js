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
  var url_pattern = /https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?/gi;
  return data.match(url_pattern) || [];

  
};

utils.parseRate = function (data) {
  var rate_pattern = /rate ([a-zA-Z0-9#]+) (\d+)/gi;
  
  return data.match(rate_pattern) || [];

};