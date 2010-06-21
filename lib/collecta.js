require.paths.push('../lib');
var sys = require('sys');
var xmpp = require('xmpp');

// Define some global contstants for Collecta and XMPP namespaces.
var NS_PUBSUB = 'http://jabber.org/protocol/pubsub';
var NS_DATA   = 'jabber:x:data';
var QUERY_FIELD = 'x-collecta#query';
var APIKEY_FIELD = 'x-collecta#apikey';

var NS_OPTIONS  = NS_PUBSUB + '#subscribe_options';



/** PrivateFunction: Function.prototype.bind
 *  Bind a function to an instance.
 *
 *  This Function object extension method creates a bound method similar
 *  to those in Python.  This means that the 'this' object will point
 *  to the instance you want.  See
 *  <a href='http://benjamin.smedbergs.us/blog/2007-01-03/bound-functions-and-function-imports-in-javascript/'>Bound Functions and Function Imports in JavaScript</a>
 *  for a complete explanation.
 *
 *  This extension already exists in some browsers (namely, Firefox 3), but
 *  we provide it to support those that don't.
 *
 *  Parameters:
 *    (Object) obj - The object that will become 'this' in the bound function.
 *
 *  Returns:
 *    The bound function.
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (obj)
    {
        var func = this;
        return function () { return func.apply(obj, arguments); };
    };
}



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
  
 
  this.emitter = params.emitter;
  // Add listeners to handle different xmpp connection states.
  this.addListener('online', this.online.bind(this));
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

Collecta.prototype.online = function () 
{

  sys.puts("Online");
  // Build subscription stanza and handle message events
  this.subscribe();
  // Add an listener for incoming stanzas. 
  // We want to collect pubsub message events from collecta.
  this.addListener('stanza', this.handleStanza.bind(this));

};

Collecta.prototype.handleStanza = function (stz)
{
  // TODO - need a stanza router and event handler for better abstraction
  if (stz.name == 'message') {
    this.onEvent(stz);
  }
    
};

Collecta.prototype.getId = function (suffix)
{
  if (typeof(suffix) == "string" || typeof(suffix) == "number") {
    return ++this._uniqueId + ":" + suffix;
  } else {
    return ++this._uniqueId + "";
  }
};


Collecta.prototype.onEvent = function (stanza) 
{
  var event = stanza.getChild('event');
  event.getChild('items').getChildren('item').forEach(function(item) {
      var entry = item.getChild('entry');
      // Grab text to process.
      
      var cdata = "";
      entry.children.forEach(function(elem) {
	  if (elem.name == 'content' || elem.name == 'summary' || elem.name == 'title') {
	    cdata += " " + elem.getText();
	  }
	  
	});
      
      sys.puts(cdata);
      // Send count for urls
      // Send count for author
      // Send count for pictures
      
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


exports.Collecta = Collecta;
