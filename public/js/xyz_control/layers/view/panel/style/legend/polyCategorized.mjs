import d3_selection from 'd3-selection';

export default _xyz => layer => {

  const legend = d3_selection.select(layer.style.legend).append('svg');
  
  let y = 10;

  // Create / empty legend filter when theme is applied.
  layer.filter.legend = {};

  // Create array for NI (not in) value filter.
  layer.filter.legend[layer.style.theme.field] = {
    ni: []
  };

  Object.entries(layer.style.theme.cat).forEach(cat => {

    let cat_style = Object.assign({}, layer.style.default, cat[1].style);

    if(cat_style.fillOpacity === undefined) {

      legend.append('line')
        .attr('x1', 4)
        .attr('y1', y + 10)
        .attr('x2', 18)
        .attr('y2', y + 10)
        .style('stroke', cat_style.color)
        .style('stroke-width', cat_style.weight || 1); 
  
    } else {

      legend.append('rect')
        .attr('x', 4)
        .attr('y', y + 3)
        .attr('width', 14)
        .attr('height', 14)
        .style('fill', cat_style.fillColor || '#FFF')
        .style('fill-opacity', cat_style.fillOpacity)
        .style('stroke', cat_style.color)
        .style('stroke-width', cat_style.weight || 1);      
      
    } 

    legend.append('text')
      .attr('x', 25)
      .attr('y', y + 11)
      .style('font-size', '12px')
      .style('alignment-baseline', 'central')
      .style('cursor', 'pointer')
      .text(cat[1].label || cat[0])
      .on('click', function () {
        if (this.style.opacity == 0.5) {
          this.style.opacity = 1;
          this.style.fillOpacity = 1;

          // Splice value out of the NI (not in) legend filter.
          layer.filter.legend[layer.style.theme.field].ni.splice(layer.filter.legend[layer.style.theme.field].ni.indexOf(cat[0]), 1);

        } else {
          this.style.opacity = 0.5;
          this.style.fillOpacity = 0.5;
          
          // Push value into the NI (not in) legend filter.
          layer.filter.legend[layer.style.theme.field].ni.push(cat[0]);
        }
      
        layer.loaded = false;
        layer.get();
      });
      
    y += 20;
  });


      
  // Attach box for other/default categories.
  if (layer.style.theme.other) {

    if(layer.style.default.fillOpacity === undefined) {

      legend.append('line')
        .attr('x1', 4)
        .attr('y1', y + 10)
        .attr('x2', 18)
        .attr('y2', y + 10)
        .style('stroke', layer.style.default.color)
        .style('stroke-width', layer.style.default.weight || 1); 
  
    } else {

      legend.append('rect')
        .attr('x', 4)
        .attr('y', y + 3)
        .attr('width', 14)
        .attr('height', 14)
        .style('fill', layer.style.default.fillColor || '#FFF')
        .style('fill-opacity', layer.style.default.fillOpacity)
        .style('stroke', layer.style.default.color)
        .style('stroke-width', layer.style.default.weight || 1);   

    }    
      
    // Attach text with filter on click for the other/default category.
    legend.append('text')
      .attr('x', 25)
      .attr('y', y + 11)
      .style('font-size', '12px')
      .style('alignment-baseline', 'central')
      .style('cursor', 'pointer')
      .text('other')
      .on('click', function () {
        if (this.style.opacity == 0.5) {
          this.style.opacity = 1;

          // Empty IN values filter array.
          layer.filter.legend[layer.style.theme.field].in = [];
          
        } else {
          this.style.opacity = 0.5;
          
          // Assign all cat keys to IN filter.
          layer.filter.legend[layer.style.theme.field].in = Object.keys(layer.style.theme.cat);
        }
      
        layer.loaded = false;
        layer.get();
      });
      
    y += 20;
  }

  // Set height of the svg element.
  legend.attr('height', y);
      
};