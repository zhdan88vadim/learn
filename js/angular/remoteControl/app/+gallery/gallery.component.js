'use strict';

// Register `albumList` component, along with its associated controller and template
angular.module('galleryComponents').
    component('gallery', {
        bindings: {
            // @ bindings can be used when the input is a string, especially when the value of the binding doesn't change.
            mode: '@'
        },
        templateUrl: '+gallery/gallery.template.html',
        controller: ['$routeParams', 'Gallery',
            function GalleryController($routeParams, Gallery) {
                var self = this;

                this.$onInit = function() {
                    console.log(self.mode);
                    
                };


            }
        ]
    });
