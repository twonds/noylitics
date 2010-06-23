var sys      = require('sys');
var path     = require('path');
var events   = require('events');
var stats    = require('../lib/stats');
var utils    = require('../lib/utils');
var TwitterNode = require('../deps/twitter-node/lib').TwitterNode;

var twitter = exports;

var TwitterCollector = exports.TwitterCollector = function() {
    this.twitterNode = new TwitterNode({
	user: 'noylitics', 
	password: 'n0ylitics',
	track: ['washington']
    });
};

twitter.TwitterCollector.prototype = Object.create(events.EventEmitter.prototype);

TwitterCollector.prototype.onTweet = function(tweet) {
    sys.puts(tweet.text);
    this.emit('count', 'author', [tweet.user.screen_name]); 
    this.processURLS(tweet);
}

TwitterCollector.prototype.processURLS = function(tweet) {
    var urls = utils.urlMatch(tweet.text);
    for(var i = 0; i < urls.length; i++) {
	this.emit('count', 'urls', urls);
    }
}

TwitterCollector.prototype.run = function() {
    var onTweet = stats.createBoundedWrapper(this, this.onTweet);
    this.twitterNode.addListener('tweet', onTweet).stream();    
}

