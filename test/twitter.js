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

sys.puts( sys.inspect(utils.urlMatch("http://www.yahoo.com http://www.google.com") ));

var twitCollect = new TwitterCollector();
sys.puts(sys.inspect(twitCollect));
twitCollect.addListener("count", function(type, values) {
    sys.puts(type);
    sys.puts(values);
    sys.puts("---------------");
});

//twitCollect.run();