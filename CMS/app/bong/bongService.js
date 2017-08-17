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
        self.update = update;
        self.getBongData = getBongData;
        self.deleteBong = deleteBong;
        self.list = list;
        self.uploadFileToUrl = uploadFileToUrl;

        function create(bongData) {
            var defer = q.defer();
            var url = SERVER_API+'bong/create';
            http.post(url,bongData).then(function (bong) {
                defer.resolve(bong.data);
            },function(){
                defer.reject();
            });
            return defer.promise;
        }

        function list() {
            var defer = q.defer();
            var url = SERVER_API+'bong/list';
            http.post(url).then(function (bongs) {
                defer.resolve(bongs.data);
            },function(){
                defer.reject();
            });
            return defer.promise;
        }

        function update(id,bongData){
            var defer = q.defer();
            var url = SERVER_API+'bong/update/'+id;
            http.put(url,bongData).then(function(){
                defer.resolve();
            },function (error) {
                defer.reject(error);
            });
            return defer.promise;
        }

        function getBongData(id) {
            var defer = q.defer();
            var url = SERVER_API+'bong/'+id;
            http.get(url).then(function (bong) {
                defer.resolve(bong.data);
            },function(){
                defer.reject();
            });
            return defer.promise;
        }
        function deleteBong(id) {
            var defer = q.defer();
            var url = SERVER_API+'bong/'+id;
            http.delete(url).then(function () {
                defer.resolve();
            },function(){
                defer.reject();
            });
            return defer.promise;
        }

        function uploadFileToUrl(file, uploadUrl){
            var defer = q.defer();
            var fd = new FormData();
            fd.append('file', file);
            http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(){
                defer.resolve();
            },function () {
                defer.reject();
            });
            return defer.promise;
        }


    }
})();