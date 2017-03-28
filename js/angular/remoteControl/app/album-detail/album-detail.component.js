'use strict';

// Register `albumList` component, along with its associated controller and template
angular.
    module('albumDetail').
    component('albumDetail', {
        templateUrl: 'album-detail/album-detail.template.html',
        controller: ['$routeParams', 'Gallery',
            function AlbumDetailController($routeParams, Gallery) {
                var self = this;
                
                Gallery.getDetail({ key: $routeParams.albumKey }, function (photos) {
                    self.photos = photos;
                });


            }
        ]
    });
