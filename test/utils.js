// TODO - use a unit testing framework
var sys   = require('sys');
var utils = require("../lib/utils");


sys.puts(sys.inspect(utils.urlMatch("Testing http://thetofu.com"), false, null));

sys.puts(sys.inspect(utils.urlMatch("Testing http://thetofu.com http://www.catamorphiclabs.com "), false, null));

sys.puts(sys.inspect(utils.parseRate("rate tofu 10"), false, null));

