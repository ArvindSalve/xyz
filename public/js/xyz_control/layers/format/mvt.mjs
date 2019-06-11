export default _xyz => layer => () => {

  // Get table for the current zoom level.
  const table = layer.tableCurrent();

  // Return if layer should not be displayed.
  if (!layer.display) return ;//layer.remove();

  if (!table) {

    // Remove existing layer from map.
    if (layer.L) _xyz.map.removeLayer(layer.L);  

    return layer.loaded = false;
  }

  // Return from layer.get() if table is the same as layer table
  // AND the layer is already loaded.
  if (layer.table === table && layer.loaded) return;

  // Set table to layer.table.
  layer.table = table;

  // Create filter from legend and current filter.
  const filter = layer.filter && Object.assign({}, layer.filter.legend, layer.filter.current);

  let url = _xyz.host + '/api/layer/mvt/{z}/{x}/{y}?' + _xyz.utils.paramString({
    locale: _xyz.workspace.locale.key,
    layer: layer.key,
    table: layer.table,
    properties: layer.properties,
    filter: JSON.stringify(filter),
    token: _xyz.token
  });

  let options = {
    rendererFactory: _xyz.L.svg.tile,
    interactive: (layer.qID) || false,
    pane: layer.key,
    getFeatureId: f => f.properties.id,
    vectorTileLayerStyles: {}
  };

    // set style for each layer
  options.vectorTileLayerStyles[layer.key] = applyLayerStyle;

  // Create cat array for graduated theme.
  if (layer.style.theme && layer.style.theme.type === 'graduated') {
    layer.style.theme.cat_arr = Object.entries(layer.style.theme.cat).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  }

  // Remove layer.
  if (layer.L) _xyz.map.removeLayer(layer.L);

  layer.L = L.vectorGrid.protobuf(url, options)
    .on('error', err => console.error(err))
    .on('loading', () => {
      
      if (layer.view.loader) layer.view.loader.style.display = 'block';

    })
    .on('load', () => {
     
      if (layer.view.loader)  layer.view.loader.style.display = 'none';

      layer.loaded = true;

    })
    .on('click', e => {

      _xyz.geom.contextmenu.close();

      if(_xyz.mapview.state !== 'select') return;

      _xyz.locations.select({
        locale: _xyz.workspace.locale.key,
        layer: layer.key,
        table: layer.table,
        id: e.layer.properties.id,
        marker: [e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5)],
        edit: layer.edit
      });

    })
    .on('mouseover', e => {

      if(_xyz.mapview.state !== 'select') return;

      e.target.setFeatureStyle(e.layer.properties.id, layer.style.highlight);

      if (layer.hover.field) layer.hover.add({
        id: e.layer.properties.id,
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY,
      });

    })
    .on('mouseout', e => {
      e.target.setFeatureStyle(e.layer.properties.id, applyLayerStyle);

      if (layer.hover.field) layer.hover.remove();

    })
    .on('contextmenu', e => {

      _xyz.geom.polygon_edit(e, layer);

    })
    .addTo(_xyz.map);


  function applyLayerStyle(properties) {

    let style = Object.assign({}, layer.style.default);

    // Return default style if no theme is set on layer.
    if (!layer.style.theme) return style;

    const theme = layer.style.theme;

    // Categorized theme.
    if (theme.type === 'categorized') {

      return Object.assign({}, style, theme.cat[properties[theme.field]] || {});

    }

    // Graduated theme.
    if (theme.type === 'graduated') {

      theme.cat_arr = Object.entries(layer.style.theme.cat).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  

      theme.cat_style = {};

      // Iterate through cat array.
      for (let i = 0; i < theme.cat_arr.length; i++) {

        if (!properties[theme.field]) return style;

        // Break iteration is cat value is below current cat array value.
        if (parseFloat(properties[theme.field]) < parseFloat(theme.cat_arr[i][0])) break;

        // Set cat_style to current cat style after value check.
        theme.cat_style = theme.cat_arr[i][1];

      }

      // Assign style from base & cat_style.
      return Object.assign({}, style, theme.cat_style);

    }

  }

};