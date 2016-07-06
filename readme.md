# Angular Modal Service (modalService)
------

Loosely based off of Angular Bootstrap Modal

## Reasoning

Why build a new modal service when the bootstrap one works fine?

### Modularity

**Problem**: Bootstrap uses a controller/template setup that requires separate dependencies to be setup and stored. The issue with this is that the controller and the template are not inherently paired. You're required to tell the modal service what controller and what template to use.

**Solution**: This component uses directives instead. You explicitly declare the directive name, and the component is compiled inside the modal.

### Animation

**Problem**: No control over animation

**Solution**: Use optional dependency VelocityJS for animations. Allows for more control.


----

## Dev Setup

 - clone repo
 - install global dependencies `npm install webpack webpack-dev-server`
 - install local dependencies (in repo root) `npm install`

## Run Dev Environment

 - `npm start`
 - go to `localhost:8080` in your browser

## Using the module as a dependency

This module was purposefully built to be a dependency in an Angular application, so the ng-module needs to be passed in as an argument:

    let app = angular.module('app', []);
    
import the module

    import modal from 'ts-modal';
    
initialize and pass in your ng-module (app)

    modal(app);
    
now the service is available to be injected

    app.controller('ctrl', function(modalService) {
        modalService.open({
            directive: 'directiveName'
        });
    });

Include the SCSS file in your styles:

    @import '../../node_modules/dist/_modal.scss';


## Methods

### .open()

Open a new modal. You can have an unlimited amount of modals open at the same time, but keep in mind that **.submit()** and **.cancel()** methods only apply to the most recent modal.

Returns a promise that is resolved when **.submit()** is is called, and rejected when **.cancel()** is called.

    let modalPromise = modalService.open({
        directive: 'directiveName',
        resolve: {
            data: Promise.resolve('data')
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

    // from within the directive:
    $scope.submit = function() {
        modalService.submit({data: 'data'});
    };
    $scope.cancel = function() {
        modalService.cancel({data: 'data'});
    };

    // modal promise resolves or rejects
    modalPromise.then(
        function submitCb(data) {},
        function cancelCb(data) {}
    );