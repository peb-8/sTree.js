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

class sTreeCamera {
// desc: simple 2D camera that allows the user to move the main view

	constructor(app) {
	// param app: pixie application
		this.deltaX = 0;
		this.deltaY = 0;

		this.helper = new PIXI.Graphics();

		this.helper.lineStyle(0);
		this.helper.beginFill(0x000000, 0.25);
		this.helper.drawCircle(0, 0, 30);
		this.helper.endFill();
		this.helper.position.set(0, 0);
		this.helper.visible = false;

		this.viewport = new PIXI.Container();

		document.addEventListener('mousemove',  (event)=> { this._on_mouse_move(event) });
		document.addEventListener('mouseup',    (event)=> { this._on_mouse_up(event) });
		document.addEventListener('mousedown',  (event)=> { this._on_mouse_down(event) });

		this.drag_and_drop = false;

		app.stage.addChild(this.viewport);
		app.stage.addChild(this.helper);
	}

	_on_mouse_move(event) {
	// private method
			if( this.drag_and_drop ) {
				this.viewport.position.x = event.clientX + this.deltaX;
				this.viewport.position.y = event.clientY + this.deltaY;
				this.helper.position.x = event.clientX;
				this.helper.position.y = event.clientY;
			}
	}

	_on_mouse_down(event) {
	// private method
		this.drag_and_drop = true;
		this.helper.visible = true;
		this.helper.position.x = event.clientX;
			this.helper.position.y = event.clientY;
		this.deltaX = this.viewport.position.x - event.clientX;
		this.deltaY = this.viewport.position.y - event.clientY;
	}
	
	_on_mouse_up(event) {
	// private method
		this.drag_and_drop = false;
		this.helper.visible = false;
	}
}