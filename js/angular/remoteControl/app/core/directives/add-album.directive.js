'use strict';

angular.module('core').controller('NewAlbumController', ['Gallery', function ($galleryService) {
    this.linkText = 'Add new album';

}]);


angular.module('core').directive('addAlbum', ['Gallery', function ($galleryService) {
    return {
        restrict: 'A',
        require: '^albumList',
        scope: {
        },
        //controller: 'NewAlbumController',
        controller: function () {
            this.linkText = 'Add new album funct';
        },
        controllerAs: 'ctrl',
        template: '<div ng-click="add()" class="polaroid-new-gallery">{{ctrl.linkText}}</div>',
        link: function (scope, element, attrs, albumListCtrl) {
            var a = $galleryService;

            scope.add = function () {
                albumListCtrl.add('album name');
            }
        }
    };
}]);