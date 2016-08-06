'use strict';

angular.module('Home')

.factory('HomeService',
    ['$http', '$rootScope', '$timeout', '$cookieStore', '$location', '$q',
    function ($http, $rootScope, $timeout, $cookieStore, $location, $q) {

        var service = {};

        service.submitdata = function(url,msg,name,email,callback){
            $timeout(function () {
                $http({
                    url: url,
                    method: "POST",
                    params: { msg: msg, email: email, name:name },
                    cache: false,
                    headers: { 'Cache-Control': 'no-cache' }
                })
                        .success(function (response) {
                            if (!response.success) {
                            }
                            callback(response);
                        })
                        .error(function () {

                        })
            }, 1000);
        }
        service.GetData = function () {
            var deferred = $q.defer();
            return $http({
                url: '/default',
                method: "GET",
                params: { },
                cache: false,
                headers: { 'Cache-Control': 'no-cache' }
            })
                .then(function (response) {                    
                    // promise is fulfilled
                    deferred.resolve(response.data);
                    return deferred.promise;
                }, function (response) {

                    // the following line rejects the promise 
                    deferred.reject(response);
                    return deferred.promise;
                });
        };        

        return service;
    }])
