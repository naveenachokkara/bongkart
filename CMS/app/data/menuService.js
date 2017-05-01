/**
 * Created by komarthi on 25/3/17.
 */
(function() {
    'use strict';

    angular.module('bongKart')
        .service('MenuService', MenuService);

    MenuService.$inject = [];

    function MenuService() {
        this.items = items;

        function items() {
            var items = [{
                name: 'Bong',
                subMenuItems: [{
                    name: 'View All',
                    url: 'cms.bongs'
                }, {
                    name: 'Add New',
                    url: 'cms.bong_create'
                }]
            },{
                name: 'Users',
                subMenuItems: [{
                    name: 'View All',
                    url: 'cms.users'
                }, {
                    name: 'Add New',
                    url: 'cms.user_create'
                }]
            }];

            return items;
        }
    }
})();
