var stats = require('../lib/stats');
var sys   = require('sys');
var events = require('events');

var counter = new stats.Counter();

counter.increment('test');
counter.increment('test');
counter.increment('sam');

sys.puts(counter.value('test'));
sys.puts(counter.value('sam'));
sys.puts("---------------------");
var rater = new stats.Rater();

rater.addRating('sam', 4);
rater.addRating('sam', 2);
sys.puts("rater.value: " + rater.value('sam'));

var s = new stats.Statistics();
var stat_emit = new events.EventEmitter();

handleCounts = stats.createBoundedWrapper(s, s.handleCount);
handleRatings = stats.createBoundedWrapper(s, s.handleRating);

stat_emit.addListener('count', handleCounts);
stat_emit.addListener('rate', handleRatings);

stat_emit.emit('count', 'url', ['http://test.com', 'http://google.com']);
stat_emit.emit('count', 'url', ['http://test.com', 'http://google.com']);

stat_emit.emit('rate', 'movie', 'Toy Story 3', 3);
stat_emit.emit('rate', 'movie', 'Toy Story 3', 5);

sys.puts(sys.inspect(s, true, null));