'use strict';

// Register `albumList` component, along with its associated controller and template
angular.module('galleryComponents')
    .component('albumDetail', {
        templateUrl: '+album-detail/album-detail.template.html',
        controller: ['$routeParams', 'Gallery',
            function AlbumDetailController($routeParams, Gallery) {
                var self = this;

                Gallery.getDetail($routeParams.albumKey).then(function (response) {
                    var result = response.data.result;

                    self.photos = result.images;
                    self.editable = result.editable;
                    self.galleryKey = result.galleryKey;
                    self.galleryName = result.galleryName;
                });

                this.delete = function (name) {
                    Gallery.deleteImage(name);
                };

            }
        ]
    });
