L.Util.ajax = function(url, options) {
	'use strict';
	options = options || {};
	if (options.jsonp) {
		return L.Util.ajax.jsonp(url, options);
	}
	return L.Util.Promise(function(resolve,reject){
		var Ajax;
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
		var response, request = new Ajax();
		request.open('GET', url);
		request.onreadystatechange = function() {
			/*jslint evil: true */
			if (request.readyState === 4) {
				if(request.status < 400) {
					if (window.JSON) {
						response = JSON.parse(request.responseText);
					}
					else {
						response = eval('(' + request.responseText + ')');
					}
					resolve(response);
				} else {
					reject(request.statusText);
				}
			}
		};
		request.send();
	});
};
L.Util.jsonp = function(url, options) {
	options = options || {};
	return L.Util.Promise(function(resolve){
		var head = document.getElementsByTagName('head')[0];
		var cbParam = options.cbParam || 'callback';
		var cbName, ourl, cbSuffix;
		if (options.callbackName) {
			cbName = options.callbackName;
		}
		else {
			cbSuffix = '_' + ('' + Math.random()).slice(2);
			cbName = 'L.Util.ajax.cb.' + cbSuffix;
		}
		var scriptNode = L.DomUtil.create('script', '', head);
		scriptNode.type = 'text/javascript';
		if (cbSuffix) {
			L.Util.ajax.cb[cbSuffix] = function(data) {
				head.removeChild(scriptNode);
				delete L.Util.ajax.cb[cbSuffix];
				resolve(data);
			};
		}
		if (url.indexOf('?') === -1) {
			ourl = url + '?' + cbParam + '=' + cbName;
		}
		else {
			ourl = url + '&' + cbParam + '=' + cbName;
		}
		scriptNode.src = ourl;
	});
};
L.Util.ajax.cb = {};
