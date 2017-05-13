/**
 * Created by komarthi on 26/3/17.
 */
(function() {
    'use strict';
    angular.module('bongKart.bong')
        .controller('BongController', BongController);

    BongController.$inject = ['$scope', 'FileUploader','BongService','$state','$uibModal','toaster','SERVER_API'];

    function BongController(scope, FileUploader,BongService,state,uibModal,toaster,SERVER_API) {
        var self = this;
        self.pageName = 'Bongs';
        self.saveBong = saveBong;
        self.confirmDelete = confirmDelete;
        self.bongData = {};

        self.header = 'Delete Confirmation';
        self.body = 'Put here your body';
        self.serverAPI = SERVER_API;

        function confirmDelete(bong,index){
            var modalInstance = uibModal.open({
                templateUrl: 'bong/deletePopUp.html',
                controller: ModalInstanceCtrl,
                 scope: scope,
                resolve: {
                    bong: function () {
                        return bong;
                    },
                    index:function(){
                        return index;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, uibModalInstance, bong,index) {
            $scope.bong = bong;
            $scope.submit = function () {
                $scope.$parent.deleteBong(bong._id,index);
                uibModalInstance.close('closed');
            };

            $scope.cancel = function () {
                uibModalInstance.dismiss('cancel');
            };
        };
        ModalInstanceCtrl.$inject = ["$scope", "$uibModalInstance", 'bong'];


        scope.deleteBong = function (bongId,index) {
            BongService.deleteBong(bongId).then(function(){
                self.bongs.splice(index,1);
            },function (error) {
               console.info(error);
            });
        };


        var uploader = scope.uploader = new FileUploader({
            url: SERVER_API+'upload'
        });

        // FILTERS
        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        if(angular.isDefined(state.params.id)){
            BongService.getBongData(state.params.id).then(function(bong){
                self.bongData = bong[0];
                self.bomUpdate = true;
            },function(error){
                console.info(error);
            });
        }

        // CALLBACKS
        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            //self.bongData.images.push(fileItem.file.name);
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            angular.forEach(uploader.queue,function(image,key){
                delete image.uploader;
            });
            self.bongData.images = uploader.queue;
        };

        function saveBong(isvalid) {
            if (isvalid) {
                if(angular.isDefined(state.params.id)){
                    BongService.update(state.params.id,self.bongData).then(function(){
                        toaster.success({title: "Success", body:"Bong updated successfully."});
                        state.go('cms.bong_view',{id:state.params.id});
                    },function(error){
                        console.info(error);
                    });
                }
                else{
                    BongService.create(self.bongData).then(function(bong){
                        state.go('cms.bong_view',{id:bong._id});
                        toaster.success({title: "Update", body:"User updated successfully."});
                    },function(error){
                        console.info(error);
                    });
                }
            }
            else {
                if (scope.bongForm.brand.$invalid) {
                    scope.bongForm.brand.$pristine = false;
                }
                if (scope.bongForm.modelNumber.$invalid) {
                    scope.bongForm.modelNumber.$pristine = false;
                }
                if (scope.bongForm.functionType.$invalid) {
                    scope.bongForm.functionType.$pristine = false;
                }
                if (scope.bongForm.material.$invalid) {
                    scope.bongForm.material.$pristine = false;
                }
                if (scope.bongForm.color.$invalid) {
                    scope.bongForm.color.$pristine = false;
                }
                if (scope.bongForm.title.$invalid) {
                    scope.bongForm.title.$pristine = false;
                }
                if (scope.bongForm.price.$invalid) {
                    scope.bongForm.price.$pristine = false;
                }
                if (scope.bongForm.originalPrice.$invalid) {
                    scope.bongForm.originalPrice.$pristine = false;
                }
                if (scope.bongForm.description.$invalid) {
                    scope.bongForm.description.$pristine = false;
                }
                if (scope.bongForm.jointSize.$invalid) {
                    scope.bongForm.jointSize.$pristine = false;
                }
                if (scope.bongForm.height.$invalid) {
                    scope.bongForm.height.$pristine = false;
                }
                if (scope.bongForm.diameter.$invalid) {
                    scope.bongForm.diameter.$pristine = false;
                }
                if (scope.bongForm.quantity.$invalid) {
                    scope.bongForm.quantity.$pristine = false;
                }
            }
        }

        (function bongList() {
            BongService.list().then(function(bongs){
                self.bongs = bongs;
            },function (error) {
                console.info(error);
            });
        })();


    }
})();