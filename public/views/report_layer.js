const params = {};

// Take hooks from URL and store as current hooks.
window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (match, key, value) => {
  params[key] = decodeURI(value);
});

_xyz({
  host: document.head.dataset.dir,
  token: document.body.dataset.token,
  locale: params.locale,
  callback: init
});

function init(_xyz) {

  _xyz.mapview.create({
    scrollWheelZoom: true,
    target: document.getElementById('report_map')
  });

  const layer = _xyz.layers.list[params.layer];

  layer.view();

  layer.show();

  if (layer.style.theme) {

    document.getElementById('report_left').appendChild(layer.style.legend);

  }

  // _xyz.dataview.layerTable({
  //   layer: _xyz.layers.list.COUNTRIES,
  //   target: document.getElementById('report_table'),
  //   key: 'table1'
  // });

}