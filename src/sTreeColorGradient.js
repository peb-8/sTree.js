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

class sTreeColorGradient {
// desc: gradient between two colors using a factor to mix between the both

	constructor(color1, color2) {
	// param color1: first color (factor = 0)
	// param color2: second color (factor = 1)
		this.color1 = st_hex_to_rgb(color1);
		this.color2 = st_hex_to_rgb(color2);
	}

	get(factor) {
	// desc: get a RGB color corresponding to the given factor parameter
	// param factor: factor to pick a color into the gradient
		return st_rgb_to_hex(
			this.color1.r + (this.color2.r - this.color1.r)*factor,
			this.color1.g + (this.color2.g - this.color1.g)*factor,
			this.color1.b + (this.color2.b - this.color1.b)*factor
		);
	}
}