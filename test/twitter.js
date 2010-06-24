var sys          = require('sys');
var path         = require('path');
var events       = require('events');
var TwitterNode = require('../deps/twitter-node/lib').TwitterNode;
var TwitterCollector  = require('../lib/twitter').TwitterCollector;
var utils = require('../lib/utils');

//var twitter = new TwitterNode({
//    user: 'noylitics', 
//    password: 'n0ylitics',
//    track: ['washington']
//});

//twitter.addListener('tweet', function(tweet) {
//   sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
//}).stream();

sys.puts( sys.inspect(utils.urlMatch("http://yahoo.com http://google.com") ));

var twitCollect = new TwitterCollector();
sys.puts(sys.inspect(twitCollect));
twitCollect.addListener("count", function(count) {
    sys.puts(sys.inspect(count));
    sys.puts("---------------");
});

twitCollect.run();