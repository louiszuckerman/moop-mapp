(function(angular) {
  "use strict";

  var app = angular.module('myApp.home', ['firebase.auth', 'firebase', 'firebase.utils', 'ngRoute', 'ngGeolocation']);

  app.controller('HomeCtrl', ['$scope', 'fbutil', 'user', '$firebaseObject', 'FBURL', '$geolocation',
    function ($scope, fbutil, user, $firebaseObject, FBURL, $geolocation) {
      $scope.syncedValue = $firebaseObject(fbutil.ref('syncedValue'));
      $scope.user = user;
      $scope.FBURL = FBURL;
      $scope.radius = 0;
      $geolocation.getCurrentPosition({
        timeout: 60000,
        enableHighAccuracy: true
      }).then(function(geo) {
        console.log(geo);
        $scope.geo = geo;
        $scope.radius = geo.coords.accuracy;
      });
  }]);

  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl',
      resolve: {
        // forces the page to wait for this promise to resolve before controller is loaded
        // the controller can then inject `user` as a dependency. This could also be done
        // in the controller, but this makes things cleaner (controller doesn't need to worry
        // about auth status or timing of accessing data or displaying elements)
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }]);

})(angular);

