/***********************************************************************************************************************************************************

	Copyright © 2018, stree.js - Simple Three JS library
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

class sTreeNode {
// desc: represents a node in a simple tree diagram

	constructor(parent, on_init, on_branches_creation, type, id, versions = [], name = '', x = 0, y = 0, color = 0xFF0000) {
	// param parent: parent graphic context
	// param on_init: callback receiving this to allow node customization on creation
	// param on_branches_creation: callback receiving this to allow branches generation with specific data
	// param type: type of node (important to define behavior during branches creation)
	// param id: identifier of the node
	// param versions: versions of the node
	// param name: name of the node
	// param x: horizontal coordinate of the node
	// param y: vertical coordinate of the node
	// param color: color of the node and the begining of the attached branches

		// attributes
		this.color = color;
		this.on_init = on_init;
		this.on_branches_creation = on_branches_creation;
		this.name = st_wrap_words(name);
		this.versions = versions;
		this.version = 'v' + versions[0]; 
		this.x = x;
		this.y = y;
		this.type = type;
		this.id = id;
		this.letter = type[0].toUpperCase();
		this._init();
		on_init(this);

		// items creation
		this.outside = new PIXI.Graphics();
		this.inside = new PIXI.Graphics();
		this.name_text = new PIXI.Text(this.name, { fontFamily : 'Arial', fontSize: this.font_size });
		if( versions.length > 0 ) 
			this.version_text = new PIXI.Text(this.version, { fontFamily : 'Arial', fontSize: this.font_size, fill : this.color });
		this.text_line = new PIXI.Graphics().lineStyle(this.thickness, this.color).moveTo(x + this.radius, y).lineTo(x + this.radius + 5 + this.name_text.width + 2, y);
		this.label = new PIXI.Text(this.letter, { fontFamily : 'Arial', fontSize: this.font_size });
		this.label.position.set(x - this.label.width/2, y - this.label.height/2);
		
		// item configuration
		this.name_text.x = x + this.radius + 5;
		this.name_text.y = y - this.name_text.height - 2;
		if( versions.length > 0 )
			this.version_text.position.set(this.x + this.radius + 15, this.y + 7 - this.version_text.height/2);
		this.outside.interactive = true;
		st_draw_circle(this.inside, x, y, this.radius/2, this.color);

		// start on close position
		this._update(0, this.radius);

		// attach callbacks to events
		this.outside.on('mousedown', (eventData)=> { });
		this.outside.on('mouseup',   (eventData)=> { this.trigger(); });
		this.outside.on('mouseover', (eventData)=> { this.selected = true; this._start_pulse(); });
		this.outside.on('mouseout',  (eventData)=> { this.selected = false; });
		if( versions.length > 0 )
			document.addEventListener('mousewheel', (event)=> {
				if( this.triggered & this.selected & !this.in_transition )
					this._set_version(event.deltaY);
			});

		// attach items to the node
		parent.addChild(this.graphics);
		this.graphics.addChild(this.text_line);
		this.graphics.addChild(this.outside);
		this.graphics.addChild(this.inside);
		this.graphics.addChild(this.name_text);
		if( versions.length > 0 )
			this.graphics.addChild(this.version_text);
		this.graphics.addChild(this.label);
	}

	_init() {
	// private method
		this.graphics = new PIXI.Graphics();
		this.radius = 20;
		this.triggered = false;
		this.in_transition = false;
		this.scale_factor = .5;
		this.selected = false;
		this.current_version = 0;
		this.pulse_ratio = 0;
		this.branches = [];
		this.parent_node = null;
		this.font_size = 10;
		this.thickness = 2;
	}

	_get_branch_ctrl_points(k, total) {
	// private method
		let radius = 20;
		let dist = 200;
		let space = 20;
		let shiftY = (space + 2*radius)*(k - (total - 1)/2);
		let shiftX = this.radius + this.name_text.width + 15;

		return [[shiftX, 0], [dist/2 + shiftX, 0], [dist/2 + shiftX, shiftY], [dist + shiftX, shiftY]];

	}

	_attach_branch(branch) {
	// private method
		this.branches.push(branch);
		branch.node.parent_node = this;
	}

	_detach_branch(branch) {
	// private method
		branch.destroy();
	}

	_clear_branches() {
	// private method
		for( let branch of this.branches )
			this._detach_branch(branch);
		this.branches = [];
	}

	_create_branche(url, id, k, number, type, versions) {
	// private method
		st_get_data(api_root + url, (data)=> {
			this._attach_branch(new sTreeBranch(this, data.nom, type, id, versions, this.color, this._get_branch_ctrl_points(k, number)));
		});
	}

	_create_branches() {
	// private method
		this._clear_branches();
		this.on_branches_creation(this);
	}

	_start_pulse() {
	// private method
		if( (!this.in_transition & this.selected & this.triggered) ) {
			window.setTimeout(()=> {
				this.pulse_ratio+=(1/50);
				if( this.pulse_ratio == 1.0 )
					this.pulse_ratio = 0;
				let w = st_sin_interpolation(this.radius, this.pulse_ratio);
				this.inside.clear();
				st_draw_circle(this.inside, this.x, this.y, this.radius/2 - w/8, this.color);
				this._start_pulse();
			}, 50);
		}
	}

	_set_version(step) {
	// private method
		if( this.versions.length > 1 ) {
			if( step >= 0 )
				this.current_version++;
			else this.current_version--;
			if( this.current_version == -1 )
				this.current_version = this.versions.length - 1;
			if( this.current_version == this.versions.length )
				this.current_version = 0;
			if( this.versions.length > 0 ) { 
				this.version_text.text = 'v' + this.versions[this.current_version];
				this.text_line.clear();
				this._create_branches();
				this.text_line.lineStyle(this.thickness, this.color).moveTo(this.x + this.radius - 15, this.y).lineTo(this.x + this.radius + 5 + 10 + this.name_text.width + 2, this.y);
			}
		}
	}

	_update(ratio, radius) {
	// private method
		this.outside.clear();
		this.inside.alpha = ratio;
		this.name_text.x = this.x + radius + 5;
		this.text_line.clear();
		this.text_line.lineStyle(this.thickness, this.color).moveTo(this.x + radius - 15, this.y).lineTo(this.x + radius + 5 + this.name_text.width + 2, this.y);
		if( this.versions.length > 0 )
			this.version_text.alpha = ratio;
		st_draw_circle(this.outside, this.x, this.y, radius, 0xFFFFFF, this.color, this.thickness);
	}

	trigger() {
	// desc: trigger the node (switch between closed and open state)
		// if the node is not locked
		if( !this.in_transition ) {
			this.triggered = !this.triggered;
			this.in_transition = true;
			// click on the closed node
			if( this.triggered ) {
				//launch a time trigger
				this.timer = new sTreeTimeTrigger(250, 25, (ratio)=> {
					// when time is over, unlock the node
					if( ratio == 1 ) {
						this.in_transition = false;
						// if the node is still selected we apply on it a pulsating effect
						if( this.selected )
							this._start_pulse();
						// if there are no branches we create them
						if( this.branches.length == 0 )
							this._create_branches();
						// disabling the sibling nodes
						if( this.parent_node )
							for( let branch of this.parent_node.branches )
								if( branch.node != this )
									branch.node.close();
						// let the branches growing
						for( let branch of this.branches )
							branch.grow();
					}
					// application of time effects
					this._update(ratio, st_linear_interpolation(this.radius, this.scale_factor, 1 - ratio));
				});
			// click on the open node
			} else {
				// cut the branches
				for( let branch of this.branches )
					branch.cut();
				// start a timer
				this.timer = new sTreeTimeTrigger(500, 50, (ratio)=> {
					// when time is over unlock the node
					if( ratio == 1 ) { this.in_transition = false; };
					// application of time effects
					this._update(1 - ratio, st_linear_interpolation(this.radius, this.scale_factor, ratio));
				});
			}
		}
	}

	close() {
	// desc: close the node
		if( this.triggered )
			this.trigger();
	}

	enable() {
	// desc: enable node interaction
		this.outside.interactive = true;
	}

	disable() {
	// desc: disable node interaction
		this.outside.interactive = true;
	}

	destroy() {
	// desc: destroy the node
		this.graphics.destroy();
	}
}