'use strict';

angular.module('Home')

.factory('HomePageService',
    ['$http', '$rootScope', '$timeout', '$cookieStore', '$location', '$q',
    function ($http, $rootScope, $timeout, $cookieStore, $location, $q) {

        var service = {};

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
