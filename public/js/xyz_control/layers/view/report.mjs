export default _xyz => {

  const report = {

    panel: panel,

  }

  return report;


  function panel(layer) {

    if (!layer.report) return;

    if (!layer.report.templates) return;

    const panel = _xyz.utils.wire()`<div class="panel expandable">`;
  
    // Panel header
    panel.appendChild(_xyz.utils.wire()`
    <div
      class="btn_text cursor noselect primary-colour"
      onclick=${e => {
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent({
          expandable: panel,
          accordeon: true,
        });
      }}>Reports`);

    Object.entries(layer.report.templates).forEach(entry => {

      const href = _xyz.host + '/report?' + _xyz.utils.paramString(
        Object.assign(
          entry[1],
          {
            locale: _xyz.workspace.locale.key,
            layer: layer.key,
            token: _xyz.token
          }
        )
      );

      panel.appendChild(_xyz.utils.wire()`
      <a
        target="_blank"
        href="${href}"
        class="link-with-img">
        <div class="xyz-icon icon-event-note"></div><span>${entry[1].name || entry[0]}`);

    });

    return panel;

  };

}