L.Util.ajax = function(url, options) {
	'use strict';
	options = options || {};
	if (options.jsonp) {
		return L.Util.ajax.jsonp(url, options);
	}
	var request;
	var cancel;
	var out = L.Util.Promise(function(resolve,reject){
		var Ajax;
		cancel=reject;
		// the following is from JavaScript: The Definitive Guide
		if (window.XMLHttpRequest === undefined) {
			Ajax = function() {
				try {
					return new ActiveXObject('Microsoft.XMLHTTP.6.0');
				}
				catch (e1) {
					try {
						return new ActiveXObject('Microsoft.XMLHTTP.3.0');
					}
					catch (e2) {
						reject('XMLHttpRequest is not supported');
					}
				}
			};
		}
		else {
			Ajax = window.XMLHttpRequest;
		}
		var response;
		request = new Ajax();
		request.open('GET', url);
		request.onreadystatechange = function() {
			/*jslint evil: true */
			if (request.readyState === 4) {
				if(request.status < 400) {
					if (window.JSON) {
						response = JSON.parse(request.responseText);
					} else if (options.evil) {
						response = eval('(' + request.responseText + ')');
					}
					resolve(response);
				} else {
					reject(request.statusText);
				}
			}
		};
		request.send();
	}).then(null,function(reason){
		request.cancel();
		return reason;
	});
	out.abort = cancel;
	return out;
};
