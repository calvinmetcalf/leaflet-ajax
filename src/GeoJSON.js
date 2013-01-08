L.GeoJSON.AJAX=L.GeoJSON.extend({
    defaultAJAXparams:{
     dataType:"json",
     callbackParam:"callback",
     middleware:function(f){return f;}
    },
    initialize: function (url, options) { // (String, Object)

        this._url = url;
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
        if(this._url){
            this.addUrl(this._url);
        }
    },
    addUrl: function (url) {
        var _this = this;
        _this._url = url;
        
        if(this.ajaxParams.dataType.toLowerCase()==="json"){
          L.Util.ajax(url, function(d){var data = _this.ajaxParams.middleware(d);_this._cache=_this._cache.concat(data.features);_this.addData(data);_this.fire("dataLoaded");}); 
        }else if(this.ajaxParams.dataType.toLowerCase()==="jsonp"){
            L.Util.jsonp(url, function(d){var data = _this.ajaxParams.middleware(d);_this._cache=_this._cache.concat(data.features);;_this.addData(data);_this.fire("dataLoaded");}, _this.ajaxParams.callbackParam);
        }
    },
    refresh: function (url){
    url = url || this._url;
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