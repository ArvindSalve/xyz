import formatMVT from 'ol/format/MVT';
import formatGeoJSON from 'ol/format/GeoJSON';

import sourceOSM from 'ol/source/OSM';
import sourceVectorTile from 'ol/source/VectorTile';
import sourceVector from 'ol/source/Vector';

import {bbox} from 'ol/loadingstrategy';

import layerTile from 'ol/layer/Tile';
import layerVectorTile from 'ol/layer/VectorTile';
import layerVector from 'ol/layer/Vector';

import {Circle, Fill, Stroke, Icon, Style, Text} from 'ol/style';

import {transform, transformExtent, fromLonLat} from 'ol/proj';

import {defaults, Draw} from 'ol/interaction.js';

import {click} from 'ol/events/condition.js';

import {Map, View, Feature, Overlay} from 'ol';

import {Point, Polygon} from 'ol/geom';

import {ScaleLine} from 'ol/control';

export default () => ({

  Map: Map,
  
  View: View,
  
  Feature: Feature,
  
  Overlay: Overlay,
  
  control: {
    ScaleLine: ScaleLine,
  },
  
  interaction: {
    defaults: defaults,
    Draw: Draw,
  },
  
  events: {
    click: click,
  },
  
  proj: {
    transform: transform,
    transformExtent: transformExtent,
    fromLonLat: fromLonLat,
  },
  
  geom: {
    Point: Point,
    Polygon: Polygon,
  },
  
  format: {
    MVT: formatMVT,
    GeoJSON: formatGeoJSON,
  },
    
  source: {
    OSM: sourceOSM,
    VectorTile: sourceVectorTile,
    Vector: sourceVector,
  },
  
  loadingstrategy: {
    bbox: bbox
  },
    
  layer: {
    Tile: layerTile,
    VectorTile: layerVectorTile,
    Vector: layerVector,
  },
    
  style: {
    Style: Style,
    Fill: Fill,
    Stroke: Stroke,
    Circle: Circle,
    Icon: Icon,
    Text: Text,
  },
  
});