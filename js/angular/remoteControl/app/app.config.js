'use strict';

angular.
  module('galleryApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/albums', {
          template: '<album-list></album-list>'
        }).
        when('/albums/:albumKey', {
          template: '<album-detail></album-detail>'
        }).
        otherwise('/albums');
    }
  ]);
