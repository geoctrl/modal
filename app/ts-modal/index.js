
import { resolve } from './_utils';
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
			
			// elements
			body = angular.element($document[0].body),
			containerEl = angular.element(`<div class="modal-container"></div>`),
			backdropEl = angular.element(`<div class="modal-backdrop"></div>`),
			modal = angular.element(`<div class="modal"></div>`);

	/**
	 * initialize
	 * no modals present, build structure
	 */
	function init() {
		containerEl.append(angular.copy(backdropEl));
		body.append(angular.copy(containerEl));
	}

	/**
	 * destroy
	 * done with modals, clean up
	 */
	function destroy() {
		
	}
	
	function buildModal(data) {
		console.log(data);
	}


	return {
		open(opts) {

			// create new modal
			let newModal = new modalClass(opts, $injector);

			// init if there's no elements
			if (!modalArray.length) init();

			if (opts.resolve) {
				resolve($q, opts.resolve).then(
						res => {
							modalArray.push(buildModal(res));
						}
				);
			} else {
				modalArray.push(buildModal());
			}

		}
	};
});