(function(angular) {
  "use strict";

  var app = angular.module('myApp.home', ['firebase.auth', 'firebase', 'firebase.utils', 'ngRoute', 'ngGeolocation']);

  app.controller('HomeCtrl', ['$scope', 'fbutil', 'user', '$firebaseObject', 'FBURL', '$geolocation', '$firebaseArray',
    function ($scope, fbutil, user, $firebaseObject, FBURL, $geolocation, $firebaseArray) {
      $scope.syncedValue = $firebaseObject(fbutil.ref('syncedValue'));
      $scope.user = user;
      $scope.FBURL = FBURL;
      $geolocation.watchPosition({
        timeout: 60000,
        maximumAge: 250,
        enableHighAccuracy: true
      });
      var locations = fbutil.ref('locations');
      $scope.locations = $firebaseArray(locations);
      $scope.$on('$geolocation.position.changed', function(scope, pos) {
        $scope.currentLocation = pos;
        locations.push({location: pos});
        var crumbs = $scope.locations.map(function (i) {
          return "[" + i.location.coords.latitude + "," + i.location.coords.longitude + "]"
        }).join(",");
        console.log(crumbs);
        $scope.breadcrumbs = "[" + crumbs + "]";
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

