import { guid, validateParams, validateOptions } from './utils';

/**
 * Class representing a Modal
 * used by the Modal service
 */
export default class {
	/**
	 * create modal
	 * @param params
	 * @param opts
	 */
	constructor(params={}, opts={}) {
		this._params = params;
		this._options = Object.assign(opts, {
			id: guid()
		});

		// make sure all params and options are in order
		validateParams(this._params);
		validateOptions(this._options);

		this.open();
	}

	open() {
		console.log(this._params.template);
	}

	close() {

	}

	getOptions() {
		return this._options;
	}
}