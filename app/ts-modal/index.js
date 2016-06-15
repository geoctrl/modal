
import { resolve, dashCase, label, getScrollbarWidth } from './_utils';
import modalClass from './modal-class';

// set ng module
let app = angular.module('ts.modal', []);

/**
 * tsModalService
 */
app.service('tsModalService', function($rootScope, $document, $compile, $injector, $q) {
	"ngInject";

	// variables
	let $scope = $rootScope.$new(),
			modalArray = [],
			stash = {},
			isInit = true,
			isDestroy = false,

			// elements
			body = angular.element($document[0].body),
			containerEl = angular.element(`<div class="modal-container"></div>`),
			backdropEl = angular.element(`<div class="modal-backdrop"></div>`),
			modalContainEl = angular.element(`<div class="modal-contain" tabindex="0"></div>`),
			modalEl = angular.element(`<div class="modal"></div>`);


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
		let newModalContainEl = angular.copy(modalContainEl),
				newModalEl = angular.copy(modalEl),
				directiveEl = angular.element(`<${dashCase(modal._options.directive)}></${dashCase(modal._options.directive)}>`);

		// apply data to directive
		angular.forEach(data, (item, key) => {
			directiveEl.attr(dashCase(key), `data['${modal._id}'].${key}`);
		});

		// set size
		newModalContainEl.addClass(`modal-contain--${modal._options.size}`);

		// set display
		newModalContainEl.addClass(`modal-contain--${modal._options.display}`);

		// set z-index
		newModalContainEl[0].style.zIndex = (modalArray.length*2)+1;

		// add modal to modal array
		modalArray.push({
			data: modal,
			containEl: newModalContainEl,
			el: newModalEl
		});

		// build modal elements
		newModalEl.append(directiveEl);
		newModalContainEl.append(newModalEl);
		containerEl.append(newModalContainEl);
		$compile(newModalContainEl)($scope);

		// show
		controlIn(modalArray[modalArray.length-1]);
	}

	/**
	 * Control In
	 * @param modal
	 */
	function controlIn(modal) {

		backdropEl[0].style.zIndex = (modalArray.length*2)-2;
		modal.el[0].style.display = 'block';

		if (modal.data._options.animate && Velocity) {
			if (isInit) {
				containerEl[0].style.display = 'block';
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
				translateY: [0, `-100%`]
			}, {
				delay: 100,
				easing: 'easeOutCubic',
				duration: modal.data._options.animateDuration,
				complete: function() {
					if (isInit) {
						addEvents();
						setFocus(modal.el);
					}
					isInit = false;
				}
			})
		} else {
			containerEl[0].style.display = 'block';
			backdropEl[0].style.display = 'block';
			setFocus(modal.containEl);

			if (modal.data._options.animate && !Velocity) {
				console.warn(`${label} Velocity library is not available - cannot animate`);
			}
		}
	}

	/**
	 * Control Out
	 * @param modal
	 */
	function controlOut(modal) {

		backdropEl[0].style.zIndex = (modalArray.length*2)-2;

		if (modal.data._options.animate && Velocity) {
			Velocity(modal.el, {
				opacity: .5,
				translateY: `-100%`
			}, {
				display: 'none',
				easing: 'easeInOutQuad',
				duration: modal.data._options.animateDuration,
				complete: function() {
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
					complete: function() {
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
				console.warn(`${label} Velocity library is not available - cannot animate`);
			}
		}
	}

	function keyPressHandler(e) {
		if (e.keyCode == 27) {
			cancel();
		}
	}

	function backdropEventHandler() {
		if (modalArray[modalArray.length-1].data._options.closeBackdrop && !isInit) {
			cancel();
		}
	}

	function go(data, type) {
		let modal = modalArray[modalArray.length-1];
		if (modal) {
			if (modalArray.length==1) {
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
		backdropEl[0].addEventListener('click', backdropEventHandler);
		$document[0].addEventListener('keydown', keyPressHandler);
	}

	function removeEvents() {
		backdropEl[0].removeEventListener('click', backdropEventHandler);
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
		open(opts) {

			// create new modal
			let newModal = new modalClass(opts, $injector);

			newModal.setPromise($q.defer());

			// init if there's no elements
			if (isInit) init();

			if (opts.resolve) {
				resolve($q, opts.resolve).then(
						res => {
							buildModal(newModal, res);
						}
				);
			} else {
				buildModal(newModal);
			}

			return newModal.getPromise().promise;
		},

		getData() {
			return angular.copy(modalArray[modalArray.length-1].data.getData());
		},

		submit: submit,
		cancel: cancel
	};
});