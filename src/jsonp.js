L.Util.jsonp = function(url, options) {
	options = options || {};
	var head = document.getElementsByTagName('head')[0];
	var scriptNode = L.DomUtil.create('script', '', head);
	var cbName, ourl, cbSuffix, cancel;
	var out = L.Util.Promise(function(resolve, reject){
		cancel=reject;
		var cbParam = options.cbParam || 'callback';
		if (options.callbackName) {
			cbName = options.callbackName;
		}
		else {
			cbSuffix = '_' + ('' + Math.random()).slice(2);
			cbName = 'L.Util.jsonp.cb.' + cbSuffix;
		}
		scriptNode.type = 'text/javascript';
		if (cbSuffix) {
			L.Util.jsonp.cb[cbSuffix] = function(data) {
				head.removeChild(scriptNode);
				delete L.Util.jsonp.cb[cbSuffix];
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
	}).then(null,function(reason){
	    head.removeChild(scriptNode);
		delete L.Util.ajax.cb[cbSuffix];
		return reason;
	});
	out.abort = cancel;
	return out;
};
L.Util.jsonp.cb = {};
