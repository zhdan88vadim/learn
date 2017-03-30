'use strict';

// Register `albumList` component, along with its associated controller and template
angular.
    module('albumDetail').
    component('albumDetail', {
        templateUrl: '+album-detail/album-detail.template.html',
        controller: ['$routeParams', 'Gallery',
            function AlbumDetailController($routeParams, Gallery) {
                var self = this;

                Gallery.getDetail($routeParams.albumKey).then(function (response) {
                    self.photos = response.data.result.images;
                    self.editable = response.data.result.editable;
                    self.galleryKey = response.data.result.galleryKey;
                    self.galleryName = response.data.result.galleryName;
                });

                this.delete = function (name) {
                    Gallery.deleteImage(name);
                };

            }
        ]
    });
