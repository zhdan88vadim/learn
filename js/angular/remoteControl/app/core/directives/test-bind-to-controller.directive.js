'use strict';


// https://blog.thoughtram.io/angularjs/2015/01/02/exploring-angular-1.3-bindToController.html#the-problem-with-controlleras-in-directives




// ----------------------------------

// Binding to controllers with bindToController

// When set to true in a directive with isolated scope that uses controllerAs, the component’s properties are bound to the controller rather than to the scope.
// That means, Angular makes sure that, when the controller is instantiated, the initial values of the isolated scope 
// bindings are available on this, and future changes are also automatically available.

// ----------------------------------

// http://stackoverflow.com/questions/31273463/angularjs-1-4-how-to-create-two-way-binding-using-bindtocontroller-and-controll

// Further reading: One major thing that this new bindToController syntax allows is the ability for the directive to not be an 
// isolated scope and still identify what to bind. You can actually set scope to true on your directive to have a new child scope 
// that will inherit from it's ancestors.

// ----------------------------------




angular.module('core').controller('TestBindToController', ['$scope', 'Gallery', function ($scope, $galleryService) {
    //this.linkText = 'Add new album';

    $scope.linkText = 'from scope';

}]);


// https://docs.angularjs.org/api/ng/directive/ngModel
// https://docs.angularjs.org/api/ng/directive/ngBind
// https://docs.angularjs.org/api/ng/directive/ngValue


// bindToController vs scope angular v1.4
// https://github.com/johnpapa/angular-styleguide/issues/430

// --

// http://stackoverflow.com/questions/37937525/what-does-bindtocontroller-do-in-angularjs-1-4

// ---

/*

<my-records hash="A3F9" records="ctrl.records" close="ctrl.close()"></my-records>
// 1.3
bindToController: true,
scope: {
  hash: '@',
  records: '=',
  close: '&'
}


// 1.4+
bindToController: {
  hash: '@',
  records: '=',
  close: '&'
},
scope: {}

*/


// !!!!!!!!!!!!!!!!!!!!!


// Refactoring Angular Apps to Component Style

// !! https://teropa.info/blog/2015/10/18/refactoring-angular-apps-to-components.html


/*

Here's what an Angular 1.x component looks like:

<my-confirmation
  message="'Launch missiles?'"
  on-ok="launchMissiles()">
</my-confirmation>
And here's how you can define such a component as a directive:

module.directive('myConfirmation', function() {
  return {
    scope: {},
    bindToController: {
      message: '=',
      onOk: '&'
    },
    controller: function() { },
    controllerAs: 'ctrl',
    template: `
      <div>
        {{ctrl.message}}
        <button ng-click=“ctrl.onOk()">
          OK
        </button>
      </div>
    `
  }
});

*/



// 5 Guidelines For Avoiding Scope Soup in Angular
// http://www.technofattie.com/2014/03/21/five-guidelines-for-avoiding-scope-soup-in-angular.html




angular.module('core').directive('testBindTo', ['Gallery', function ($galleryService) {
    return {
        restrict: 'A',
        require: '^albumList',
//        controller: 'TestBindToController',
        controller: function () {
            this.linkText = 'testBindToController';
        },
        controllerAs: 'ctrl',
        bindToController: { 
            message: '=' 
        },
        scope: {}, //<-- isolated scope
        template: 'Hello <span ng-bind="ctrl.message"></span>! {{ctrl.message}} <input type="text" ng-model="ctrl.message">',


        // "albumListCtrl" is the "albumList" directive's controller
        // link: function (scope, element, attrs, albumListCtrl) {
        //     var a = $galleryService;

        //     scope.addAlbum = function () {
        //         albumListCtrl.addAlbum('test');
        //     }
        // }
    };
}]);