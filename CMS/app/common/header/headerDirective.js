/**
 * Created by komarthi on 25/3/17.
 */
'use strict';
angular.module('bongKart')
    .directive('header',Header);
Header.$inject = [];

function Header(){
     return {
         templateUrl:'common/header/header.html',
         replace:true
     }

}
