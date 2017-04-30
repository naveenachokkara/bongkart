/**
 * Created by komarthi on 25/3/17.
 */

(function() {
    'use strict';
    angular.module('bongKart')
        .controller('BongKartController', BongKartController);

    BongKartController.$inject = ['MenuService'];

    function BongKartController(MenuService) {
        this.appName = "BongKart";
        this.pageName = "Dashboard";
        this.menuItems = MenuService.items();
    }
})();
