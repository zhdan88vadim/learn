angular.module('core').directive('myNewAlbum', ['Gallery', function ($galleryService) {
    return {
        restrict: 'A',
        require: '^albumList',
        scope: {

        },
        template: '<a ng-click="addAlbum()">Add new album</a>',
        // "albumListCtrl" is the "albumList" directive's controller
        link: function(scope, element, attrs, albumListCtrl) {
            var a = $galleryService;
            
            scope.addAlbum = function() {
                albumListCtrl.addAlbum('test');
            }
        }
    };
}]);