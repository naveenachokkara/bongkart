/**
 * Created by komarthi on 25/3/17.
 */

(function() {
    'use strict';
    angular.module('bongKart')
        .controller('BongKartController', BongKartController);

    BongKartController.$inject = ['MenuService','BongService'];

    function BongKartController(MenuService,BongService) {
        this.appName = "BongKart";
        this.pageName = "Dashboard";
        this.menuItems = MenuService.items();

        (function bongList() {
            BongService.list().then(function(bongs){
                self.bongs = bongs;
            },function (error) {
                console.info(error);
            });
        })();


    }
})();
