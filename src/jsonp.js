L.Util.jsonp = function (url, cb, cbParam, callbackName){
    var cbn,ourl,cbs;
    var cbParam = cbParam || "callback";
    if(callbackName){
        cbn= callbackName;
    }else{
        cbs = "_" + Math.floor(Math.random()*1000000);
        cbn = "L.Util.jsonp.cb." + cbs;
    }
    L.Util.jsonp.cb[cbs] = cb;
    var scriptNode = L.DomUtil.create('script','', document.getElementsByTagName('body')[0] );
    scriptNode.type = 'text/javascript';
    if (url.indexOf("?") === -1 ){
        ourl =  url+"?"+cbParam+"="+cbn;
    }else{
        ourl =  url+"&"+cbParam+"="+cbn;
    }
    scriptNode.src = ourl;   
};
L.Util.jsonp.cb = {};