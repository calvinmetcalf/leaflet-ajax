L.Util.ajax = function(url, options, cb) {
	'use strict';
	var XMHreq;
	if (typeof options === 'function') {
		cb = options;
		options = {};
	}
	if (options.jsonp) {
		return L.Util.ajax.jsonp(url, options, cb);
	}
	// the following is from JavaScript: The Definitive Guide
	if (window.XMLHttpRequest === undefined) {
		XMHreq = function() {
			try {
				return new ActiveXObject('Microsoft.XMLHTTP.6.0');
			}
			catch (e1) {
				try {
					return new ActiveXObject('Microsoft.XMLHTTP.3.0');
				}
				catch (e2) {
					throw new Error('XMLHttpRequest is not supported');
				}
			}
		};
	}
	else {
		XMHreq = window.XMLHttpRequest;
	}
	var response, request = new XMHreq();
	request.open('GET', url);
	request.onreadystatechange = function() {
		/*jslint evil: true */
		if (request.readyState === 4 && request.status < 400) {
			if (window.JSON) {
				response = JSON.parse(request.responseText);
			}
			else {
				response = eval('(' + request.responseText + ')');
			}
			cb(response);
		}
	};
	request.send();
	return request;
};
L.Util.ajax.jsonp = function(url, options, cb) {
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
			cb(data);
		};
	}
	if (url.indexOf('?') === -1) {
		ourl = url + '?' + cbParam + '=' + cbName;
	}
	else {
		ourl = url + '&' + cbParam + '=' + cbName;
	}
	scriptNode.src = ourl;
	return {
		abort: function() {
			head.removeChild(scriptNode);
			delete L.Util.ajax.cb[cbSuffix];
			return true;
		}
	};
};
L.Util.ajax.cb = {};
