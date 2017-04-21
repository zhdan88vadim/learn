'use strict';

// Register `albumList` component, along with its associated controller and template
angular.
    module('galleryComponents').
    component('dirList', {
        bindings: {
            list: '<'
        },
        templateUrl: '+dir-list/dir-list.template.html',
        controller: ['Gallery',
            function DirListController(Gallery) {
                var self = this;

                this.updateAlbum = function (name) {
                    Gallery.updateAlbum({name: name});
                };

            }
        ]
    });
