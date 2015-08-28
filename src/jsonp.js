'use strict';
var L = global.L || require('leaflet');
var Promise = require('lie');

module.exports = function(url, options) {
  if (!global._leafletJSONPcallbacks) {
    global._leafletJSONPcallbacks = {};
  }
  options = options || {};
  var head = document.getElementsByTagName('head')[0];
  var scriptNode = L.DomUtil.create('script', '', head);
  var cbName, ourl, cbSuffix, cancel;
  var out = new Promise(function(resolve, reject) {
    cancel = reject;
    var cbParam = options.cbParam || 'callback';
    if (options.callbackName) {
      cbName = options.callbackName;
    } else {
      cbSuffix = '_' + ('' + Math.random()).slice(2);
      cbName = '_leafletJSONPcallbacks.' + cbSuffix;
    }
    scriptNode.type = 'text/javascript';
    if (cbSuffix) {
      global._leafletJSONPcallbacks[cbSuffix] = function(data) {
        head.removeChild(scriptNode);
        delete global._leafletJSONPcallbacks[cbSuffix];
        if (!Object.keys(global._leafletJSONPcallbacks).length) {
          delete global._leafletJSONPcallbacks;
        }
        resolve(data);
      };
    }
    if (url.indexOf('?') === -1) {
      ourl = url + '?' + cbParam + '=' + cbName;
    } else {
      ourl = url + '&' + cbParam + '=' + cbName;
    }
    scriptNode.src = ourl;
  }).then(null, function(reason) {
    head.removeChild(scriptNode);
    delete L.Util.ajax.cb[cbSuffix];
    return reason;
  });
  out.abort = cancel;
  return out;
};
