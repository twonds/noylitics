require.paths.push('../lib');
var sys   = require('sys');
var xmpp  = require('xmpp');
var htmlparser = require("node-htmlparser");

var utils = require('../lib/utils');

// Define some global contstants for Collecta and XMPP namespaces.
var NS_PUBSUB = 'http://jabber.org/protocol/pubsub';
var NS_DATA   = 'jabber:x:data';
var QUERY_FIELD = 'x-collecta#query';
var APIKEY_FIELD = 'x-collecta#apikey';

var NS_OPTIONS  = NS_PUBSUB + '#subscribe_options';




// TODO: Some of this should be abstracted, its not collecta specific
function Collecta (params) {
  // Inherit from node-xmpp client
  xmpp.Client.call(this, params);
  // The collecta api key, if needed. 
  this.apikey = params.apikey || null;
  // This is used to create an xmpp iq id attribute.
  this._uniqueId = Math.round(Math.random()*10000);
  // The query we are watching. 
  this.query = params.query || '';
  // The collecta search server. 
  this.search_domain = params.search_domain || 'search.collecta.com';
  
 
  // Add listeners to handle different xmpp connection states.
  this.addListener('online', this.online);
  this.addListener('authFail',
		 function() {
		   sys.puts("Authentication failure");
		   process.exit(1);
		 });
  this.addListener('error',
		 function(e) {
		   sys.puts(e);
		   process.exit(1);
		 });
  this.addListener('end',
		 function() {
		   /* node.js will exit by itself */
		 });


}

// Collecta is a xmpp.Client
sys.inherits(Collecta, xmpp.Client);
exports.Collecta = Collecta;

Collecta.prototype.online = function () 
{

  sys.puts("Online");
  // Build subscription stanza and handle message events
  this.subscribe();
  // Add an listener for incoming stanzas. 
  // We want to collect pubsub message events from collecta.
  this.addListener('stanza', this.handleStanza);
  this.addListener('message', this.onEvent);

};

Collecta.prototype.handleStanza = function (stz)
{
  // TODO - need a stanza router and event handler for better abstraction

  this.emit(stz.name, stz);
      
};

Collecta.prototype.getId = function (suffix)
{
  if (typeof(suffix) == "string" || typeof(suffix) == "number") {
    return ++this._uniqueId + ":" + suffix;
  } else {
    return ++this._uniqueId + "";
  }
};


Collecta.prototype._getRaw = function (obj) {
  var cleaned_data = "";
  var self = this;
  if (obj['type'] == "text") {
    cleaned_data += obj['raw'];
  }
  if (obj.children) {
    obj.children.forEach(function(child) {
	cleaned_data += self._getRaw(child);
      });
  }
  return cleaned_data;
};


Collecta.prototype._getHref = function (obj) {
  var hrefs = [];
  var self  = this;
  if (obj['type'] == "tag" && obj['name'] == 'a') {
      var urls = [];
      if(obj.hasOwnProperty('href')) {
	  var urls = obj.attribs['href'];
      }
      hrefs.concat(urls);
  }
  if (obj.children) {
    obj.children.forEach(function(child) {	
	hrefs.concat(self._getHref(child));
      });
  }
  return hrefs;
};

Collecta.prototype._processDom = function (htmlDom) {
  var parsed = {
    'cleanded_data':"",
    'url': []
  };
  var self = this;
  htmlDom.forEach(function(obj) {
	  	  
	  parsed['cleaned_data'] += self._getRaw(obj);
	  parsed['url'].concat(self._getHref(obj));

	});

  return parsed;

};

Collecta.prototype.onEvent = function (stanza) 
{
  var event = stanza.getChild('event');
  var self = this;
  event.getChild('items').getChildren('item').forEach(function(item) {
      var entry = item.getChild('entry');
      // Grab text to process.      
      var cdata = "";
      entry.children.forEach(function(elem) {
	  if (elem.name == 'content' || 
	      elem.name == 'summary' || 
	      elem.name == 'title') {
	    cdata += " " + elem.getText();
	  }
	  
	});
      
      var count = {
	'author' : [],
	'url'    : [],
      };

      var htmlDom = htmlparser.ParseHtml(cdata);
      var processed = self._processDom(htmlDom);
      
      // Send count for author
      var author = entry.getChild('author');
      var source = entry.getChild('source');
      var author_name = "";
      if (author) {
	var name = author.getChild('name');
	if (name) {
	  author_name = name.getText();
	}
      } else {
	if (source) {
	  author = source.getChild('author');
	  author_name = author.getText();
	}
      }
      if (!author_name=="") {
	count['author'] = [author_name];
      }       
      // Send count for urls
      count['url'] = processed['url'].concat(
	  utils.urlMatch(
	      processed['cleaned_data']
	  )
      );
      // TODO - Send count for pictures
      
      sys.puts("******COLLECTA EMITTING: " + sys.inspect(count));
      self.emit('count', count);
    });

};
// Build an iq pubsub subcribe stanza with the collecta fields.
Collecta.prototype.subscribe = function () {
  var iq     = new xmpp.Element('iq',
                            { type: 'set',
			      to: this.search_domain,
			      id: this.getId('subscribe'), });
  var pubsub = iq.c('pubsub',
                    { xmlns: NS_PUBSUB}
		    );
  pubsub.c('subscribe', 
           {jid: this.jid.toString(),
	       node: 'search'});
  var form = pubsub.c('options', 
                      {}).c('x', 
                            {xmlns: NS_DATA, 
                             type: 'submit'});
  
  form.c('field', {'var': 'FORM_TYPE', type:'hidden'}
         ).c('value',{}
            ).t(NS_OPTIONS);
  form.c('field', {'var': QUERY_FIELD}
         ).c('value',{}
            ).t(this.query);
  if (this.apikey) {
    form.c('field', {'var': APIKEY_FIELD}
         ).c('value',{}
            ).t(this.apikey);
  }
  // Add event to handle messages
  this.send(iq);
  
};



