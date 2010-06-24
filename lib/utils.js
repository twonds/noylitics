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
// Simple rate parser
utils.parseRate = function (data) {
  var rate_check = data.toLowerCase().split(" ");
  var rate = {};
  if (rate_check[0]=="rate") {
    rate['title'] = rate_check[1];
    rate['value'] = rate_check[2];    
  }
  return rate;
};