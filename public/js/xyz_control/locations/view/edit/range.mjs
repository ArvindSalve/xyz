export default _xyz => entry => {

  _xyz.utils.createElement({
    tag: 'span',
    options: {
      textContent: entry.edit.range.label
    },
    appendTo: entry.val
  });

  const lbl = _xyz.utils.createElement({
    tag: 'span',
    options: {
      textContent: entry.value,
      className: 'bold'
    },
    appendTo: entry.val
  });

  _xyz.utils.slider({
    min: entry.edit.range.min,
    max: entry.edit.range.max,
    value: entry.value,
    appendTo: entry.val,
    oninput: e => {

      lbl.innerHTML = e.target.value;
      //valChange(e.target, location, entry);
      
    }
  });

};