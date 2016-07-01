(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (app) {
		app.service('tsModalService', _tsModalSvc2.default);
	};
	
	var _tsModalSvc = __webpack_require__(1);
	
	var _tsModalSvc2 = _interopRequireDefault(_tsModalSvc);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = ["$rootScope", "$document", "$compile", "$injector", "$q", "$timeout", function ($rootScope, $document, $compile, $injector, $q, $timeout) {
		"ngInject";
	
		// variables
	
		var $scope = void 0,
		    modalArray = [],
		    isInit = true,
		    isDestroy = false,
		    body = angular.element($document[0].body),
		    bodyClass = '__body-modal-active',
		    containerEl = angular.element('<div class="modal-container"></div>'),
		    backdropEl = angular.element('<div class="modal-backdrop"></div>'),
		    modalContainEl = angular.element('<div class="modal-contain" tabindex="0"></div>'),
		    modalEl = angular.element('<div class="modal"></div>');
	
		/**
	  * initialize (only called once)
	  * no modals present, build structure
	  */
		function init() {
			containerEl.append(backdropEl);
			body.append(containerEl);
		}
	
		/**
	  * Get Current Modal
	  * @returns Modal {*} || null
	  */
		function getCurrentModal() {
			return modalArray.length ? modalArray[modalArray.length - 1] : null;
		}
	
		/**
	  * destroy
	  * remove backdrop and final cleanup
	  */
		function destroy(modal) {
			var finalDestroy = function finalDestroy() {
				toggleBody();
				containerEl[0].style.display = 'none';
				modalArray = []; // empty modal array
				isInit = true;
				isDestroy = false;
				$scope.$destroy(); // destroy $scope
				$scope = null;
			};
	
			// remove backdrop from view & initiate final cleanup
			if (checkAnimate(modal)) {
				animateBackdropOut(modal).then(function (res) {
					return finalDestroy();
				});
			} else {
				backdropEl[0].style.display = 'none';
				if ($scope) {
					finalDestroy();
				}
			}
		}
	
		/**
	  * build modal
	  * @param modal
	  * @param data
	  */
		function buildModal(modal, data) {
			data = data || {}; // if data isn't set
			data.tsModalReady = false; // modal helper (animation is done and modal is ready)
			$scope.data[modal._id] = data; // set data to unique item in object
	
			var newModalContainEl = angular.copy(modalContainEl),
			    // element needed to control z-index with backdrop
			newModalEl = angular.copy(modalEl),
			    // element to be animated
			directiveEl = angular.element( // dynamically building directive
			'<' + (0, _utils.dashCase)(modal._options.directive) + '>\n\t\t\t\t\t\t </' + (0, _utils.dashCase)(modal._options.directive) + '>');
	
			// apply attributes to directive element - assign each object item _id
			angular.forEach(data, function (item, key) {
				directiveEl.attr((0, _utils.dashCase)(key), 'data[\'' + modal._id + '\'].' + key);
			});
	
			// apply options
			newModalContainEl.addClass('modal-contain--' + modal._options.size); // set size
			newModalContainEl.addClass('modal-contain--' + modal._options.display); // set display
			newModalContainEl[0].style.zIndex = modalArray.length * 2 + 1; // set z-index
	
			// add modal to modal array
			modalArray.push({
				data: modal,
				containEl: newModalContainEl,
				el: newModalEl
			});
	
			// create click event for containEl
			newModalContainEl[0].addEventListener('click', clickEventHandler);
	
			// build modal elements
			newModalEl.append(directiveEl);
			newModalContainEl.append(newModalEl);
			containerEl.append(newModalContainEl);
			$compile(newModalContainEl)($scope);
	
			controlIn(getCurrentModal()); // show
		}
	
		/**
	  * Control In
	  * control what happens when the modal is Opened
	  * @param modal
	  */
		function controlIn(modal) {
			backdropEl[0].style.zIndex = modalArray.length * 2 - 2; // set backdrop z-index
			containerEl[0].style.display = 'block'; // display some elements
	
			// bring modal into view
			if (checkAnimate(modal)) {
				if (isInit) {
					toggleBody(); // toggle body classes and stuff
					animateBackdropIn(modal); // animate backdrop in
				}
				animateModalIn(modal); // animate modal in
			} else {
					modal.el[0].style.display = 'block'; // manually show modal
					backdropEl[0].style.display = 'block'; // manually show backdrop
					setFocus(modal.containEl); // focus on modal
				}
			isInit = false; // done initializing
		}
	
		/**
	  * Control Out
	  * control what happens when a modal is closed
	  * @param modal
	  */
		function controlOut(modal) {
			backdropEl[0].style.zIndex = modalArray.length * 2 - 2; // change backdrop z-index position
			modal.containEl[0].removeEventListener('click', clickEventHandler); // remove
	
			// if last modal, wait for duration/2 to see if another modal is starting - if not, destroy
			$timeout(function () {
				if (modalArray.length == 0) {
					isDestroy = true;removeEvents();destroy(modal);
				}
			}, modal.data._options.animateDuration / 2);
	
			// remove modal from view
			checkAnimate(modal) ? animateModalOut(modal) : modal.containEl.remove();
		}
	
		function animateModalIn(modal) {
			Velocity(modal.el, {
				opacity: [1, .5],
				translateY: [0, '-120%']
			}, {
				display: 'block',
				delay: 100,
				easing: 'easeOutCubic',
				duration: modal.data._options.animateDuration,
				complete: function complete() {
					setFocus(modal.containEl); // focus on the modal container
					$scope.$applyAsync(function () {
						return $scope.data[modal.data._id].tsModalReady = true;
					}); // modal helpers
				}
			});
		}
	
		function animateModalOut(modal) {
			Velocity(modal.el, {
				opacity: .6,
				translateY: '-120%'
			}, {
				display: 'none',
				easing: 'easeInOutQuad',
				duration: modal.data._options.animateDuration,
				complete: function complete() {
					return modal.containEl.remove();
				}
			});
		}
	
		function animateBackdropIn(modal) {
			Velocity(backdropEl, {
				opacity: [1, 0]
			}, {
				display: 'block',
				easing: 'easeOutCubic',
				duration: modal.data._options.animateDuration
			});
		}
	
		function animateBackdropOut(modal) {
			return $q(function (resolve, reject) {
				Velocity(backdropEl, {
					opacity: 0
				}, {
					display: 'none',
					easing: 'easeInOutQuad',
					duration: modal.data._options.animateDuration,
					complete: function complete() {
						return $scope ? resolve() : reject();
					}
				});
			});
		}
	
		function toggleBody() {
			body[isInit ? 'addClass' : 'removeClass'](bodyClass);
			body[0].style.paddingRight = (isInit ? (0, _utils.getScrollbarWidth)() : 0) + 'px';
		}
	
		/**
	  * check if animation is possible
	  * @param modal
	  * @returns {boolean}
	  */
		function checkAnimate(modal) {
			if (!Velocity) {
				console.warn(_utils.label + ' Velocity library is not available - cannot animate');return false;
			} else if (modal.data._options.animate) {
				return true;
			}
		}
	
		/**
	  * GO
	  * both submit and cancel remove the modal,
	  * the only difference is one is 'resolved' and the other is 'rejected'
	  * @param data
	  * @param type
	  */
		function go(data, type) {
			var modal = getCurrentModal(); // get current/visible modal
			if (modal) {
				modalArray.pop(); // remove modal from modalArray
				controlOut(modal); // handle modal elements/events etc
				modal.data.getPromise()[type == 'submit' ? 'resolve' : 'reject'](data); // resolve or reject
			}
		}
	
		/**
	  * set Focus
	  * once the modal is displayed, set focus
	  * @param el
	  */
		function setFocus(el) {
			var inputWithAutofocus = el[0].querySelector('[autofocus]');
			if (inputWithAutofocus) {
				inputWithAutofocus.focus();
			} else {
				el[0].focus();
			}
		}
	
		// global event handlers
		var addEvents = function addEvents() {
			return $document[0].addEventListener('keydown', keyPressHandler);
		};
		var removeEvents = function removeEvents() {
			return $document[0].removeEventListener('keydown', keyPressHandler);
		};
		var keyPressHandler = function keyPressHandler(e) {
			if (e.keyCode == 27 && getCurrentModal().data._options.closeEscape) {
				go(null, 'cancel');
			}
		};
		var clickEventHandler = function clickEventHandler(e) {
			var modal = getCurrentModal();
			if (e.target == modal.containEl[0] && modal.data._options.closeBackdrop && !isInit) {
				go(null, 'cancel');
			}
		};
	
		/**
	  * public API
	  */
		return {
			/**
	   * open modal
	   * @param opts (opts.directive is required)
	   * @returns {Promise} Modal
	   */
	
			open: function open(opts) {
				if (!$scope) {
					$scope = $rootScope.$new(); // create a new scope
					$scope.data = {}; // added data into the scope
					addEvents(); // start global events
				}
	
				// create new modal
				var newModal = new _modalClass2.default(opts, $injector); // create new modal class
				newModal.setPromise($q.defer()); // set deferred promise
				if (isInit) init(); // initialize
	
				if (opts.resolve) {
					// if there's stuff to resolve, so that before building modal
					(0, _utils.resolve)($q, opts.resolve).then(function (res) {
						return buildModal(newModal, res);
					});
				} else {
					buildModal(newModal); // else just build the modal
				}
				return newModal.getPromise().promise; // return promise
			},
	
	
			/**
	   * submit and cancel
	   * @param data
	   */
			submit: function submit(data) {
				go(data, 'submit');
			},
			cancel: function cancel(data) {
				go(data, 'cancel');
			}
		};
	}];
	
	var _utils = __webpack_require__(2);
	
	var _modalClass = __webpack_require__(4);
	
	var _modalClass2 = _interopRequireDefault(_modalClass);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.label = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.guid = guid;
	exports.dashCase = dashCase;
	exports.cleanValidateOptions = cleanValidateOptions;
	exports.resolve = resolve;
	exports.getScrollbarWidth = getScrollbarWidth;
	
	var _defaultOptions = __webpack_require__(3);
	
	var _defaultOptions2 = _interopRequireDefault(_defaultOptions);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var label = exports.label = '[tsModalService]';
	
	/**
	 * create guid
	 * @returns {*} guid
	 */
	function guid() {
		return (typeof window.crypto != 'undefined' && typeof window.crypto.getRandomValues != 'undefined' ? function () {
			// If we have a cryptographically secure PRNG
			var buf = new Uint16Array(8);
			window.crypto.getRandomValues(buf);
			var S4 = function S4(num) {
				var ret = num.toString(16);
				while (ret.length < 4) {
					ret = "0" + ret;
				}
				return ret;
			};
			return S4(buf[0]) + S4(buf[1]) + "-" + S4(buf[2]) + "-" + S4(buf[3]) + "-" + S4(buf[4]) + "-" + S4(buf[5]) + S4(buf[6]) + S4(buf[7]);
		} : function () {
			// Otherwise, just use Math.random
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0,
				    v = c == 'x' ? r : r & 0x3 | 0x8;
				return v.toString(16);
			}); // replace
		})();
	}
	
	function dashCase(str) {
		return str.replace(/([A-Z])/g, function ($1) {
			return "-" + $1.toLowerCase();
		});
	}
	
	/**
	 * validate options
	 * also cleans it up
	 * @param options
	 * @param $injector
	 */
	function cleanValidateOptions(options, $injector) {
	
		// check if options is an object and if it has a directive property
		if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || !options.directive) {
			throw label + ' directive property is required';
	
			// check if directive is a string
		} else if (typeof options.directive !== 'string') {
				throw label + ' directive must be a string';
	
				// check if directive is available in ng module
			} else if (!$injector.has(options.directive + 'Directive')) {
					throw label + ' ' + options.directive + ' is not a valid directive';
				}
	
		// assign
		options = Object.assign({}, _defaultOptions2.default, options);
	
		// size
		// force medium default when an unknown value is supplied
		if (options.size != 'small' && options.size != 'medium' && options.size != 'large') {
			console.warn('[Modal Warning] ' + (options.size ? options.size : 'Unknown') + ' is not a valid size - defaulting to "medium" (small|medium|large)');
			options.size = 'medium';
		}
	
		// display
		// force 'notification' default when an unknown display is supplied
		if (options.display != 'component' & options.display != 'notification') {
			console.warn(label + ' ' + (options.display ? options.display : 'Unknown') + ' is not a valid display type - defaulting to "notification" (component|notification)');
			options.display = 'scroll';
		}
	
		return options;
	}
	
	/**
	 * Resolve stuff
	 * wraps a promise around any type of thing
	 * and won't return until all promises resolve
	 * @param $q
	 * @param obj
	 * @returns {Promise}
	 */
	function resolve($q, obj) {
		var promises = [];
		var names = [];
	
		// wrap stuff in promises
	
		var _loop = function _loop(r) {
			names.push(r);
			promises.push($q(function (resolve) {
				if (typeof obj[r] === 'function') {
					resolve(obj[r]());
				} else {
					resolve(obj[r]);
				}
			}));
		};
	
		for (var r in obj) {
			_loop(r);
		}
	
		// send back promise where data is the object unwrapped
		return $q.all(promises).then(function (res) {
			var o = {};
			for (var i = 0; i < res.length; i++) {
				o[names[i]] = res[i];
			}
			return o;
		});
	}
	
	/**
	 * get scroll bar width
	 * @returns {number}
	 */
	function getScrollbarWidth() {
		var outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		document.body.appendChild(outer);
	
		var widthNoScroll = outer.offsetWidth;
		outer.style.overflow = "scroll";
	
		var inner = document.createElement("div");
		inner.style.width = "100%";
		outer.appendChild(inner);
	
		var widthWithScroll = inner.offsetWidth;
		outer.parentNode.removeChild(outer);
	
		return widthNoScroll - widthWithScroll;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
	
		/**
	  * size
	  * decides the width
	  * @type string (small|medium|large)
	  */
		size: 'medium',
	
		/**
	  * display
	  * decides the display type
	  * @type string (component|notification)
	  */
		display: 'notification',
	
		/**
	  * backdrop
	  * show/hide backdrop
	  * @type boolean
	  */
		backdrop: true,
	
		/**
	  * closeBackdrop
	  * if true, allows users to close modal by clicking backdrop
	  * @type boolean
	  */
		closeBackdrop: true,
	
		/**
	  * closeEscape
	  * if true allows users to close modal by pressing 'esc'
	  * @type boolean
	  */
		closeEscape: true,
	
		/**
	  * animate
	  * whether to animate the modal
	  * @type boolean
	  */
		animate: true,
	
		/**
	  * animateDuration
	  * duration of animation
	  * @type int
	  */
		animateDuration: 400
	
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Class representing a Modal
	 * used by the Modal service
	 */
	
	var _class = function () {
		/**
	  * create modal
	  * @param opts
	  * @param $injector
	  */
	
		function _class() {
			var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
			var $injector = arguments[1];
	
			_classCallCheck(this, _class);
	
			// make sure all params and options are in order
			this._options = (0, _utils.cleanValidateOptions)(opts, $injector);
			this._id = (0, _utils.guid)();
		}
	
		_createClass(_class, [{
			key: 'setPromise',
			value: function setPromise(defer) {
				this._defer = defer;
			}
		}, {
			key: 'getPromise',
			value: function getPromise() {
				return this._defer;
			}
		}]);
	
		return _class;
	}();
	
	exports.default = _class;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map