export default _xyz => layer => {
    
  if(!layer.display) layer.show();
    
  layer.view.header.classList.add('edited');
  _xyz.mapview.node.style.cursor = 'crosshair';
    
  layer.edit.vertices = _xyz.mapview.lib.featureGroup().addTo(_xyz.map);
  layer.edit.trail = _xyz.mapview.lib.featureGroup().addTo(_xyz.map);
  layer.edit.path = _xyz.mapview.lib.featureGroup().addTo(_xyz.map);

  // Define origin outside click event.
  let origin_lnglat;
    
  _xyz.map.on('click', e => {
       
    // First point is origin.
    if(!origin_lnglat){

      // Define rectangle origin.
      origin_lnglat = [e.latlng.lng, e.latlng.lat];

      // Add circle marker to vertices layer.       
      layer.edit.vertices.addLayer(
        _xyz.mapview.lib.circleMarker(e.latlng, _xyz.style.defaults.vertex)
      );

      // Set mousemove event to show trail.
      _xyz.map.on('mousemove', e => {
        
        // Remove trail layer on mouse move.
        layer.edit.trail.clearLayers();

        layer.edit.trail.addLayer(
          _xyz.mapview.lib.rectangle(
            [[origin_lnglat[1], origin_lnglat[0]], [e.latlng.lat, e.latlng.lng]],
            _xyz.style.defaults.trail
          )
        );
      });

      return;
    }

    // Get marker for selection.
    const centre = layer.edit.trail.getBounds().getCenter();
    const marker = [centre.lng.toFixed(5), centre.lat.toFixed(5)];
                                        
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

      layer.get();
                
      if (e.target.status !== 200) return;
                   
      _xyz.locations.select({
        layer: layer.key,
        table: layer.table,
        id: e.target.response,
        marker: marker,
        edit: layer.edit
      });

    };
    
    // Send rectangle geometry to endpoint.
    xhr.send(JSON.stringify({
      geometry: layer.edit.trail.toGeoJSON().features[0].geometry
    }));

    _xyz.mapview.state.finish();

  });

};