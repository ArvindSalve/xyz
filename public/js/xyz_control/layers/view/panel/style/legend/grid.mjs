export default _xyz => layer => {

  // Create grid_size dropdown.
  _xyz.utils.dropdown({
    appendTo: layer.style.legend,
    entries: layer.grid_fields,
    selected: Object.keys(layer.grid_fields).find(key => layer.grid_fields[key] === layer.grid_size),
    onchange: e => {
      layer.grid_size = layer.grid_fields[e.target.value];
      layer.get();
    }
  });

  const legend = layer.style.legend.appendChild(_xyz.utils.wire()
  `<svg 
  xmlns='http://www.w3.org/2000/svg'
  >`);
    
  // Create SVG grid legend
  let
    yTrack = 35,
    n = layer.style.range.length,
    w = 100 / n;

  for (let i = 0; i < n; i++) {

    let
      r = (i + 2) * 10 / n,
      x = i * w;

    let circle1 = _xyz.utils.wire(null, 'svg')
    `<circle
    fill='#333'
    >`; 

    circle1.setAttribute('cx', x + w / 2 + 1 + '%');
    circle1.setAttribute('cy', yTrack + 1);
    circle1.setAttribute('r', r);

    legend.appendChild(circle1);

    let circle2 = _xyz.utils.wire(null, 'svg')
    `<circle
    fill='#999'
    >`;

    circle2.setAttribute('cx', x + w / 2 + '%');
    circle2.setAttribute('cy', yTrack);
    circle2.setAttribute('r', r);

    legend.appendChild(circle2);

    if (i === 0) {

      layer.style.legend.size_min = _xyz.utils.wire(null, 'svg')
      `<text
      style='font-size:13px; text-anchor: start; font-family: "PT Mono", monospace;'
      >min
      </text>`;

      layer.style.legend.size_min.setAttribute("x", x  + '%');
      layer.style.legend.size_min.setAttribute("y", yTrack - 20);

      legend.appendChild(layer.style.legend.size_min);
    }

    if (i === (n / 2 % 1 != 0 && Math.round(n / 2) - 1)) {

      layer.style.legend.size_avg = _xyz.utils.wire(null, 'svg')
      `<text
      style='font-size:13px; text-anchor: middle; font-family: "PT Mono", monospace;'
      >avg
      </text>`;

      layer.style.legend.size_avg.setAttribute("x", x + w / 2 + '%');
      layer.style.legend.size_avg.setAttribute("y", yTrack - 20);

      legend.appendChild(layer.style.legend.size_avg);

    }

    if (i === n - 1) {

      layer.style.legend.size_max = _xyz.utils.wire(null, 'svg')
      `<text
      style='font-size:13px; text-anchor: end; font-family: "PT Mono", monospace;'
      >max
      </text>`;

      layer.style.legend.size_max.setAttribute("x", x + w + '%');
      layer.style.legend.size_max.setAttribute("y", yTrack - 20);

      legend.appendChild(layer.style.legend.size_max);

    }

  }

  yTrack += 20;

  for (let i = 0; i < n; i++) {

    let x = i * w;

    let rect = _xyz.utils.wire(null, 'svg')
    `<rect
    height=20
    fill=${layer.style.range[i]}
    >`;

    rect.setAttribute("x", x  + '%');
    rect.setAttribute("y", yTrack);
    rect.setAttribute("width",  w + '%');

    legend.appendChild(rect);

    if (i === 0) {

      layer.style.legend.color_min = _xyz.utils.wire(null, 'svg')
      `<text
      style='font-size:13px; text-anchor: start; font-family: "PT Mono", monospace;'
      >min
      </text>`;

      layer.style.legend.color_min.setAttribute("x", x  + '%');
      layer.style.legend.color_min.setAttribute("y", yTrack + 40);

      legend.appendChild(layer.style.legend.color_min);
    }

    if (i === (n / 2 % 1 != 0 && Math.round(n / 2) - 1)) {

      layer.style.legend.color_avg = _xyz.utils.wire(null, 'svg')
      `<text id="grid_legend_color__avg"
      style='font-size:13px; text-anchor: middle; font-family: "PT Mono", monospace;'
      >avg
      </text>`;

      layer.style.legend.color_avg.setAttribute("x", x + w / 2 + '%');
      layer.style.legend.color_avg.setAttribute("y", yTrack + 40);

      legend.appendChild(layer.style.legend.color_avg);
    }

    if (i === n - 1) {

      layer.style.legend.color_max = _xyz.utils.wire(null, 'svg')
      `<text id="grid_legend_color__max"
      style='font-size:13px; text-anchor: end; font-family: "PT Mono", monospace;'
      >max
      </text>`;

      layer.style.legend.color_max.setAttribute("x", x + w + '%')
      layer.style.legend.color_max.setAttribute("y", yTrack + 40);

      legend.appendChild(layer.style.legend.color_max);
    }

  }

  legend.style.height = `${yTrack + 43}px`;

  // Create grid_color dropdown.
  _xyz.utils.dropdown({
    appendTo: layer.style.legend,
    entries: layer.grid_fields,
    selected:  Object.keys(layer.grid_fields).find(key => layer.grid_fields[key] === layer.grid_color),
    onchange: e => {
      layer.grid_color = layer.grid_fields[e.target.value];
      layer.get();
    }
  });
  
  layer.style.legend.appendChild(_xyz.utils.wire()`
  <td style="padding-top: 5px;" colSpan=2>
  <label class="checkbox">Display colour values as a ratio to the size value.
  <input type="checkbox"
    checked=${layer.grid_ratio}
    onchange=${e => {
    layer.grid_ratio = e.target.checked;
    layer.get();
  }}>
  <div class="checkbox_i">`);

};