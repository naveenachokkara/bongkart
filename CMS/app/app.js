'use strict';

(function() {

    // Declare app level module which depends on views, and components
    angular.module('bongKart', [
        'ui.router',
        'ui.bootstrap',
        'angularFileUpload',
        'bongKart.bong'
    ]).config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];


    function config($stateProvider, $urlRouterProvider) {
        var states = routingList();
        angular.forEach(states, function (state) {
            $stateProvider.state(state);
        });
        $urlRouterProvider.otherwise('/');
    }

    function routingList() {
        var routes = [
            {
                name: 'cms',
                url: '/',
                templateUrl: 'dashboard/dashboard.html'
            },
            {
                name: 'cms.bongs',
                url: 'bongs',
                controller: 'BongController',
                controllerAs: 'Bong',
                templateUrl: 'bong/bongs.html'
            },
            {
                name: 'cms.bong_create',
                url: 'bong/create',
                controller: 'BongController',
                controllerAs: 'Bong',
                templateUrl: 'bong/bongCreate.html'
            },
            {
                name: 'cms.bong_update',
                url: 'bong/edit/:id',
                controller: 'BongController',
                controllerAs: 'Bong',
                templateUrl: 'bong/bongCreate.html'
            }

        ];
        return routes;
    }

})();