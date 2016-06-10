/**
 * create guid
 * @returns {*} guid
 */
export function guid() {
	return ((typeof(window.crypto) != 'undefined'
			&& typeof(window.crypto.getRandomValues) != 'undefined')
					? function() { // If we have a cryptographically secure PRNG
				var buf = new Uint16Array(8);
				window.crypto.getRandomValues(buf);
				var S4 = function(num) {
					var ret = num.toString(16);
					while(ret.length < 4){ ret = "0"+ret; }
					return ret;
				};
				return (S4(buf[0])+S4(buf[1])+"-"
				+S4(buf[2])+"-"+S4(buf[3])+"-"
				+S4(buf[4])+"-"+S4(buf[5])+S4(buf[6])+S4(buf[7]));
			}
					: function() { // Otherwise, just use Math.random
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
						.replace(
								/[xy]/g,
								function(c) {
									var r = Math.random()*16|0,
											v = c == 'x' ? r : (r&0x3|0x8);
									return v.toString(16);
								}
						); // replace
			}
	)();
}


/**
 * validate options
 * also cleans it up
 * @param options
 */
export function validateOptions(options) {
	// template or templateUrl is required
	if (!options.template && !options.templateUrl) {
		throw `[Modal Error] Component requires param "template" or "templateUrl"`;
	}

	// if both template and templateUrl are present, give warning that 'template' will be used
	if (options.templateUrl && options.template) {
		delete params.templateUrl;
		console.warn(`[Modal Warning] Using "template" as default when both "template" and "templateUrl" params are supplied`);
	}

	// force medium default when an unknown value is supplied
	if (options.size != 'small' && options.size != 'medium' && options.size != 'large') {
		console.warn(`[Modal Warning] ${options.size ? options.size : 'Unknown'} is not a valid size - defaulting to "medium" (small|medium|large)`);
		options.size = 'medium';
	}
	// force 'scroll' default when an unknown display is supplied
	if (options.display != 'scroll' & options.display != 'center') {
		console.warn(`[Modal Warning] ${options.display ? options.display : 'Unknown'} is not a valid display type - defaulting to "scroll" (scroll|center)`);
		options.display = 'scroll';
	}

	return options;
}