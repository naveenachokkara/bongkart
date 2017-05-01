'use strict';

(function() {

    // Declare app level module which depends on views, and components
    angular.module('bongKart', [
        'ui.router',
        'ui.bootstrap',
        'angularFileUpload',
        'bongKart.bong',
        'bongKart.users'
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
            },
            {
                name: 'cms.users',
                url: 'users',
                controller: 'UserController',
                controllerAs: 'User',
                templateUrl: 'users/users.html'
            },
            {
                name: 'cms.user_create',
                url: 'user/create',
                controller: 'UserController',
                controllerAs: 'User',
                templateUrl: 'users/userCreate.html'
            },
            {
                name: 'cms.user_update',
                url: 'user/edit/:id',
                controller: 'UserController',
                controllerAs: 'User',
                templateUrl: 'users/userCreate.html'
            }

        ];
        return routes;
    }

})();