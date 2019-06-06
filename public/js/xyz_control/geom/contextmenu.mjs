import explode from '@turf/explode';
import combine from '@turf/combine';

export default _xyz => (e, layer) => {

	if(!layer.edit || !layer.edit.polygon) return;

	closeContextMenu();

	_xyz.mapview.contextmenu = _xyz.utils.createElement({
		tag: 'div',
		options: {
			classList: 'contextmenu'
		},
        style: {
          left: `${e.layerPoint.x}px`,
          top: `${e.layerPoint.y}px`
        },
        appendTo: _xyz.mapview.node
      });

    let ul = _xyz.utils.createElement({
        tag: 'ul',
        appendTo: _xyz.mapview.contextmenu
      });

    _xyz.utils.createElement({
        tag: 'li',
        options: {
          textContent: 'Edit me'
        },
        appendTo: ul,
        eventListener: {
        	event: 'click',
        	funct: () => {
        		const xhr = new XMLHttpRequest();

        		xhr.open('GET', 
        			_xyz.host + '/api/location/select/id?' + // this returns infoj which is not needed
        			_xyz.utils.paramString({
        				locale: _xyz.workspace.locale.key,
        				layer: layer.key,
        				table: layer.table,
        				id: e.layer.properties.id,
        				token: _xyz.token
        			}));

        		xhr.setRequestHeader('Content-Type', 'application/json');
        		xhr.responseType = 'json';

        		xhr.onload = _e => {

        			if (_e.target.status !== 200) return;

        			_xyz.mapview.node.style.cursor = 'crosshair';

        			_xyz.mapview.state = 'edit';
        			_xyz.map.doubleClickZoom.disable();

        			let geojson = _e.target.response.geomj;

        			layer.edit.vertices = _xyz.L.featureGroup().addTo(_xyz.map);
        			layer.edit.trail = _xyz.L.featureGroup().addTo(_xyz.map);
        			layer.edit.path = _xyz.L.featureGroup().addTo(_xyz.map);

        			let points = explode(geojson).features;

        			console.log(points.length);
        			console.log(layer.edit.vertices.getLayers().length);

        			// create feature group from feature
        			points.map(point => {
        				if(points.indexOf(point) === points.length-1) return;
        				let latlng = {
        					lat: point.geometry.coordinates[1],
        					lng: point.geometry.coordinates[0]
        				}
        				layer.edit.vertices.addLayer( // enable dragging vertex
        					attachEvents(_xyz.L.circleMarker(latlng, _xyz.style.defaults.vertex))
        				);
        			});

        			_xyz.map.on('dblclick', map_ev => { // enable adding new vertex
        			    map_ev.originalEvent.stopPropagation();
        			    map_ev.originalEvent.preventDefault();
        			    console.log('new vertex');
        			    
        			    layer.edit.vertices.addLayer(
        			    	attachEvents(_xyz.L.circleMarker(map_ev.latlng, _xyz.style.defaults.vertex))
        			    );
        			});


        			_xyz.map.once('contextmenu', ev => { // rememeber put back last point
        				_xyz.mapview.state = 'select';
        				console.log('save or cancel');

        				closeContextMenu();

        				_xyz.mapview.contextmenu = _xyz.utils.createElement({
        					tag: 'div',
        					options: {
        						classList: 'contextmenu'
        					},
        					style: {
        						left: `${ev.layerPoint.x}px`,
        						top: `${ev.layerPoint.y}px`
        					},
        					appendTo: _xyz.mapview.node
        				});

        				let ul = _xyz.utils.createElement({
        					tag: 'ul',
        					appendTo: _xyz.mapview.contextmenu
        				});

        				_xyz.utils.createElement({
        					tag: 'li',
        					options: {
        						textContent: 'Save me'
        					},
        					appendTo: ul,
        					eventListener: {
        						event: 'click',
        						funct: ev => {
        							ev.stopPropagation();
        							console.log('Now save me');
        							closeContextMenu();
        						}
        					}
        				});

        				_xyz.utils.createElement({
        					tag: 'li',
        					options: {
        						textContent: 'Cancel me'
        					},
        					appendTo: ul,
        					eventListener: {
        						event: 'click',
        						funct: ev => {
        							ev.stopPropagation();
        							console.log('Cancel all');
        							closeContextMenu();
        							layer.edit.vertices.clearLayers();
        							layer.edit.trail.clearLayers();
        							layer.edit.path.clearLayers();
        						}
        					}
        				});
        			});
        		}

        		xhr.send();
        	}
        }
    });

    _xyz.utils.createElement({
        tag: 'li',
        options: {
          textContent: 'Area'
        },
        appendTo: ul
      });

    _xyz.utils.createElement({
        tag: 'li',
        options: {
          textContent: 'Perimeter'
        },
        appendTo: ul
      });

    _xyz.map.once('click', e => closeContextMenu());

    function attachEvents(vertex){
    	vertex
    	.on('mousedown', ev => {
    		_xyz.map.dragging.disable();
    		ev.originalEvent.stopPropagation();

    		_xyz.map.on('mousemove', _ev => {
    			_ev.originalEvent.stopPropagation();
    			_ev.originalEvent.preventDefault();
    			vertex.setLatLng(_ev.latlng);

    			_xyz.map.once('mouseup', __ev => {
    				__ev.originalEvent.stopPropagation();
    				__ev.originalEvent.preventDefault();
    				vertex.setLatLng(__ev.latlng);
    				_xyz.map.off('mousemove');
    				_xyz.map.dragging.enable();
    			});
    		});

    	})
    	.on('mouseover', ev => {
    		_xyz.mapview.node.style.cursor = 'crosshair';
    	})
    	.once('dblclick', ev => {
    		_xyz.L.DomEvent.stopPropagation(ev);
    		layer.edit.vertices.removeLayer(vertex);
    	});
    	return vertex;
    }

    function closeContextMenu(){ // close context menu if open
    	_xyz.mapview.node.style.cursor = '';
    	_xyz.map.doubleClickZoom.enable();
    	_xyz.mapview.state = 'select';
    	if(_xyz.mapview.contextmenu) {
    		_xyz.mapview.contextmenu.remove();
    		_xyz.mapview.contextmenu = null;
    	}
    }
}