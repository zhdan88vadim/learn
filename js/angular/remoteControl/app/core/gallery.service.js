'use strict';

// Define the `core.phone` module
angular.module('core.gallery', ['ngResource']);


angular.module('core.gallery')
    .service('Gallery', ['$resource',
        function ($resource) {
            var albums = [
                {
                    name: 'album 0',
                    key: 'album0',
                    mainImageUrl: 'http://bolshepodarkov.ru/data/category/04298.jpg'
                },
                {
                    name: 'album 1',
                    key: 'album1',
                    mainImageUrl: 'http://www.prisnilos.su/kcfinder/upload/image/articles1/mashina12.jpg'
                },
                {
                    name: 'album 2',
                    key: 'album2',
                    mainImageUrl: 'http://bolshepodarkov.ru/data/category/04298.jpg'
                },
                {
                    name: 'album 3',
                    key: 'album3',
                    mainImageUrl: 'http://www.prisnilos.su/kcfinder/upload/image/articles1/mashina12.jpg'
                }
            ];

            var images = [
                {
                    name: 'album 0',
                    imgUrl: 'http://bolshepodarkov.ru/data/category/04298.jpg'
                },
                {
                    name: 'album 1',
                    imgUrl: 'http://www.prisnilos.su/kcfinder/upload/image/articles1/mashina12.jpg'
                },
                {
                    name: 'album 2',
                    imgUrl: 'http://bolshepodarkov.ru/data/category/04298.jpg'
                },
                {
                    name: 'album 3',
                    imgUrl: 'http://www.prisnilos.su/kcfinder/upload/image/articles1/mashina12.jpg'
                },
                {
                    name: 'album 3',
                    imgUrl: 'http://www.prisnilos.su/kcfinder/upload/image/articles1/mashina12.jpg'
                },
                {
                    name: 'album 3',
                    imgUrl: 'http://www.prisnilos.su/kcfinder/upload/image/articles1/mashina12.jpg'
                },
                {
                    name: 'album 3',
                    imgUrl: 'http://www.prisnilos.su/kcfinder/upload/image/articles1/mashina12.jpg'
                },
                {
                    name: 'album 3',
                    imgUrl: 'http://www.prisnilos.su/kcfinder/upload/image/articles1/mashina12.jpg'
                },
                {
                    name: 'album 3',
                    imgUrl: 'http://www.prisnilos.su/kcfinder/upload/image/articles1/mashina12.jpg'
                }
            ];



            this.getAll = function () {
                return albums;
            }

            this.getDetail = function (albumKey, callback) {
                callback(images);
            }

            this.addAlbum = function (name) {
                albums.push({
                    name: name,
                    key: name,
                    mainImageUrl: 'http://www.prisnilos.su/kcfinder/upload/image/articles1/mashina12.jpg'
                });
            }
        }
    ]);