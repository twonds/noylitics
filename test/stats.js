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
var collector_emit = new events.EventEmitter();

handleCounts = stats.createBoundedWrapper(s, s.handleCount);
handleRatings = stats.createBoundedWrapper(s, s.handleRating);

collector_emit.addListener('count', handleCounts);
collector_emit.addListener('rate', handleRatings);

collector_emit.emit('count', 'url', ['http://test.com', 'http://google.com']);
collector_emit.emit('count', 'url', ['http://test.com', 'http://google.com']);

collector_emit.emit('rate', 'movie', 'Toy Story 3', 3);
collector_emit.emit('rate', 'movie', 'Toy Story 3', 5);

s.squeak();

sys.puts(sys.inspect(s, true, null));
sys.puts(sys.inspect(rater, true, null));