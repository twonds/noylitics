/* Tests for collecta emitter */

var collecta = require('../lib/collecta');

var sys   = require('sys');
var events = require('events');

function handleCount(count) {
  sys.puts(count);
}

function handleRating(rating) {
  sys.puts(rating);
}


// data collectas
var collecta = new collecta.Collecta(
				     {query: 'the', 
				      apikey: null,
				      jid: 'guest.collecta.com'
				     });
collecta.addListener('count', handleCount);
collecta.addListener('rating', handleRating);