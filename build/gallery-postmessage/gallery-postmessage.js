YUI.add('gallery-postmessage', function(Y) {

/**
 * postMessage
 */

var YLang				= Y.Lang,
	isValue				= YLang.isValue,
	isString			= YLang.isString,
	isFunction			= YLang.isFunction,
	
	JSON				= Y.JSON,
	stringify			= JSON.stringify,
	parse				= JSON.parse,
	
	supportsPostMessage = isValue(Y.config.win.postMessage);

Y.postMessage = function (win, message, targetOrigin) {
	
	win				= Y.instanceOf(win, Y.Node) ? Y.Node.getDOMNode(win) : (win || Y.config.win);
	message			= isString(message) ? message : isValue(message) ? stringify(message) : null;
	targetOrigin	= targetOrigin || '*';
	
	if (supportsPostMessage) {
		win.postMessage(message, targetOrigin);
	}
};

Y.Event.define('message', {
	
	processArgs : function (args, delegate) {
		
		var i = isString(args[2]) ? 2 : 3;
		
		return { origin: isString(args[i]) || isFunction(args[i]) ? args.splice(i, 1)[0] : null };
	},
	
	on : function (node, subscriber, notifier) {
		
		var win = Y.one('win');
		
		if (node !== win) { return; }
		
		function handleMessage (e) {
			
			var targetOrigin	= subscriber._extra.origin,
				messageEvent	= e._event,
				messageOrigin	= messageEvent.origin,
				data			= messageEvent.data;
				
			try {
				data = parse(data);
			} catch (error) {}
				
			if (isFunction(targetOrigin) ? targetOrigin(messageOrigin) : ( ! targetOrigin || targetOrigin === messageOrigin)) {
				notifier.fire({
					origin	: messageOrigin,
					data	: data
				});
			}
		}
		
		if (supportsPostMessage) {
			subscriber.messageHandle = Y.Event._attach(['message', handleMessage, win]);
		}
	},
	
	detach : function (node, subscriber, notifier) {
		
		if (supportsPostMessage) {
			subscriber.messageHandle.detach();
		}
	}
	
}, true);


}, '@VERSION@' ,{requires:['event-synthetic', 'history-hash', 'json']});
