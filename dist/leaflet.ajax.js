L.GeoJSON.AJAX=L.GeoJSON.extend({
	defaultAJAXparams:{
	 dataType:"json",
	 callbackParam:"callback",
	 middleware:function(f){return f;}
	},
	initialize: function (url, options) { // (String, Object)
		if (url && typeof url !== "string") {	
				options = url
				url = undefined
			}
		var ajaxParams = L.Util.extend({}, this.defaultAJAXparams);

		for (var i in options) {
			if (this.defaultAJAXparams.hasOwnProperty(i)) {
				ajaxParams[i] = options[i];
			}
		}
		this.ajaxParams = ajaxParams;
		this._layers = {};
		L.Util.setOptions(this, options);
		if(url){
			this.addUrl(url);
		}
	},
	clearLayers:function(){
		this._url = undefined;
		this.off("dataloadInt");
		L.GeoJSON.prototype.clearLayers.call(this);
		return this;
	},
	addUrl: function (url) {
		var _this = this;
		_this._url = url;
		_this.on("dataloadInt",function(e){
			_this.addData(e.data);
			if(this._filter){
				this.refilter(this._filter);
			}
			this.fire("data:loaded");
		},_this);
		_this.fire("data:loading");
			if(_this.ajaxParams.dataType.toLowerCase()==="json"){	
			  L.Util.ajax(url, function(d){_this.fire("dataloadInt",{data:_this.ajaxParams.middleware(d)});}); 
			}else if(_this.ajaxParams.dataType.toLowerCase()==="jsonp"){
				L.Util.ajax(url,{jsonp:true}, function(d){_this.fire("dataloadInt",{data:_this.ajaxParams.middleware(d)});}, _this.ajaxParams.callbackParam);
			}
	},
	refresh: function (url){
		url = (url || this._url);
			this.clearLayers();
			this.addUrl(url);
	},
	refilter:function (func){
		if(typeof func !== "function"){
			this._filter = false;
			this.eachLayer(function(a){
				a.setStyle({stroke:true,clickable:true});
			});
		}else{
			this._filter=func;
			this.eachLayer(function(a){
				
				if(func(a.feature)){
					a.setStyle({stroke:true,clickable:true});
				}else{
					a.setStyle({stroke:false,clickable:false});
				}
			});
		}
	}
});
L.geoJson.ajax = function (geojson, options) {
	return new L.GeoJSON.AJAX(geojson, options);
};
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