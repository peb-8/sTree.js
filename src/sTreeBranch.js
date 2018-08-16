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

class sTreeBranch {
// desc: represents a branch in a simple tree diagram

	constructor(parent_node, node_name, node_type, node_id, node_versions, node_color, control_points) {
	// param parent_node: parent node where the branche should start growing
	// param node_name: name of the child node to create at the end of branche
	// param node_type: type of the child node to create at the end of branche
	// param node_id: identifier of the child node to create at the end of branche
	// param node_versions: versions of the child node to create at the end of branche
	// param node_color: color of the child node to create at the end of branche
	// param control_points: bezier control points of the branche curve

		this.x = parent_node.x;
		this.y = parent_node.y;
		this.parent = parent_node.inside;
		this.graphics = new PIXI.Graphics();
		this.points = st_bezier_curve(20, control_points);
		this.ratio = 0;
		this.node = new sTreeNode(this.graphics, parent_node.on_init, parent_node.on_branches_creation, node_type, node_id, node_versions, node_name, this.points[this.points.length - 1][0] + this.x, this.points[this.points.length - 1][1] + this.y, 0xFF0000);
		this.gradient = new sTreeColorGradient(node_color, this.node.color);
		this.parent.addChild(this.graphics);
		this.grow();
	}

	destroy() {
	// desc: destroy the branch (recursively)
		this.node.destroy();
		this.parent.removeChild(this.graphics);
	}

	_update() {
	// private method
		this.graphics.clear().lineStyle(2, this.gradient.get(0)).moveTo(this.points[0][0] + this.x, this.points[0][1] + this.y);
		for( let k = 1; k < this.points.length*this.ratio; k++ )
			this.graphics.lineStyle(2, this.gradient.get(k/(this.points.length - 1))).lineTo(this.points[k][0] + this.x, this.points[k][1] + this.y);
	}

	grow() {
	// desc: let the branch growing
		this.cut(); // avant de faire pousser un arbre on le coupe x_x
		this.timer = new sTreeTimeTrigger(500, 25, (ratio)=> {
			if( ratio >= 1.0 ) { 
				this.node.graphics.visible = true;
				this.node.enable();
				for( let sub of this.node.branches ) // animate sub branches
					sub.grow();
			}
			this.node.graphics.alpha = ratio;
			this.ratio = ratio;
			this._update();
		});
	}

	cut() {
	// desc: cut the branche (recursively)
		this.node.graphics.visible = false;
		this.graphics.clear();
		for( let branch of this.node.branches )
			branch.cut();
	}
}