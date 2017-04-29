/**
 * Created by komarthi on 26/3/17.
 */
'use strict';
angular.module('bongKart.bong')
.controller('BongController',BongController);

BongController.$inject = ['$scope'];

function BongController(scope){
   this.pageName = 'Bongs';
   this.saveBong = saveBong;
   this.bongData = {brand:'',modalNumber:'',functionType:'',material:'',color:''};
   function saveBong(isvalid){
      if(isvalid){
         console.log(this.bongData);
      }
      else{
         if(scope.bongForm.brand.$invalid ){
            scope.bongForm.brand.$pristine = false;
         }
         if(scope.bongForm.modelNumber.$invalid ){
            scope.bongForm.modelNumber.$pristine = false;
         }
         if(scope.bongForm.functionType.$invalid ){
            scope.bongForm.functionType.$pristine = false;
         }
         if(scope.bongForm.material.$invalid ){
            scope.bongForm.material.$pristine = false;
         }
         if(scope.bongForm.color.$invalid ){
            scope.bongForm.color.$pristine = false;
         }
      }
   }
}