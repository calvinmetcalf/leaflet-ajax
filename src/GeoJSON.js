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