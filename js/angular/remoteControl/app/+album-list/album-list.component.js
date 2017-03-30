'use strict';

// Register `albumList` component, along with its associated controller and template
angular.module('albumList')
  .component('albumList', {
    templateUrl: '+album-list/album-list.template.html',
    controller: ['Gallery',
      function AlbumListController(Gallery) {
        var self = this;

        this.add = function (name) {
          Gallery.addAlbum(name);
        };

        this.delete = function (key) {
          Gallery.deleteAlbum(key);
        };

        Gallery.getAll().then(function (response) {
          self.albums = response.data.result.galleries;
        });

        this.orderProp = 'age';
      }
    ]
  });
