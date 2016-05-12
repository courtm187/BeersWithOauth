(function() {
  'use strict';

  // √ new route
  // √ new template
  // √ new controller
  // call the server /me
  //  IF that's a user, show the page
  //  IF that's an error, redirect to login (home)
  // cleanup the code a bit

  angular.module('app', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
       .when('/', {
        templateUrl: '/templates/home.html',
        controller: 'HomeController',
        resolve: {
          currentUser: function ($http) {

            // if the browser has a token
            if (localStorage.getItem('token')) {

              // call /me endpoint, and pass it the token
              const config = {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
              }

              return $http.get('/api/v1/users/me', config)
                .then(function (response) {
                  return response.data
                })
                .catch(function () {
                  localStorage.clear();
                  return null;
                })

            }
          }
        }
      })
      .when('/signup', {
        templateUrl: '/templates/signup.html',
        controller: 'SignupController'
      })
      .when('/beers', {
        templateUrl: '/templates/beers.html',
        controller: 'BeersController',
        requiresLogin: true, // I can put arbitrary data on a route
        resolve: {
          currentUser: function ($http, $location) {

            // if the browser has a token
            if (localStorage.getItem('token')) {

              // call /me endpoint, and pass it the token
              const config = {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
              }

              return $http.get('/api/v1/users/me', config)
                .then(function (response) {
                  return response.data
                })
                .catch(function () {
                  localStorage.clear();
                  $location.path("/")
                  return null;
                })

            }
          }
        }
      });

      $locationProvider.html5Mode(true);
    });

    // app.run runs once when the app starts
    // this improves user experience
    angular.module('app').run(function ($rootScope, $location, $window) {
      $rootScope.$on('$routeChangeStart', function (event, next, current) {
        // if the next route requires login
        // and we don't have a token
        // then redirect to the homepage

        if (next.$$route.requiresLogin && !localStorage.getItem('token')) {
          $location.path('/');
        }

      });
    });

}());
