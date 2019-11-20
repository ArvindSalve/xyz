export default (_xyz, layer, filter_entry) => {
    
  const block = _xyz.utils.createElement({
    tag: 'div',
    options: {
      classList: 'block'
    },
    appendTo: layer.filter.list
  });

  _xyz.utils.createElement({
    tag: 'div',
    options: {
      textContent: filter_entry.label,
      classList: 'title'
    },
    appendTo: block
  });

  _xyz.utils.createElement({
    tag: 'i',
    options: {
      textContent: 'clear',
      classList: 'material-icons cancel-btn'
    },
    appendTo: block,
    eventListener: {
      event: 'click',
      funct: () => {

        // Remove this block and delete filter.
        block.remove();
        delete layer.filter.current[filter_entry.field];

        // Hide clear all filter.
        if (Object.keys(layer.filter.current).length < 1) {
          layer.filter.clear_all.style.display = 'none';
          layer.filter.check_count();
        }

        // Enable filter in select dropdown.
        Object.values(layer.filter.select.options).forEach(opt => {
          if (opt.value === filter_entry.field) opt.disabled = false;
        });

        layer.show();

      }
    }
  });
  return block;

};