import { resolve, dashCase, label, getScrollbarWidth } from './_utils';
import modalClass from './modal-class';

export default function($rootScope, $document, $compile, $injector, $q, $timeout) {
	"ngInject";

	// variables
	let $scope,
			modalArray = [],
			isInit = true,
			isDestroy = false,
			bodyClass = '__body-modal-active',

			// elements and templates
			body = angular.element($document[0].body),
			containerEl = angular.element(`<div class="modal-container"></div>`),
			backdropEl = angular.element(`<div class="modal-backdrop"></div>`),
			modalContainEl = angular.element(`<div class="modal-contain" tabindex="0"></div>`),
			modalEl = angular.element(`<div class="modal"></div>`);



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
		return modalArray.length
				? modalArray[modalArray.length-1]
				: null;
	}



	/**
	 * destroy
	 * remove backdrop and final cleanup
	 */
	function destroy(modal) {
		let finalDestroy = () => {
			toggleBody();
			containerEl[0].style.display = 'none';
			modalArray = [];    // empty modal array
			isInit = true;
			isDestroy = false;
			$scope.$destroy();  // destroy $scope
			$scope = null;
		};

		// remove backdrop from view & initiate final cleanup
		if (checkAnimate(modal)) {
			animateBackdropOut(modal).then(res => finalDestroy()); // wait till animation finishes
		} else {
			backdropEl[0].style.display = 'none';
			if ($scope) { finalDestroy() }
		}
	}



	/**
	 * build modal
	 * add elements, compile and add to DOM
	 * @param modal
	 * @param data
	 */
	function buildModal(modal, data) {
		data = data || {};              // if data isn't set
		data.tsModalReady = false;      // modal helper (animation is done and modal is ready)
		$scope.data[modal._id] = data;  // set data to unique item in object

		let newModalContainEl = angular.copy(modalContainEl), // element needed to control z-index with backdrop
				newModalEl = angular.copy(modalEl),               // element to be animated
				directiveEl = angular.element(                    // dynamically building directive
						`<${dashCase(modal._options.directive)}>
						 </${dashCase(modal._options.directive)}>`);

		// apply attributes to directive element - assign each object item _id
		angular.forEach(data, (item, key) => {
			directiveEl.attr(dashCase(key), `data['${modal._id}'].${key}`);
		});

		// apply options
		newModalContainEl.addClass(`modal-contain--${modal._options.size}`);      // set size
		newModalContainEl.addClass(`modal-contain--${modal._options.display}`);   // set display
		newModalContainEl[0].style.zIndex = (modalArray.length*2)+1;              // set z-index

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
		backdropEl[0].style.zIndex = (modalArray.length*2)-2; // set backdrop z-index
		containerEl[0].style.display = 'block';               // display some elements

		// bring modal into view
		if (checkAnimate(modal)) {
			if (isInit) {
				toggleBody();                         // toggle body classes and stuff
				animateBackdropIn(modal);             // animate backdrop in
			}
			animateModalIn(modal);                  // animate modal in
		} else {
			modal.el[0].style.display = 'block';    // manually show modal
			backdropEl[0].style.display = 'block';  // manually show backdrop
			setFocus(modal.containEl);              // focus on modal
		}
		isInit = false;                           // done initializing
	}



	/**
	 * Control Out
	 * control what happens when a modal is closed
	 * @param modal
	 */
	function controlOut(modal) {
		backdropEl[0].style.zIndex = (modalArray.length*2)-2;               // change backdrop z-index position
		modal.containEl[0].removeEventListener('click', clickEventHandler); // remove

		// if last modal, wait for duration/2 to see if another modal is starting - if not, destroy
		$timeout(() => {
			if (modalArray.length==0) { isDestroy = true; removeEvents(); destroy(modal); }
		}, modal.data._options.animateDuration/2);

		// remove modal from view
		checkAnimate(modal) ? animateModalOut(modal) : modal.containEl.remove();
	}



	/**
	 * Animate Modal In
	 * @param modal
	 */
	function animateModalIn(modal) {
		Velocity(modal.el, {
			opacity: [1, .5],
			translateY: [0, `-120%`]
		}, {
			display: 'block',
			delay: 100,
			easing: 'easeOutCubic',
			duration: modal.data._options.animateDuration,
			complete: () => {
				setFocus(modal.containEl);  // focus on the modal container
				$scope.$applyAsync(() => $scope.data[modal.data._id].tsModalReady = true );   // modal helpers
			}
		})
	}



	/**
	 * Animate Modal Out
	 * @param modal
	 */
	function animateModalOut(modal) {
		Velocity(modal.el, {
			opacity: .6,
			translateY: `-120%`
		}, {
			display: 'none',
			easing: 'easeInOutQuad',
			duration: modal.data._options.animateDuration,
			complete: () => modal.containEl.remove()
		});
	}



	/**
	 * Animate Backdrop In
	 * @param modal
	 */
	function animateBackdropIn(modal) {
		Velocity(backdropEl, {
			opacity: [1, 0]
		}, {
			display: 'block',
			easing: 'easeOutCubic',
			duration: modal.data._options.animateDuration
		});
	}



	/**
	 * Animate Backdrop Out
	 * Destroying relies on this component being finished
	 * @param modal
	 * @returns {Promise}
	 */
	function animateBackdropOut(modal) {
		return $q((resolve, reject) => {
			Velocity(backdropEl, {
				opacity: 0
			}, {
				display: 'none',
				easing: 'easeInOutQuad',
				duration: modal.data._options.animateDuration,
				complete: () => $scope ? resolve() : reject()
			});
		});
	}



	/**
	 * toggle body class
	 * mimics scrollbar spacing
	 */
	function toggleBody() {
		body[0].style.paddingRight = `${isInit ? getScrollbarWidth(body) : 0}px`;
		body[isInit ? 'addClass' : 'removeClass'](bodyClass);
	}



	/**
	 * check if animation is possible
	 * @param modal
	 * @returns {boolean}
	 */
	function checkAnimate(modal) {
		if (!Velocity) { console.warn(`${label} Velocity library is not available - cannot animate`); return false; }
		else if (modal.data._options.animate) { return true; }
	}



	/**
	 * GO
	 * both submit and cancel remove the modal,
	 * the only difference is one is 'resolved' and the other is 'rejected'
	 * @param data
	 * @param type
	 */
	function go(data, type) {
		let modal = getCurrentModal(); // get current/visible modal
		if (modal) {
			modalArray.pop();   // remove modal from modalArray
			controlOut(modal);  // handle modal elements/events etc
			modal.data.getPromise()[type=='submit' ? 'resolve' : 'reject'](data); // resolve or reject
		}
	}



	/**
	 * set Focus
	 * once the modal is displayed, set focus
	 * @param el
	 */
	function setFocus(el) {
		var inputWithAutofocus = el[0].querySelector('[autofocus]');
		if (inputWithAutofocus) { inputWithAutofocus.focus(); } else { el[0].focus() }
	}



	/**
	 * EVENTS AND HANDLERS
	 */
	let addEvents = () => $document[0].addEventListener('keydown', keyPressHandler);
	let removeEvents = () => $document[0].removeEventListener('keydown', keyPressHandler);
	let keyPressHandler = (e) => {
		if (e.keyCode == 27 && getCurrentModal().data._options.closeEscape) {
			go(null, 'cancel');
		}
	};
	let clickEventHandler = (e) => {
		let modal = getCurrentModal();
		if (e.target == modal.containEl[0] && modal.data._options.closeBackdrop && !isInit) {
			go(null, 'cancel');
		}
	};



	/**
	 * PUBLIC API
	 */
	return {
		/**
		 * open modal
		 * @param opts (opts.directive is required)
		 * @returns {Promise} Modal
		 */
		open(opts) {
			if (!$scope) {
				$scope = $rootScope.$new(); // create a new scope
				$scope.data = {};           // added data into the scope
				addEvents();                // start global events
			}

			// create new modal
			let newModal = new modalClass(opts, $injector); // create new modal class
			newModal.setPromise($q.defer());                // set deferred promise
			if (isInit) init();                             // initialize

			if (opts.resolve) {
				// if there's stuff to resolve, do that before building modal
				resolve($q, opts.resolve).then(res => buildModal(newModal, res) );
			} else {
				buildModal(newModal); // else just build the modal
			}
			return newModal.getPromise().promise; // return promise
		},

		/**
		 * submit and cancel
		 * @param data
		 */
		submit(data) { go(data, 'submit') },
		cancel(data) { go(data, 'cancel') }
	};
};