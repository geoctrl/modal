import _opts from './utils/default-options';
import Modal from './utils/modal-class';
import CONST from './utils/constants';

// set the default options
let defaultOptions = Object.assign({}, _opts);

/**
 * Class for handling all modals
 */
export class ModalService {
	/**
	 * create service
	 * @param opts
	 */
	constructor(opts={}) {
		this._options = defaultOptions = Object.assign(defaultOptions, opts);
		this._modals = [];
		this.body = document.body;
		this.init();
	};
	
	init() {
		// modal-backdrop
		this.modalBackdropEl = document.createElement('div');
		this.modalBackdropEl.classList.add(CONST.MODAL_BACKDROP);

		// modal-contain
		this.modalContainEl = document.createElement('div');
		this.modalContainEl.classList.add(CONST.MODAL_CONTAIN);

		// modal
		this.modalEl = document.createElement('div');
		this.modalEl.classList.add(CONST.MODAL);

		// append
		this.body.appendChild(this.modalBackdropEl);
		this.modalContainEl.appendChild(this.modalEl);
		this.body.appendChild(this.modalContainEl);

		// apply option classes
		this.modalEl.classList.add(CONST.size[this._options.size]);
		this.modalContainEl.classList.add(CONST.display[this._options.display]);
	}
	
	destroy() {
		
	}

	/**
	 * create and open a new modal
	 * @param opts
	 * @returns {*} ModalClass
	 */
	open(opts) {
		let newModal = new Modal(Object.assign(defaultOptions, opts));
		this._modals.push(newModal);
		return newModal;
	}

	/**
	 * close the most recent modal
	 */
	close() {
		this._modals[this._modals.length-1].close();
	}
}