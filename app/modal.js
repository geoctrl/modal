import _opts from './utils/default-options';
import Modal from './utils/modal-class';
import CONST from './utils/constants';
import { containEl, modalBackdrop, modalEl } from './utils/templates';

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
		this.init();
	};
	
	init() {
		
	}
	
	destroy() {
		
	}

	/**
	 * create and open a new modal
	 * @param params
	 * @param opts
	 * @returns {*} ModalClass
	 */
	open(params, opts) {
		let newModal = new Modal(params, Object.assign(defaultOptions, opts));
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