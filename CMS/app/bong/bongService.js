/**
 * Created by SESA435400 on 4/30/2017.
 */
(function() {
    'use strict';
    angular.module('bongKart.bong')
        .service('BongService', BongService);

    BongService.$inject = ['SERVER_API','$q','$http'];

    function BongService(SERVER_API,q,http) {
        var self = this;
        self.create = create;
        self.list = list;

        function create(bongData) {
            var defer = q.defer();
            var url = SERVER_API+'bong/create';
            http.post(url,bongData).then(function () {
                defer.resolve();
            },function(){
                defer.reject();
            });
            return defer.promise;
        }

        function list() {
            var defer = q.defer();
            var url = SERVER_API+'bong/list';
            http.get(url).then(function (bongs) {
                defer.resolve(bongs.data);
            },function(){
                defer.reject();
            });
            return defer.promise;
        }
    }
})();