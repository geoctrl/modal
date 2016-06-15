import { cleanValidateOptions, guid } from './_utils';

/**
 * Class representing a Modal
 * used by the Modal service
 */
export default class {
	/**
	 * create modal
	 * @param opts
	 * @param $injector
	 */
	constructor(opts={}, $injector) {
		// make sure all params and options are in order
		this._options = cleanValidateOptions(opts, $injector);
		this._id = guid();
	}
	
	setPromise(defer) {
		this._defer = defer;
	}

	getPromise() {
		return this._defer;
	}
}
