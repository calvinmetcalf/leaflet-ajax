leaflet-ajax
===========

alows you to call json over ajax either localally or with jsonp, for local json the api is pretty much the same

```js
var geojsonLayer = new L.GeoJSON.AJAX("geojson.json");
```
for jsonp add the option "dataType" and set it to "jsonp"
```js
var geojsonLayer = L.geoJson.ajax("http:webhost.fake/geojson.jsonp",{dataType:"jsonp"});
```

You may pass either a url string or an array of url strings if you want to download multiple things (handy
if your downloading data from an ESRI based thing which will have seperate line, point, and poly features).

As you see you can also use lower case methods without creating new objects

For weirder jsonp you can set "callbackParam" for if you need to change the name of the callback parameter to something besides "callback", e.g. [Mapquest Nominative Open](http://open.mapquestapi.com/nominatim/) uses "json_callback" instead of "callback".

Gives off three events `data:loading`, `data:progress` and `data:loaded`.

- `data:loading` fires before we start downloading things, note if the constructor is given a url it won't wait to be added to the map
to start downloading the data, but it does do an async wait so you have time to add a listener to it (and so [leaflet.spin](https://github.com/makinacorpus/Leaflet.Spin) will work with it).
- `data:progress` is called each time a file is downloaded and passes the downloaded geojson as event data.
- `data:loaded` is called when all files have downloaded, this is mainly different from `data:progress` when you are downloading multiple things.

You can also add a middleware function which is called after you download the data but before you add it to leaflet:

```javascript
var geojsonLayer = L.geoJson.ajax("route/to/esri.json",{
    	middleware:function(data){
        	return esri2geoOrSomething(json);
    	}
    });
```

addUrl does not clear the current layers but adds to the current one,  e.g.:

```javascript
var geojsonLayer = L.geoJson.ajax("data.json");
geojsonLayer.addUrl("data2.json");//we now have 2 layers
geojsonLayer.refresh();//redownload the most recent layer
geojsonLayer.refresh("new1.json");//add a new layer replacing whatever is there
```

last but now least we can refilter layers without re adding them

```javascript
var geojsonLayer = L.geoJson.ajax("data.json");
geojsonLayer.refilter(function(feature){
    return feature.properties.key === values;
});
```

Behind the scenes are two new classes L.Util.ajax = function (url) for same origin requests and L.Util.jsonp = function (url,options) cross origin ones. Both return promises, which have an additional abort method that will abort the ajax request.

```js
L.Util.ajax("url/same/origin.xml").then(function(data){
	doStuff(data);
});
//or
L.Util.jsonp("http://www.dif.ori/gin").then(function(data){
	doStuff(data);
});
```

In related news `L.Util.Promise` is now a constructor for a promise, it takes one argument, a resolver function.

Some of the jsonp code inspired by/taken from [this interesting looking plugin](https://github.com/stefanocudini/leaflet-search) that I have failed to make heads nor tails of (the plugin, not the jsonp code)
