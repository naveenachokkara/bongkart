/**
 * Created by SESA435400 on 6/12/2017.
 */
/**
 * Created by komarthi on 26/3/17.
 */
(function() {
    'use strict';
    angular.module('bongKart.bong')
        .directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function(){
                        scope.$apply(function(){
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }]);


})();