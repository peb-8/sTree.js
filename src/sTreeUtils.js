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

function st_linear_interpolation(start, factor, ratio) {
// desc: compute and return the linear interpolation of a given value, depending on a given factor and ratio
// param start: value to interpolate (number)
// param factor: factor by which to multiply the result (number)
// param ratio: percentage of completion (number)
	return start*(1 + factor*(1 - ratio));
}

function st_sin_interpolation(start, ratio) {
// desc: compute and return the sinusoidal interpolation of a given value, depending on a given factor
// param start: value to interpolate (number)
// param ratio: percentage of completion (number)
	return start*Math.sin(2*Math.PI*ratio);
}

function st_factorial(num) {
// desc: compute and return the factorial of the given number
// param num: number from which the factorial is computed
	var val = 1;
	for( var i = 2; i <= num; i++ ) {
		val*=i;
	}
	return val;
}

function st_binomial(i, n) {
// desc: compute and return the binomial factor from the given parameters
	return st_factorial(n)/(st_factorial(i)*st_factorial(n - i));
}

function st_bernstein(t, i, n) {
// desc: compute and return the berstein factor from the given parameters
	return st_binomial(i, n)*Math.pow(t, i)*Math.pow(1 - t, n - i);
}

function st_bezier(t, ctrls) {
// desc: compute and return the bezier point approximation from the given parameters
	var point = [0, 0];
	for( var i in ctrls ) {
		bern = st_bernstein(t, i, ctrls.length - 1);
		point[0]+=ctrls[i][0]*bern;
		point[1]+=ctrls[i][1]*bern;
	}
	return point;
}

function st_bezier_curve(n, ctrls) {
// desc: compute and return the Bezier curve points from the given parameters
// param n: number of points to compute
// param ctrls: control points of the Bezier curve
	var points = [];
	for( var i = 0; i < n; i++ ) {
		t = i/(n - 1);
		points.push(st_bezier(t, ctrls));
	}
	return points;
}

function st_rgb_to_hex(r, g, b) {
// desc: return an hexadecimal expression from a RGB color defined by the given parameters
// param r: red componant of the RGB color
// param g: green componant of the RGB color
// param b: blue componant of the RGB color
    return parseInt("0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
}

function st_hex_to_rgb(hex) {
// desc: return the RGB color from an hexadecimal color expression given in parameter
// param hex: hexadecimal color expression
	var val = hex.toString(16);
	var comp = "";
	if( val == 0 )
		comp = "000000";
	else if( val.length == 2 )
		comp = "0000";
	else if( val.length == 4 )
		comp = "00";
	if( val == 0 )
		val = "";
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec("#" + comp + val);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function st_wrap_words(str, n = 3) {
// desc: wrap the str expression each n words
	let count = 0;
	let result = '';
	for( let k = 0; k < str.length; k++ )
		if( str.charAt(k) == ' ' ) {
			count++;
			if( count == n ) {
				result+='\n';
				count = 0;
				continue;
			} else result+=' ';
		} else result+=str.charAt(k);

	return result;
}

function st_get_data(url, cb) {
// desc: return the GET response data from the given url and passes it to the given callback function
    var req = new XMLHttpRequest();
    req.onreadystatechange = ()=> { 
        if( req.readyState == 4 && req.status == 200 )
        	cb(JSON.parse(req.responseText));
    }
    req.open("GET", url,  true);
    req.send(null);
}

function st_draw_circle(graphics, x = 0, y = 0, radius = 20, fill_color = 0xFFFFFF, outline_color = 0x000000, outline_thickness = 0) {
// desc: draw a circle into the context given as attribute
	graphics.lineStyle(outline_thickness, outline_color);
	graphics.beginFill(fill_color, 1);
	graphics.drawCircle(x, y, radius);
	graphics.endFill();
	graphics.position.set(0, 0);
}