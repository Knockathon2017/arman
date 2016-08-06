'use strict';

angular.module('Home')

.controller('HomeController',
    ['$scope', '$rootScope', '$location', '$http','HomeService',
    function ($scope, $rootScope, $location, $http, HomeService) {
        
        $scope.showpara = function(){
            
            $scope.shome1 = true;
        }
        $scope.submitfeedback = function(form){
            
            var msg = $("#feedbackmsg").val();
            var name = $("#feedbackname").val();
            var email = $("#feedbackemail").val();            
            if(msg == null || msg.length <= 0 || name == null || email == null|| name.length <= 0|| email.length <= 0){
                alert("incorrect details provided.");
                return false;
            }
            else{
                HomeService.submitdata("/submitdata",msg,name,email,function(response){
                    if(response.status == 200){
                        $scope.showthanks = true;
                    }
                    else
                        $scope.showthanks = false;
                })
            }
        }
    }]);