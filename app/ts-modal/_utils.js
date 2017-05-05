import defaultOptions from './_default-options';
export const label =  `[tsModalService]`;

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

export function dashCase(str) {
	return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase()});
}


/**
 * validate options
 * also cleans it up
 * @param options
 * @param $injector
 */
export function cleanValidateOptions(options, $injector) {

	// check if options is an object and if it has a directive property
	if (typeof options !== 'object' || !options.directive) {
		throw `${label} directive property is required`;

		// check if directive is a string
	} else if (typeof options.directive !== 'string') {
		throw `${label} directive must be a string`;

		// check if directive is available in ng module
	} else if (!$injector.has(options.directive + 'Directive')) {
		throw `${label} ${options.directive} is not a valid directive`;
	}

	// assign
	options = Object.assign({}, defaultOptions, options);

	// size
	// force medium default when an unknown value is supplied
	if (options.size != 'small' && options.size != 'medium' && options.size != 'large') {
		console.warn(`[Modal Warning] ${options.size ? options.size : 'Unknown'} is not a valid size - defaulting to "medium" (small|medium|large)`);
		options.size = 'medium';
	}

	// display
	// force 'notification' default when an unknown display is supplied
	if (options.display != 'component' & options.display != 'notification') {
		console.warn(`${label} ${options.display ? options.display : 'Unknown'} is not a valid display type - defaulting to "notification" (component|notification)`);
		options.display = 'scroll';
	}

	return options;
}


/**
 * Resolve stuff
 * wraps a promise around any type of thing
 * and won't return until all promises resolve
 * @param $q
 * @param obj
 * @returns {Promise}
 */
export function resolveUtil($q, obj) {
	let promises = [];
	let names = [];

	// wrap stuff in promises
	for (let r in obj) {
		names.push(r);
		promises.push($q(resolve => {
			if (typeof obj[r] === 'function') {
				resolve(obj[r]());
			} else {
				resolve(obj[r]);
			}
		}));
	}

	// send back promise where data is the object unwrapped
	return $q.all(promises).then(
			res => {
				let o = {};
				for (let i=0; i < res.length; i++) {
					o[names[i]] = res[i];
				}
				return o;
			}
	);
}


/**
 * get scroll bar width
 * @returns {number}
 */
export function getScrollbarWidth(body) {
	var outer = document.createElement("div");
	outer.style.visibility = "hidden";
	outer.style.width = "100%";
	document.body.appendChild(outer);

	var widthNoScroll = outer.offsetWidth;
	outer.style.overflow = "scroll";

	var inner = document.createElement("div");
	inner.style.width = "100%";
	outer.appendChild(inner);

	var widthWithScroll = inner.offsetWidth;
	outer.parentNode.removeChild(outer);
	return body[0].scrollWidth == body[0].clientWidth ? 0 : widthNoScroll - widthWithScroll;
}