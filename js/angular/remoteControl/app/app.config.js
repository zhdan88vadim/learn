'use strict';

angular.
  module('galleryApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/albums', {
          template: '<gallery mode="list" editable="$resolve.editable"></gallery>',
          resolve: {
            editable: function ($http) { return false; }
          }
        }).
        when('/albums/:albumKey', {
          template: '<gallery mode="detail"></gallery>'
        }).
        otherwise('/albums');
    }
  ]);
