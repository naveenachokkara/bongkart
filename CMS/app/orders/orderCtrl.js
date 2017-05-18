/**
 * Created by komarthi on 25/3/17.
 */

(function() {
    'use strict';
    angular.module('bongKart')
        .controller('OrderCtrl', OrderCtrl);

    OrderCtrl.$inject = ['MenuService','BongService','UserService'];

    function OrderCtrl(MenuService,BongService,UserService) {
        var self = this;
        self.appName = "BongKart";
        self.pageName = "Dashboard";
        self.menuItems = MenuService.items();

        (function bongList() {
            BongService.list().then(function(bongs){
                self.bongs = bongs;
            },function (error) {
                console.info(error);
            });
        })();

        (function userList() {
            UserService.list().then(function(users){
                self.users = users;
            },function (error) {
                console.info(error);
            });
        })();



    }
})();
