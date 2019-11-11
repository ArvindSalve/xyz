export default _xyz => entry => {

  const xhr = new XMLHttpRequest();

  let meta = null;

  if(entry.edit){
    if(entry.edit.isoline_here && entry.edit.isoline_here.meta) meta = entry.edit.isoline_here.meta;
    if(entry.edit.isoline_mapbox && entry.edit.isoline_mapbox.meta) meta = entry.edit.isoline_mapbox.meta;
  }

  xhr.open('GET', _xyz.host +
    '/api/location/edit/field/setnull?' +
    _xyz.utils.paramString({
      locale: _xyz.workspace.locale.key,
      layer: entry.location.layer.key,
      table: entry.location.table,
      id: entry.location.id,
      field: entry.field,
      meta: meta,
      token: _xyz.token
    })
  );

  xhr.onload = e => {

    if (e.target.status !== 200) return;

    entry.location.infoj = JSON.parse(e.target.response);

    entry.location.view.drawer.appendChild(_xyz.locations.view.update(entry.location));
  };

  xhr.send();
};