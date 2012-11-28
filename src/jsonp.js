L.Util.jsonp = function (url, cb, cbParam, callbackName){
    var cbName,ourl,cbSuffix,scriptNode,
       head = document.getElementsByTagName('head')[0];
    var cbParam = cbParam || "callback";
    if(callbackName){
        cbName= callbackName;
    }else{
        cbSuffix = "_" + ("" + Math.random()).slice(2);
        cbName = "L.Util.jsonp.cb." + cbSuffix;
    }
    scriptNode = L.DomUtil.create('script', '', head);
    scriptNode.type = 'text/javascript';
    if(cbSuffix) {
        L.Util.jsonp.cb[cbSuffix] = function(data){
            head.removeChild(scriptNode);
            delete L.Util.jsonp.cb[cbSuffix]
            cb(data);
        };
    }
    if (url.indexOf("?") === -1 ){
        ourl =  url+"?"+cbParam+"="+cbName;
    }else{
        ourl =  url+"&"+cbParam+"="+cbName;
    }
    scriptNode.src = ourl;   
};
L.Util.jsonp.cb = {};