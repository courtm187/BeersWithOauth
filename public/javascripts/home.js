(function() {
  'use strict';

  angular.module('app')
    .controller('HomeController', function ($scope, currentUser) {
      $scope.user = currentUser;
    })

}());
