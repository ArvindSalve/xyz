export default _xyz => entry => {

  if(entry.label_td) {
    entry.label_td.colSpan = '2';
  } else {
    entry.row.remove();
  }

  const lnglat = _xyz.mapview.lib.proj.transform(entry.location.marker, 'EPSG:3857', 'EPSG:4326');

  const src = `${_xyz.host}/proxy/request?uri=https://maps.googleapis.com/maps/api/streetview?location=${lnglat[1]},${lnglat[0]}&size=300x230&provider=GOOGLE&token=${_xyz.token || ''}`;

  entry.location.view.node.appendChild(
    _xyz.utils.wire()`
    <tr class="${entry.class || ''}">
      <td colspan=2>
        <a
        target="_blank" 
        href="${'https://www.google.com/maps?cbll=' + lnglat[1] + ',' + lnglat[0] + '&layer=c'}">
          <img
          class="img_streetview"
          src="${src}">`
  );
  
};