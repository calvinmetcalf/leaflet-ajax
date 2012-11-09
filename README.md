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

for weirder jsonp you can set "callbackParam" for if you need to change the name of the callback parameter to something besides "callback"

behind the scenes are two new classes L.Util.ajax = function (url, cb) for same origin requests and L.Util.jsonp = function (url, cb, cbParam, callbackName) cross origin ones.

some of the jsonp code inspired by/taken from [this interesting looking plugin](https://github.com/stefanocudini/leaflet-search) that I have failed to make heads nor tails of (the plugin, not the jsonp code)