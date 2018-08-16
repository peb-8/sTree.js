/***********************************************************************************************************************************************************

	Copyright © 2018, stree.js / Simple Three JS library
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”),
	to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
	and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability,
	fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other
	liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings
	in the Software.

	Except as contained in this notice, the name of the stree.js and Simple Three JS library shall not be used in advertising or otherwise to promote the sale, use or
	other dealings in this Software without prior written authorization from the stree.js and Simple Three JS library.

***********************************************************************************************************************************************************/

class sTreeTimeTrigger {
// desc: time trigger

	constructor(total_time, step_time, cb) {
	// param total_time: total time
	// param step_time: step time
	// param cb: callback function (with completion percent in parameter)
		this.step_time = step_time;
		this.cb = cb;
		this.variation = new sTreeVariation(parseInt(total_time/step_time, 10));
		this._next();
	}

	_next() {
	// private method
		window.setTimeout(()=> {
			let ratio = this.variation.next();
			if( ratio < 1 )
				this._next();
			this.cb(ratio);
		}, this.step_time);
	}
}