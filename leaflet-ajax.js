L.GeoJSON.AJAX=L.GeoJSON.extend({
    defaultAJAXparams:{
     dataType:"json",
     callbackName:false,
     callbackParam:"callback"
    },
    initialize: function (url, options) { // (String, Object)

        this._url = url;
        var ajaxParams = L.Util.extend({}, this.defaultAJAXparams);

        for (var i in options) {
    		 //all keys that are not GeoJSON options go to ajax params
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
        if(this.ajaxParams.dataType.toLowerCase()==="json"){
           this.addJSON(url); 
        }else if(this.ajaxParams.dataType.toLowerCase()==="jsonp"){
            this.addJSONP(url); 
        }
    },
    addJSON: function (url){
        var response 
        var request = new XMLHttpRequest();
  
        request.open("GET",url);
        var _this=this;
        request.onreadystatechange = function(){
            if (request.readyState === 4 && request.status === 200 ){
                response = JSON.parse(request.responseText);
                _this.addData(response);
            }
        };
        request.send();
    },
    addJSONP: function (url){
        var _this=this,cbParam = this.ajaxParams.callbackParam,cbn,ourl;
        if(this.ajaxParams.callbackName){
            cbn= this.ajaxParams.callbackName;
        }else{
            cbn = "_" + Math.floor(Math.random()*1000000);
        }
        L.GeoJSON.AJAX.cb = {};
        L.GeoJSON.AJAX.cb[cbn]=function(data){
            _this.addData(JSON.parse(JSON.stringify(data)));
        }
        var scriptNode = L.DomUtil.create('script','', document.getElementsByTagName('body')[0] );
        scriptNode.type = 'text/javascript';
        if (url.indexOf("?") === -1 ){
            ourl =  url+"?"+cbParam+"=L.GeoJSON.AJAX.cb."+cbn;
        }else{
            ourl =  url+"&"+cbParam+"=L.GeoJSON.AJAX.cb."+cbn;
        }
        scriptNode.src = ourl;    
    }
});
L.geoJson.ajax = function (geojson, options) {
    return new L.GeoJSON.AJAX(geojson, options);
};