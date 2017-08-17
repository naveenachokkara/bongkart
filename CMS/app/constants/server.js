/**
 * Created by SESA435400 on 4/30/2017.
 */
(function() {
    'use strict';
    var serverURI = "";
    if (!window.location.hostname || window.location.hostname.indexOf("localhost") >= 0) {
        serverURI = "http://50.63.165.179:3000/";
    } else {
        serverURI = location.origin + ":3000/";
    }
    angular
        .module('bongKart.bong')
        .constant('SERVER_API', serverURI);
})();