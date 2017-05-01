/**
 * Created by SESA435400 on 4/30/2017.
 */
(function() {
    'use strict';
    angular.module('bongKart.users')
        .service('UserService', UserService);

    UserService.$inject = ['SERVER_API','$q','$http'];

    function UserService(SERVER_API,q,http) {
        var self = this;
        self.create = create;
        self.update = update;
        self.getUserData = getUserData;
        self.deleteUser = deleteUser;
        self.list = list;

        function create(userData) {
            var defer = q.defer();
            var url = SERVER_API+'user/create';
            http.post(url,userData).then(function (user) {
                defer.resolve(user.data);
            },function(){
                defer.reject();
            });
            return defer.promise;
        }

        function list() {
            var defer = q.defer();
            var url = SERVER_API+'user/list';
            http.get(url).then(function (users) {
                defer.resolve(users.data);
            },function(){
                defer.reject();
            });
            return defer.promise;
        }

        function update(id,userData){
            var defer = q.defer();
            var url = SERVER_API+'user/update/'+id;
            http.put(url,userData).then(function(){
                defer.resolve();
            },function (error) {
                defer.reject(error);
            });
            return defer.promise;
        }

        function getUserData(id) {
            var defer = q.defer();
            var url = SERVER_API+'user/'+id;
            http.get(url).then(function (user) {
                defer.resolve(user.data);
            },function(){
                defer.reject();
            });
            return defer.promise;
        }
        function deleteUser(id) {
            var defer = q.defer();
            var url = SERVER_API+'user/'+id;
            http.delete(url).then(function () {
                defer.resolve();
            },function(){
                defer.reject();
            });
            return defer.promise;
        }
    }
})();