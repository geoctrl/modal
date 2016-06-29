import { resolve, dashCase, label } from './_utils';
import modalClass from './modal-class';

export default function($rootScope, $document, $compile, $injector, $q, $timeout) {
	"ngInject";

	// variables
	let $scope,
			modalArray = [],
			isInit = true,
			isDestroy = false,

	// elements
			body = angular.element($document[0].body),
			containerEl = angular.element(`<div class="modal-container"></div>`),
			backdropEl = angular.element(`<div class="modal-backdrop"></div>`),
			modalContainEl = angular.element(`<div class="modal-contain" tabindex="0"></div>`),
			modalEl = angular.element(`<div class="modal"></div>`);


	function currentModal() {
		return modalArray[modalArray.length-1];
	}

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
	function destroy(modal) {
		let finalDestroy = () => {
			containerEl[0].style.display = 'none';
			modalArray = [];
			isInit = true;
			isDestroy = false;
			$scope.$destroy();
			$scope = null;
		};

		if (modal.data._options.animate && Velocity) {
			Velocity(backdropEl, {
				opacity: 0
			}, {
				display: 'none',
				easing: 'easeInOutQuad',
				duration: modal.data._options.animateDuration,
				complete: function() {
					if ($scope) {
						finalDestroy();
					}
				}
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
		
		// if data isn't set
		data = data || {};

		// add modal helpers to facilitate third-party component quirks
		data.tsModalReady = false; // modal is initiated and animation is complete

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

		// create click event for containEl
		newModalContainEl[0].addEventListener('click', clickEventHandler);

		// build modal elements
		newModalEl.append(directiveEl);
		newModalContainEl.append(newModalEl);
		containerEl.append(newModalContainEl);
		$compile(newModalContainEl)($scope);

		// show
		controlIn(currentModal());
	}

	/**
	 * Control In
	 * @param modal
	 */
	function controlIn(modal) {

		// set backdrop z-index
		backdropEl[0].style.zIndex = (modalArray.length*2)-2;

		// display some elements
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
				opacity: [1, .5],
				translateY: [0, `-120%`]
			}, {
				display: 'block',
				delay: 100,
				easing: 'easeOutCubic',
				duration: modal.data._options.animateDuration,
				complete: function() {
					if (isInit) {
						addEvents();
						setFocus(modal.containEl);
					}
					isInit = false;
					// set modal to ready
					$scope.$applyAsync(function() {
						$scope.data[modal.data._id].tsModalReady = true;
					});
				}
			})
		} else {
			modal.el[0].style.display = 'block';
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
		modal.containEl[0].removeEventListener('click', clickEventHandler);

		// wait for duration/2 to see if another modal is starting
		// if not, destroy
		$timeout(() => {
			if (!modalArray.length) {
				isDestroy = true;
				removeEvents();
				destroy(modal);
			}
		}, modal.data._options.animateDuration/2);

		if (modal.data._options.animate && Velocity) {
			Velocity(modal.el, {
				opacity: .6,
				translateY: `-120%`
			}, {
				display: 'none',
				easing: 'easeInOutQuad',
				duration: modal.data._options.animateDuration,
				complete: function() {
					modal.containEl.remove();
				}
			});
		} else {
			modal.containEl.remove();
			if (modal.data._options.animate && !Velocity) {
				console.warn(`${label} Velocity library is not available - cannot animate`);
			}
		}
	}

	function keyPressHandler(e) {
		if (e.keyCode == 27 && currentModal().data._options.closeEscape) {
			cancel();
		}
	}

	function clickEventHandler(e) {
		let modal = currentModal();
		if (e.target == modal.containEl[0] && modal.data._options.closeBackdrop && !isInit) {
			cancel();
		}
	}

	function go(data, type) {
		let modal = currentModal();
		if (modal) {
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
		open(opts) {
			if (!$scope) {
				$scope = $rootScope.$new();
				$scope.data = {};
			}

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

		submit: submit,
		cancel: cancel
	};
};