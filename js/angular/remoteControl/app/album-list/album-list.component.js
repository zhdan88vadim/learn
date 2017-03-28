'use strict';

// Register `albumList` component, along with its associated controller and template
angular.
  module('albumList').
  component('albumList', {
    templateUrl: 'album-list/album-list.template.html',
    controller: ['Gallery',
      function AlbumListController(Gallery) {

        this.addAlbum = function (name) {
          Gallery.addAlbum(name);
          //this.albums = Album.getAll();
        };

        this.albums = Gallery.getAll();

        this.orderProp = 'age';
      }
    ]
  });
