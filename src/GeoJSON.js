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
		this.ajaxParams = ajaxParams;
		this._layers = {};
		L.Util.setOptions(this, options);
		if(this._urls.length > 0){
			this.addUrl();
		}
	},
	clearLayers:function(){
		this._urls = [];
		L.GeoJSON.prototype.clearLayers.call(this);
		return this;
	},
	addUrl: function (url) {
		var _this = this;
		if(url){
			if (typeof url === "string") {
				_this._urls.push(url);
			}else if (typeof url.pop === "function") {
				_this._urls = _this._urls.concat(url)
			}
		}
		var _this = this;
		var len = _this._urls.length;
		var i=0;
		_this.fire("beforeDataLoad");
		while(i<len){
			if(_this.ajaxParams.dataType.toLowerCase()==="json"){	
			  L.Util.ajax(_this._urls[i], function(d){var data = _this.ajaxParams.middleware(d);_this.addData(data);_this.fire("dataLoaded");}); 
			}else if(_this.ajaxParams.dataType.toLowerCase()==="jsonp"){
				L.Util.ajax(_this._urls[i],{jsonp:true}, function(d){var data = _this.ajaxParams.middleware(d);_this.addData(data);_this.fire("dataLoaded");}, _this.ajaxParams.callbackParam);
			}
			i++
		}
		_this.fire("dataLoadComplete");
	},
	refresh: function (url){
	url = url || this._urls;
	this.clearLayers();
	this.addUrl(url);
	},
	refilter:function (func){
		if(typeof func !== "function"){
			this.eachLayer(function(a){
				a.setStyle({stroke:true,clickable:true});
			});
		}else{
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