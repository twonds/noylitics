/** 
 * The stats module provides two simple classes -- Counter and Rater. 
 * Counter...well, it counts. 
 * Rater provides an average rating for a list of identifiers.
 */

var sys = require('sys');
var events = require('events');
var stats = exports;

/**
 * The Counter keeps a list of identifiers and the number of 
 * times the identifier has been referenced.
 * @constructor
 */
stats.Counter = function() {
    this.countables = {};	
};

stats.Counter.prototype = {
    
    /**
     * Is the counter currently tracking the identifier?
     * @returns true if tracking, false if not
     */
    identifierExists : function(identifier) {
  	return this.countables.hasOwnProperty(identifier);
    },

    /**
     * Increment the count of the identifier.
     */
    increment : function(identifier)
    {	
	var currentCount = 0;
   	if(this.identifierExists(identifier))
   	{
	    currentCount = this.countables[identifier];
   	}
	this.countables[identifier] = ++currentCount;
    },
    
    /**
     * Returns the count of the identifier.
     */
    value : function(identifier) 
    {
  	return this.countables[identifier];
    }
 	
};

/**
 * The Rater keeps a list of identifiers and the ratings assigned to 
 * it.
 * @constructor
 */
stats.Rater = function() {
    this.rateables = {};	
};

stats.Rater.prototype = {
    
    /**
     * Is the rater currently tracking the identifier?
     * @returns true if tracking, false if not
     */
    identifierExists : function(identifier) {
  	return this.rateables.hasOwnProperty(identifier);
    },

    /**
     * Adds a rating to the identifier.
     */
    addRating : function(identifier, rating)
    {	
	var currentRateables = [];
   	if(this.identifierExists(identifier))
   	{
	    currentRateables = this.rateables[identifier];
   	}
	currentRateables.push(rating)
	this.rateables[identifier] = currentRateables;
    },
    
    /**
     * Returns the average rating of the identifier.
     */
    value : function(identifier) 
    {
	var ratings = this.rateables[identifier];
	sys.puts(ratings.sum());
	return (ratings.sum()/ratings.length);
    }

};

stats.Statistics = function() {
    node.EventEmitter.call(this);
    this.counters = {};
    this.raters = {};
};

stats.Statistics.prototype = {

    handleCount : function(type, identifiers) {
	
	if(!this.counters.hasOwnProperty(type)) {
	    this.counters[type] = new stats.Counter();
	}

	for(identifier in identifiers) {
	    this.counters[type].increment(identifier);
	}
	
    },

    handleRating : function(type, identifier, rating) {

	if(!this.raters.hasOwnProperty(type)) {
	    this.raters[type] = new stats.Rater();
	}
	
	this.raters[type].addRating(identifier, rating);
    }


};
node.inherits(Statistics, node.EventEmitter); 
