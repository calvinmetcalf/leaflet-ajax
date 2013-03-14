L.Util.ajax = function (url,options, cb) {
	var cbName,ourl,cbSuffix,scriptNode, head, cbParam;
	if(typeof options === "function"){
		cb = options;
		options = {};
	}
	if(options.jsonp){
		head = document.getElementsByTagName('head')[0];
		cbParam = options.cbParam || "callback";
		if(options.callbackName){
			cbName= options.callbackName;
		}else{
			cbSuffix = "_" + ("" + Math.random()).slice(2);
			cbName = "L.Util.ajax.cb." + cbSuffix;
		}
		scriptNode = L.DomUtil.create('script', '', head);
		scriptNode.type = 'text/javascript';
		if(cbSuffix) {
			L.Util.ajax.cb[cbSuffix] = function(data){
				head.removeChild(scriptNode);
				delete L.Util.ajax.cb[cbSuffix]
				cb(data);
			};
		}
		if (url.indexOf("?") === -1 ){
			ourl =  url+"?"+cbParam+"="+cbName;
		}else{
			ourl =  url+"&"+cbParam+"="+cbName;
		}
		scriptNode.src = ourl;
	}else{	
		// the following is from JavaScript: The Definitive Guide
		if (window.XMLHttpRequest === undefined) {
			window.XMLHttpRequest = function() {
				try {
					return new ActiveXObject("Microsoft.XMLHTTP.6.0");
				}
				catch  (e1) {
					try {
						return new ActiveXObject("Microsoft.XMLHTTP.3.0");
					}
					catch (e2) {
						throw new Error("XMLHttpRequest is not supported");
					}
				}
			};
		}
		var response, request = new XMLHttpRequest();
		request.open("GET", url);
		request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status === 200) {
				if(window.JSON) {
					response = JSON.parse(request.responseText);
				} else {
					response = eval("("+ request.responseText + ")");
				}
				cb(response);
			}
		};
		request.send();	
	}
};
L.Util.ajax.cb = {};