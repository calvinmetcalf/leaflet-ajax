L.GeoJSON.AJAX=L.GeoJSON.extend({
    defaultAJAXparams:{
     dataType:"json",
     callbackParam:"callback"
    },
    initialize: function (url, options) { // (String, Object)

        this._url = url;
        var ajaxParams = L.Util.extend({}, this.defaultAJAXparams);

        for (var i in options) {
    		if (this.defaultAJAXparams.hasOwnProperty(i)) {
				ajaxParams[i] = options[i];
			}
		}

		this.ajaxParams = ajaxParams;
        this._layers = {};
		L.Util.setOptions(this, options);
        if(this._url){
            this.addUrl(this._url);
        }
    },
    addUrl: function (url) {
        var _this = this;
        _this._url = url;
        if(this.ajaxParams.dataType.toLowerCase()==="json"){
          L.Util.ajax(url, function(data){_this.addData(data);}); 
        }else if(this.ajaxParams.dataType.toLowerCase()==="jsonp"){
            L.Util.jsonp(url, function(data){_this.addData(data);}, _this.ajaxParams.callbackParam);
        }
    },
    refresh: function (url){
    url = url || this._url;
    this.clearLayers();
    this.addUrl(url);
    }
});
L.geoJson.ajax = function (geojson, options) {
    return new L.GeoJSON.AJAX(geojson, options);
};
L.Util.ajax = function (url, cb) {
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
};
L.Util.jsonp = function (url, cb, cbParam, callbackName){
    var cbn,ourl,cbs;
    var cbParam = cbParam || "callback";
    if(callbackName){
        cbn= callbackName;
    }else{
        cbs = "_" + Math.floor(Math.random()*1000000);
        cbn = "L.Util.jsonp.cb." + cbs;
    }
    L.Util.jsonp.cb[cbs] = cb;
    var scriptNode = L.DomUtil.create('script','', document.getElementsByTagName('body')[0] );
    scriptNode.type = 'text/javascript';
    if (url.indexOf("?") === -1 ){
        ourl =  url+"?"+cbParam+"="+cbn;
    }else{
        ourl =  url+"&"+cbParam+"="+cbn;
    }
    scriptNode.src = ourl;   
};
L.Util.jsonp.cb = {};