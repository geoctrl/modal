import { guid, validateOptions } from './utils';

/**
 * Class representing a Modal
 * used by the Modal service
 */
export default class {
	/**
	 * create modal
	 * @param opts
	 */
	constructor(opts={}) {
		this._options = Object.assign(opts, {
			id: guid()
		});

		// make sure all params and options are in order
		validateOptions(this._options);

		this.open();
	}

	open() {
		console.log(this._options.template);
	}

	close() {

	}

	getOptions() {
		return this._options;
	}
}