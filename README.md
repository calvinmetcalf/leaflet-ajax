leaflet-ajax
===========

alows you to call json over ajax either localally or with jsonp, for local json the api is pretty much the same

```js
var geojsonLayer = new L.GeoJSON.AJAX("geojson.json");
```
for jsonp add the option "dataType" and set it to "jsonp"
```js
var geojsonLayer = new L.GeoJSON.AJAX("http:webhost.fake/geojson.jsonp",{dataType:"jsonp"});
```
for weirder jsonp there are the other two new options "callbackName" for if you need to specify the name of the callback and "callbackParam" for if you need to change the name of the callback parameter to something besides "callback"

some of the jsonp code inspired by/taken from [this interesting looking plugin](https://github.com/stefanocudini/leaflet-search) that I have failed to make heads nor tails of (the plugin, not the jsonp code)

there is both an [json example](http://calvinmetcalf.github.com/leaflet-ajax/example/json.html) and [jsonp example](http://calvinmetcalf.github.com/leaflet-ajax/example/jsonp.html) in the example folder