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
	
	__webpack_require__(1);
	
	var _utils = __webpack_require__(3);
	
	var _modalClass = __webpack_require__(5);
	
	var _modalClass2 = _interopRequireDefault(_modalClass);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// set ng module
	var app = angular.module('ts.modal', []);
	
	/**
	 * tsModalService
	 */
	// require app styles
	app.service('tsModalService', ["$rootScope", "$document", "$compile", "$injector", "$q", function ($rootScope, $document, $compile, $injector, $q) {
		"ngInject";
	
		// variables
	
		var $scope = $rootScope.$new(),
		    modalArray = [],
		    stash = {},
		    isInit = true,
		    isDestroy = false,
	
	
		// elements
		body = angular.element($document[0].body),
		    containerEl = angular.element('<div class="modal-container"></div>'),
		    backdropEl = angular.element('<div class="modal-backdrop"></div>'),
		    modalContainEl = angular.element('<div class="modal-contain" tabindex="0"></div>'),
		    modalEl = angular.element('<div class="modal"></div>');
	
		// store data here
		$scope.data = {};
	
		/**
	  * initialize
	  * no modals present, build structure
	  */
		function init() {
			containerEl.append(backdropEl);
			body.append(containerEl);
		}
	
		/**
	  * destroy
	  * done with modals, clean up
	  * assumes only one modal is left
	  */
		function destroy() {
			containerEl[0].style.display = 'none';
			modalArray = [];
			isInit = true;
			isDestroy = false;
		}
	
		/**
	  * build modal
	  * @param modal
	  * @param data
	  */
		function buildModal(modal, data) {
			// set data
			$scope.data[modal._id] = data;
	
			// create new element
			var newModalContainEl = angular.copy(modalContainEl),
			    newModalEl = angular.copy(modalEl),
			    directiveEl = angular.element('<' + (0, _utils.dashCase)(modal._options.directive) + '></' + (0, _utils.dashCase)(modal._options.directive) + '>');
	
			// apply data to directive
			angular.forEach(data, function (item, key) {
				directiveEl.attr((0, _utils.dashCase)(key), 'data[\'' + modal._id + '\'].' + key);
			});
	
			// set size
			newModalContainEl.addClass('modal-contain--' + modal._options.size);
	
			// set display
			newModalContainEl.addClass('modal-contain--' + modal._options.display);
	
			// set z-index
			newModalContainEl[0].style.zIndex = modalArray.length * 2 + 1;
	
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
	
			// show
			controlIn(modalArray[modalArray.length - 1]);
		}
	
		/**
	  * Control In
	  * @param modal
	  */
		function controlIn(modal) {
	
			// set backdrop z-index
			backdropEl[0].style.zIndex = modalArray.length * 2 - 2;
	
			// display some elements
			modal.el[0].style.display = 'block';
			containerEl[0].style.display = 'block';
	
			// if animation is available and set to true
			if (modal.data._options.animate && Velocity) {
				if (isInit) {
					// if this is the first modal, fade in the backdrop
					Velocity(backdropEl, {
						opacity: [1, 0]
					}, {
						display: 'block',
						easing: 'easeOutCubic',
						duration: modal.data._options.animateDuration
					});
				}
	
				Velocity(modal.el, {
					opacity: 1,
					translateY: [0, '-100%']
				}, {
					delay: 100,
					easing: 'easeOutCubic',
					duration: modal.data._options.animateDuration,
					complete: function complete() {
						if (isInit) {
							addEvents();
							setFocus(modal.containEl);
						}
						isInit = false;
					}
				});
			} else {
				backdropEl[0].style.display = 'block';
				setFocus(modal.containEl);
	
				if (modal.data._options.animate && !Velocity) {
					console.warn(_utils.label + ' Velocity library is not available - cannot animate');
				}
			}
		}
	
		/**
	  * Control Out
	  * @param modal
	  */
		function controlOut(modal) {
	
			backdropEl[0].style.zIndex = modalArray.length * 2 - 2;
			modal.containEl[0].removeEventListener('click', clickEventHandler);
	
			if (modal.data._options.animate && Velocity) {
				Velocity(modal.el, {
					opacity: .6,
					translateY: '-100%'
				}, {
					display: 'none',
					easing: 'easeInOutQuad',
					duration: modal.data._options.animateDuration,
					complete: function complete() {
						modal.containEl.remove();
					}
				});
				if (isDestroy) {
					Velocity(backdropEl, {
						opacity: 0
					}, {
						display: 'none',
						easing: 'easeInOutQuad',
						duration: modal.data._options.animateDuration,
						complete: function complete() {
							destroy();
						}
					});
				}
			} else {
				modal.containEl.remove();
				if (isDestroy) {
					backdropEl[0].style.display = 'none';
					destroy();
				}
				if (modal.data._options.animate && !Velocity) {
					console.warn(_utils.label + ' Velocity library is not available - cannot animate');
				}
			}
		}
	
		function keyPressHandler(e) {
			if (e.keyCode == 27) {
				cancel();
			}
		}
	
		function clickEventHandler(e) {
			var modal = modalArray[modalArray.length - 1];
			if (e.target == modal.containEl[0] && modal.data._options.closeBackdrop && !isInit) {
				cancel();
			}
		}
	
		function go(data, type) {
			var modal = modalArray[modalArray.length - 1];
			if (modal) {
				if (modalArray.length == 1) {
					isDestroy = true;
					removeEvents();
				}
				modalArray.pop();
				if (type == 'submit') {
					modal.data.getPromise().resolve(data);
				} else {
					modal.data.getPromise().reject(data);
				}
				controlOut(modal);
			}
		}
	
		function cancel(data) {
			go(data, 'cancel');
		}
	
		function submit(data) {
			go(data, 'submit');
		}
	
		function addEvents() {
			$document[0].addEventListener('keydown', keyPressHandler);
		}
	
		function removeEvents() {
			$document[0].removeEventListener('keydown', keyPressHandler);
		}
	
		function setFocus(el) {
			var inputWithAutofocus = el[0].querySelector('[autofocus]');
			if (inputWithAutofocus) {
				inputWithAutofocus.focus();
			} else {
				el[0].focus();
			}
		}
	
		/**
	  * public API
	  */
		return {
			open: function open(opts) {
	
				// create new modal
				var newModal = new _modalClass2.default(opts, $injector);
	
				newModal.setPromise($q.defer());
	
				// init if there's no elements
				if (isInit) init();
	
				if (opts.resolve) {
					(0, _utils.resolve)($q, opts.resolve).then(function (res) {
						buildModal(newModal, res);
					});
				} else {
					buildModal(newModal);
				}
	
				return newModal.getPromise().promise;
			},
	
	
			submit: submit,
			cancel: cancel
		};
	}]);

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */
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
	exports.getScrollbarWidth = getScrollbarWidth;
	exports.resolve = resolve;
	
	var _defaultOptions = __webpack_require__(4);
	
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
	
	function getScrollbarWidth() {
		var outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
	
		document.body.appendChild(outer);
	
		var widthNoScroll = outer.offsetWidth;
		// force scrollbars
		outer.style.overflow = "scroll";
	
		// add innerdiv
		var inner = document.createElement("div");
		inner.style.width = "100%";
		outer.appendChild(inner);
	
		var widthWithScroll = inner.offsetWidth;
	
		// remove divs
		outer.parentNode.removeChild(outer);
	
		return widthNoScroll - widthWithScroll;
	}
	
	function resolve($q, obj) {
		var promises = [];
		var names = [];
	
		var _loop = function _loop(r) {
	
			if (typeof obj[r] !== 'function') {
				throw label + ' resolve must return object of functions';
			} else {
				names.push(r);
				var deferred = $q(function (resolve) {
					resolve(obj[r]());
				});
	
				promises.push(deferred);
			}
		};
	
		for (var r in obj) {
			_loop(r);
		}
	
		return $q.all(promises).then(function (res) {
			var o = {};
			for (var i = 0; i < res.length; i++) {
				o[names[i]] = res[i];
			}
			return o;
		});
	}

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(3);
	
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
//# sourceMappingURL=ts-modal.js.map