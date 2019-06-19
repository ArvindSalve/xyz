export default _xyz => layer => {
    
  if(!layer.display) layer.show();
    
  layer.view.header.classList.add('edited');
  _xyz.mapview.node.style.cursor = 'crosshair';

  layer.edit.vertices = _xyz.mapview.lib.featureGroup().addTo(_xyz.map);
  layer.edit.trail = _xyz.mapview.lib.featureGroup().addTo(_xyz.map);
  layer.edit.path = _xyz.mapview.lib.featureGroup().addTo(_xyz.map);

  _xyz.map.on('click', e => {

    // Add vertice from click.
    layer.edit.vertices.addLayer(_xyz.mapview.lib.circleMarker(e.latlng, _xyz.style.defaults.vertex));
      
    // Return trail on mousemove with first vertice.
    if (layer.edit.vertices.getLayers().length === 1) return _xyz.map.on('mousemove', e => {

      layer.edit.trail.clearLayers();
    
      let coords = [];
            
      layer.edit.vertices.eachLayer(layer => {
        coords.push([layer.getLatLng().lat, layer.getLatLng().lng]);
      });

      coords.push([e.latlng.lat, e.latlng.lng]);
      
      layer.edit.trail.addLayer(
        _xyz.mapview.lib.polyline(coords, _xyz.style.defaults.trail)
      );
      
    });

    if (layer.edit.vertices.getLayers().length < 2) return;

    // Create path linestring with 2 or more vertices.

    layer.edit.path.clearLayers();

    let coords = [];
      
    layer.edit.vertices.eachLayer(layer => {
      coords.push([layer.getLatLng().lat, layer.getLatLng().lng]);
    });

    layer.edit.path.addLayer(
      _xyz.mapview.lib.polyline(coords, _xyz.style.defaults.path_line)
    );

    // Use right click context menu to upload polygon.
    _xyz.map.on('contextmenu', () => {
                
      let
        center = layer.edit.vertices.getLayers()[Math.ceil(layer.edit.vertices.getLayers().length/2)].getLatLng(),
        marker = [center.lng, center.lat];
          
      const xhr = new XMLHttpRequest();

      xhr.open(
        'POST', 
        _xyz.host + 
        '/api/location/edit/draw?' +
        _xyz.utils.paramString({
          locale: _xyz.workspace.locale.key,
          layer: layer.key,
          table: layer.table,
          token: _xyz.token
        }));

      xhr.setRequestHeader('Content-Type', 'application/json');
        
      xhr.onload = e => {
    
        if (e.target.status !== 200) return;
                  
        layer.loaded = false;
        layer.get();
                  
        // Select polygon when post request returned 200.
        _xyz.locations.select({
          layer: layer.key,
          table: layer.table,
          id: e.target.response,
          marker: marker,
          edit: layer.edit
        });
    
      };
          
      // Send path geometry to endpoint.
      xhr.send(JSON.stringify({
        geometry: layer.edit.path.toGeoJSON().features[0].geometry
      }));
    
      _xyz.mapview.state.finish();
    
    }); 

  });

};