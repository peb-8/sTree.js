# sTree.js | Simple Tree JS

### Requirements

* pixi.js

### Example use:

```javascript
// let's create a pixi application
let app = new PIXI.Application(window.innerWidth, window.innerHeight, { transparent: true });

// add the node to the DOM
document.body.appendChild(app.view);

// create a camera to allow user to move the scene
camera = new sTreeCamera(app);

// our server API url
API_URL = '<API_URL>';

// customize each type of nodes
function on_creation(node) {

  if( node.type == 'species' )
    node.color = 0xFF0000;
    
   else if( node.type == 'race' )
    node.color = 0x00FFFF;
    
   else if( node.type == 'individual' )
    node.color = 0xFF00FF;
}

// create branches and configure children nodes according to specific data for each type of node
function on_grow(node) {
  
  if( node.type == 'species')
    st_get_data(API_URL + ..., (data)=> { node.create_branche(...); });
    
  else if( node.type == 'race' )
    st_get_data(API_URL + ..., (data)=> { node.create_branche(...); });
    
  else if( node.type == 'individual' )
    st_get_data(API_URL + ..., (data)=> { node.create_branche(...); });
}

// create the root node (the branches will be created automatically on node triggering)
root = new sTreeNode(camera.viewport, on_creation, on_grow, 'species', 0, [], 'Animal species');

```

### Screenshots:

Titles and versions have been blurred for privacy reason.
![Image of sample](https://image.ibb.co/ePmHLp/scr1.png)

### Todo:

* Simplifiy & explain the way to create branches from data
* Make a bundle of the lib and provide a minified version
* Add samples (using a fake API to import data) and screenshots of results
* Get rid of pixi.js (implement custom rendering process using Canvas and 2D-transformations)
