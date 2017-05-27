function getAllUriParams(url) {
    var params = {}, queries, temp, i, l;
    queries = url.split("&");
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
}

function computerHttpSignature(config){
    var index = config.requestUrl.indexOf('?');
    var queries = config.requestUrl.substring( index + 1 );
    var orderedQueryParameters = "";
    var queryParameters = getAllUriParams(queries);
    var keys = Object.keys(queryParameters);
    keys.sort();
    for (var i=0; i<keys.length; i++) {
        var key = keys[i];
        var value = queryParameters[key];
        if(orderedQueryParameters !== ""){
            orderedQueryParameters += ", ";
        }
        orderedQueryParameters += key + ":" + value;
    }

    var requestUrl = config.requestUrl.substring(0,index);
    var hashTarget = requestUrl + "\r\n" + orderedQueryParameters + "\r\n" + config.requestTime + "\r\n" + config.requestMethod;
    var hash = CryptoJS.HmacSHA256(hashTarget, config.keyValue);

    var sig = "AzureCDN " + config.keyId + ":" + CryptoJS.enc.Hex.stringify(hash).toUpperCase();
    return sig;
}

var targetUrl = request.url.trim(); //there may be surrounding ms
targetUrl = targetUrl.replace(new RegExp('^https?://[^/]*/'),'/'); //scrip hostname

var curDate = new Date();
var formatedDate = [curDate.getUTCFullYear(),curDate.getUTCMonth()+1, curDate.getUTCDate()].join('-') + ' ' + [curDate.getUTCHours(), curDate.getUTCMinutes(),curDate.getUTCSeconds()].join(':');
var method = request.method.toUpperCase();
var config = {
        keyId : environment['API-KeyID'],
        keyValue : environment['API-Key-Value'],
        requestUrl:targetUrl,
        requestTime:formatedDate,
        requestMethod:method
      }; 

var sig = computerHttpSignature(config);
postman.setEnvironmentVariable("x-azurecdn-request-date",formatedDate);
postman.setEnvironmentVariable("Authorization",sig);