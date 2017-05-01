/**
 * Created by komarthi on 26/3/17.
 */
(function() {
    'use strict';
    angular.module('bongKart.users')
        .controller('UserController', UserController);

    UserController.$inject = ['$scope','$state','$uibModal','UserService','toaster'];

    function UserController($scope,state,uibModal,UserService,toaster) {
        var self = this;
        self.pageName = 'Users';
        self.saveUser = saveUser;
        self.confirmDelete = confirmDelete;
        self.userData = {};

        self.header = 'Delete Confirmation';

        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }

        function confirmDelete(user){
            var modalInstance = uibModal.open({
                templateUrl: 'users/deletePopUp.html',
                controller: ModalInstanceCtrl,
                 scope: $scope,
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, uibModalInstance, user) {
            $scope.user = user;
            $scope.submit = function () {
                $scope.$parent.deleteUser(user._id);
                uibModalInstance.close('closed');
            };

            $scope.cancel = function () {
                uibModalInstance.dismiss('cancel');
            };
        };
        ModalInstanceCtrl.$inject = ["$scope", "$uibModalInstance", 'user'];


        $scope.deleteUser = function (bongId) {
            UserService.deleteUser(bongId).then(function(){
                console.log('deleted Successfully');
            },function (error) {
               console.info(error);
            });
        };


        if(angular.isDefined(state.params.id)){
            UserService.getUserData(state.params.id).then(function(user){
                self.userData = user[0];
                self.userData.dateOfBirth = new Date(self.userData.dateOfBirth);
                self.userUpdate = true;
            },function(error){
                console.info(error);
            });
        }
        function saveUser(isvalid) {
            if (isvalid) {
                if(angular.isDefined(state.params.id)){
                    UserService.update(state.params.id,self.userData).then(function(){
                        toaster.success({title: "Update", body:"User updated successfully."});
                        state.go('cms.user_view',{id:state.params.id});
                    },function(error){
                        console.info(error);
                    });
                }
                else{
                    UserService.create(self.userData).then(function(user){
                        console.log(user);
                        toaster.success({title: "Success", body:"User Created successfully."});
                        state.go('cms.user_view',{id:user._id});
                    },function(error){
                        console.info(error);
                    });
                }
            }
            else {
                if ($scope.userForm.username.$invalid) {
                    $scope.userForm.username.$pristine = false;
                }
                if ($scope.userForm.phoneNumber.$invalid) {
                    $scope.userForm.phoneNumber.$pristine = false;
                }
                if ($scope.userForm.email.$invalid) {
                    $scope.userForm.email.$pristine = false;
                }
                if ($scope.userForm.gender.$invalid) {
                    $scope.userForm.gender.$pristine = false;
                }
                if ($scope.userForm.role.$invalid) {
                    $scope.userForm.role.$pristine = false;
                }
                if ($scope.userForm.facebookId.$invalid) {
                    $scope.userForm.facebookId.$pristine = false;
                }
                if ($scope.userForm.dateOfBirth.$invalid) {
                    $scope.userForm.dateOfBirth.$pristine = false;
                }
            }
        }

        (function userList() {
            UserService.list().then(function(users){
                self.users = users;
            },function (error) {
                console.info(error);
            });
        })();


    }
})();