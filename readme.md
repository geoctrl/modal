# ts-modal (An Angular Service for directives)

Loosely based off of Angular Bootstrap Modal

## Reasoning

Why build a new modal service when the bootstrap one works fine?

### Modularity

**Problem**: Angular-Bootstrap's modal is messy. Developers are required to use a controller/template system, which means if you want to modularize your component to be used in a modal (using a directive), you'd have to pass data through the modal `resolve`, include it in the controller `$scope`, then pass each variable into attributes on the directive element, and lastly, you'll need to handle them all again in the directive.
Also, if you want to store your controller/template elsewhere and pass references in, the two aren't inherently paired (unlike directives). 

**Solution**: This component uses directives instead. You explicitly declare the directive name, and the component is compiled inside the modal:

    tsModalService.open({
      directive: 'directive-name'
    });

### Animation

**Problem**: No control over animation

**Solution**: Use optional dependency VelocityJS for animations. Allows for more control.


## Install

There are currently only 2 ways to use this module:

 - NPM: `npm install ts-modal --save`
 - Clone repo: Use the files in the `dist` folder

## Using the module as a dependency

This module was purposefully built to be a dependency in an Angular application, so the ng-module needs to be passed in as an argument.

Also, the package needs to be `import`ed, so some sort of module loader is required (webpack, browserfy, systemJS, etc).

import the module

    import modal from 'ts-modal';

initialize and pass in your ng-module (app)

    let app = angular.module('app', []);
    modal(app);

now the service (`tsModalService`) is available to be injected

    app.controller('ctrl', function(tsModalService) {
      tsModalService.open({
          directive: 'directiveName',
          resolve: {
              data: Promise.resolve('data'),
              coolStuff: 'I am Legend'
          }
      });
    });

The modal service generates the following html behind the scenes and passes in the resolved data as unique identifiers:

    <div class="ts-modal">
        <directive-name data="data['id']" cool-stuff="data['id']"></directive-name>
    </div>

Example of handling the modal inside declared directive:

    app.directive('directiveName', function() {
      return {
        restrict: 'E',                     // "Element" is required
        scope: {
          data: '=',                       // data is passed in with two-way binding,
          coolStuff: '='                   // all items in the 'resolve' must be declared
        },
        controller: function($scope) {
          console.log($scope.data, $scope.coolStuff);  // you're data is available
        }
      };
    });

Include the SCSS file in your styles:

    @import '../../node_modules/dist/_modal.scss';


## Methods

### .open()

Open a new modal. You can have an unlimited amount of modals open at the same time, but keep in mind that **.submit()** and **.cancel()** methods only apply to the most recent or 'active' modal.

Returns a promise that is resolved when **.submit()** is is called, and rejected when **.cancel()** is called.

    tsModalService.open({
        directive: 'directiveName',
        resolve: {
            data: Promise.resolve('data'),
            coolStuff: 'I am Legend'
        },
        size: 'medium', // (small|medium|large)
        display: 'notification', // (component|notification)
        closeBackdrop: true,
        closeEscape: true,
        animate: true,
        animateDuration: 400, // velocityJS required
    });

#### options

 - **directive** (string) REQUIRED -- The name of the angular directive you wish to pass in.
 - **resolve** (object) -- Data to pass to the directive.
     - You can pass an unlimited amount of items into this object. You can also pass in Promises which will wait till they resolve before building the modal and passing it to the directive.
     - Data is passed to the directive by adding each item to the scope. You must declare them in the scope: `scope: { data: '=' }`.
 - **size** (string) DEFAULT: 'medium' -- The width of the modal. ( small | medium | large )
 - **display** (string) DEFAULT: 'notification' -- The type of modal to display ( notification | component ).
     - notification: Used for things like confirmations and warnings.
     - component: Used for larger components that do heavy lifting (eg pipeline component).
 - **closeBackdrop** (boolean) DEFAULT: true -- Whether clicking the backdrop closes the modal or not.
 - **closeEscape** (boolean) DEFAULT: true -- Whether pressing escape on the keyboard closes the modal or not.
 - **animate** (boolean) DEFAULT: true -- Whether to use VelocityJS for animation (Always use animation - it looks ugly with out it).
 - **animateDuration** (integer) DEFAULT: 400 -- The duration of the animations

### .submit() & .cancel()

Pass data back through the `Promise.resolve()` and `Promise.reject()` callbacks.

    app.directive('directiveName', function() {
      return {
        restrict: 'E',     // "Element" is required
        scope: {},         // resolve data is passed into the scope
        controller: function($scope) {
          console.log($scope.data, $scope.coolStuff);  // you're data is available
          
          // submit
          $scope.submit = function() {
            tsModalService.submit({data: 'data'});
          };
          
          // cancel
          $scope.cancel = function() {
            tsModalService.cancel({data: 'data'});
          };
        }
      };
    });

    // modal promise resolves or rejects
    tsModalService.open({...}).then(
        function submitCb(data) {}, // submit
        function cancelCb(data) {} // cancel
    );

### Modal Helpers

It became necessary, due to rendering issues with other components, to create modal helpers that you can use to get helpful hints about the modal status and condition. Although only one helper is available now, more can be added as the need arises.

#### modalReady `Boolean`

An attribute added to the scope that tells you when the modal is built and the animation is complete.

    app.directive('directiveName', function() {
      return {
        restrict: 'E',
        scope: {
          modalReady: '='      // attribute ready to be added into scope
        },
        controller: function($scope) {
          $scope.$watch('modalReady', function(newVal) {
            if (newVal) {
              console.log('modal is built and animation is complete');
            }
          });
        }
      }
    });

----

## Dev Setup

 - clone repo
 - install global dependencies `npm install webpack webpack-dev-server`
 - install local dependencies (in repo root) `npm install`

## Run Dev Environment

 - `npm start`
 - go to `localhost:8080` in your browser
