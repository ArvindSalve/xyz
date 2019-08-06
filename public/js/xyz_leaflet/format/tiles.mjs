export default _xyz => layer => () => {

  if (!layer.display) return;//layer.remove();


  if (layer.L) return;

  // Augment request with token if proxied through backend.
  // Otherwise requests will be sent directly to the URI and may not pass through the XYZ backend.  
  const uri = layer.URI.indexOf('provider') > 0 ?
    _xyz.host + '/proxy/request?' + _xyz.utils.paramString({
      uri: layer.URI,
      token: _xyz.token
    }) :
    layer.URI;

    
  layer.L = L.tileLayer(decodeURIComponent(uri),
    {
      updateWhenIdle: true,
      pane: layer.key
    })
    .on('load', () => {

      if (layer.view.loader) layer.view.loader.style.display = 'none';

    })
    .addTo(_xyz.map);

  _xyz.map.addLayer(layer.L);

};