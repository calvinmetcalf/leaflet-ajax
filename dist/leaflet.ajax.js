L.GeoJSON.AJAX=L.GeoJSON.extend({
    defaultAJAXparams:{
     dataType:"json",
     callbackParam:"callback",
     middleware:function(f){return f;}
    },
    initialize: function (url, options) { // (String, Object)

        this._urls = [];
        if (url) {    
            if (typeof url === "string") {
                this._urls.push(url);
            }else if (typeof url.pop === "function") {
                this._urls = this._urls.concat(url)
            }else{
                options = url
                url = undefined
            }
        }
        var ajaxParams = L.Util.extend({}, this.defaultAJAXparams);

        for (var i in options) {
            if (this.defaultAJAXparams.hasOwnProperty(i)) {
				ajaxParams[i] = options[i];
			}
		}
		this._cache=[]
		this.ajaxParams = ajaxParams;
        this._layers = {};
		L.Util.setOptions(this, options);
        if(this._urls.length > 0){
            this.addUrl(this._urls);
        }
    },
    addUrl: function (url) {
        var _this = this;
        if (typeof url === "string") {
                _this._urls.push(url);
            }else if (typeof url.pop === "function") {
                _this._urls = _this._urls.concat(url)
            }
        var _this = this;
        var len = _this._urls.length;
        var i=0;
        while(i<len){
            if(_this.ajaxParams.dataType.toLowerCase()==="json"){    
              L.Util.ajax(_this._urls[i], function(d){var data = _this.ajaxParams.middleware(d);_this._cache=_this._cache.concat(data.features);_this.addData(data);_this.fire("dataLoaded");}); 
            }else if(_this.ajaxParams.dataType.toLowerCase()==="jsonp"){
                L.Util.jsonp(_this._urls[i], function(d){var data = _this.ajaxParams.middleware(d);_this._cache=_this._cache.concat(data.features);;_this.addData(data);_this.fire("dataLoaded");}, _this.ajaxParams.callbackParam);
            }
            i++
        }
    },
    refresh: function (url){
    url = url || this._urls;
    this.clearLayers();
    this.addUrl(url);
    },
    refilter:function (func){
        if(typeof func !== "function"){
            func = function(){return true;};
        }
        this.clearLayers();
        this.addData(this._cache.filter(func));
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
    var cbName,ourl,cbSuffix,scriptNode,
       head = document.getElementsByTagName('head')[0];
    var cbParam = cbParam || "callback";
    if(callbackName){
        cbName= callbackName;
    }else{
        cbSuffix = "_" + ("" + Math.random()).slice(2);
        cbName = "L.Util.jsonp.cb." + cbSuffix;
    }
    scriptNode = L.DomUtil.create('script', '', head);
    scriptNode.type = 'text/javascript';
    if(cbSuffix) {
        L.Util.jsonp.cb[cbSuffix] = function(data){
            head.removeChild(scriptNode);
            delete L.Util.jsonp.cb[cbSuffix]
            cb(data);
        };
    }
    if (url.indexOf("?") === -1 ){
        ourl =  url+"?"+cbParam+"="+cbName;
    }else{
        ourl =  url+"&"+cbParam+"="+cbName;
    }
    scriptNode.src = ourl;   
};
L.Util.jsonp.cb = {};