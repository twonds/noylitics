/* Server for noylitics */

var sys          = require('sys');
var path         = require('path');
var events       = require('events');
var TwitterNode = require('../deps/twitter-node/lib').TwitterNode;

var twitter = new TwitterNode({
    user: 'noylitics', 
    password: 'n0ylitics',
    track: ['washington']
});

twitter.addListener('tweet', function(tweet) {
    sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
}).stream();

