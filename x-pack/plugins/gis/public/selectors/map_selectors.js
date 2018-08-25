/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { createSelector } from 'reselect';
import { TileLayer } from '../shared/layers/tile_layer';
import { VectorLayer } from '../shared/layers/vector_layer';
import { GeohashGridLayer } from '../shared/layers/geohashgrid_layer';
import { EMSFileSource } from '../shared/layers/sources/ems_file_source';
import { KibanaRegionmapSource } from '../shared/layers/sources/kibana_regionmap_source';
import { XYZTMSSource } from '../shared/layers/sources/xyz_tms_source';
import { EMSTMSSource } from '../shared/layers/sources/ems_tms_source';
import { KibanaTilemapSource } from '../shared/layers/sources/kibana_tilemap_source';
import { ESGeohashGridSource } from '../shared/layers/sources/es_geohashgrid_source';

/**
 *
 * Everywhere else in the code, transformations of the state should happen by method-call on the object.
 * Polymorphism will resolve the correct implementation.
 */
function createLayerInstance(layerDescriptor) {
  const source = createSourceInstance(layerDescriptor.sourceDescriptor);
  switch (layerDescriptor.type) {
    case TileLayer.type:
      return new TileLayer({ layerDescriptor, source });
    case VectorLayer.type:
      return new VectorLayer({ layerDescriptor, source });
    case GeohashGridLayer.type:
      return new GeohashGridLayer({ layerDescriptor, source });
    default:
      throw new Error(`Unrecognized layerType ${layerDescriptor.type}`);
  }
}

function createSourceInstance(sourceDescriptor) {
  switch (sourceDescriptor.type) {
    case XYZTMSSource.type:
      return new XYZTMSSource(sourceDescriptor);
    case EMSTMSSource.type:
      return new EMSTMSSource(sourceDescriptor);
    case KibanaTilemapSource.type:
      return new KibanaTilemapSource(sourceDescriptor);
    case EMSFileSource.type:
      return new EMSFileSource(sourceDescriptor);
    case KibanaRegionmapSource.type:
      return new KibanaRegionmapSource(sourceDescriptor);
    case ESGeohashGridSource.type:
      return new ESGeohashGridSource(sourceDescriptor);
    default:
      throw new Error(`Unrecognized sourceType ${sourceDescriptor.type}`);
  }
}

export const getMapConstants = ({ map }) => map && map.mapConstants;

export const getSelectedLayerInstance = ({ map }) => {
  if (!map.selectedLayerId || !map.layerList) {
    return null;
  }
  const selectedLayer = map.layerList.find(layerDescriptor => layerDescriptor.id === map.selectedLayerId);
  return createLayerInstance(selectedLayer);
};


const getLayerListRaw = createSelector(({ map }) => {
  return map.layerList ?  map.layerList : [];
}, x => x);


export const getLayerList = createSelector(getLayerListRaw, (layerList) => {
  return layerList.map(layerDescriptor => createLayerInstance(layerDescriptor));
});

export const getLayerLoading = ({ map }) => map && map.layerLoading;

export const getTemporaryLayers = createSelector(getLayerList, (layerList) => layerList.filter(layer => layer.isTemporary()));