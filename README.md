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
as you see you can also use lower case methods without creating new objects

for weirder jsonp you can set "callbackParam" for if you need to change the name of the callback parameter to something besides "callback", e.g. [Mapquest Nominative Open](http://open.mapquestapi.com/nominatim/) uses "json_callback" instead of "callback".

you can also add a middleware function which is called after you download the data but before you add it to leaflet:

```javascript
var geojsonLayer = L.geoJson.ajax("route/to/esri.json",{middleware:function(data){doStuff;return geojson;}});
```
you can also add an array of urls instead of just one, bear in mind that "addUrl" adds the new url(s) to the list of current ones, but if you want to replace them use refresh e.g.:
```javascript
var geojsonLayer = L.geoJson.ajax("data.json");
geojsonLayer.addUrl("data2.json");//we now have 2 layers
geojsonLayer.refresh();//redownload those two layers
geojsonLayer.refresh(["new1.json","new2.json"]);//add two new layer replacing the current ones
```
last but now least we can refilter layers without re adding them
```javascript
var geojsonLayer = L.geoJson.ajax("data.json");
geojsonLayer.refilter(function(feature){
    return feature.properties.key === values;
});
```

behind the scenes are two new classes L.Util.ajax = function (url, cb) for same origin requests and L.Util.jsonp = function (url, cb, cbParam, callbackName) cross origin ones, meaning you don't actually have to use this with the built in layer type, you can do

```js
L.Util.ajax("url/same/origin.xml", function(data){doStuff(data)});
//or
L.Util.jsonp("http://www.dif.ori/gin",function(data){doStuff(data)});
```

some of the jsonp code inspired by/taken from [this interesting looking plugin](https://github.com/stefanocudini/leaflet-search) that I have failed to make heads nor tails of (the plugin, not the jsonp code)