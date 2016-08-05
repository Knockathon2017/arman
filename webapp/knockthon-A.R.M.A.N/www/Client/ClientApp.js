'use strict';

// declare modules
angular.module('Home', []);

var ccWebApp = angular.module('gocleanapp', [    
    'Home',
    'ngRoute',    
    'ngCookies',    
    //'ui.materialize'
]);

ccWebApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider    
         .when('/home', {
             //controller: 'LoginController',
             templateUrl: 'assets/client/home.html',
             hideMenus: true,
             title: 'Login :: CASACLUE'
         })  
         .when('/default', {
             //controller: 'LoginController',
             templateUrl: 'assets/client/home.html',
             hideMenus: true,
             title: 'Login :: CASACLUE'
         })      
        .otherwise({ redirectTo: '/home' });
}]);

ccWebApp.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {            
            
        $rootScope.$on('$locationChangeStart', function (event, next, current) {            
            return true;           
        });
        $rootScope.$on('$locationChangeSuccess', function (event, next, current) {            
            return true;
        });
        $rootScope.$on('$routeChangeStart', function (event, current, previous) {
            
            if (current.$$route != null && current.$$route.title != null) {
                document.title = current.$$route.title;
            }
            $("span[ng-show=error]").hide();            
        });
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            return true;        
        });
    }]);