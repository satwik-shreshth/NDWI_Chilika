// Water Body Mapping using NDWI - Chilka Lake, Odisha
// Based on your code with enhanced outputs and visualization

// Step 1: Load your AOI shapefile
var aoi = ee.FeatureCollection("projects/lulc-467806/assets/ChilkaSHP");

// Center map on AOI
Map.centerObject(aoi, 10);

// Add AOI boundary to map for reference
Map.addLayer(aoi, {color: 'yellow', fillColor: '00000000'}, 'Study Area (AOI)', true);

print('AOI loaded successfully from shapefile');
print('AOI Feature Collection:', aoi);

// Step 2: Filter Sentinel-2 and preprocess
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(aoi)
  .filterDate('2023-01-01', '2023-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .map(function(img) {
    return img.clip(aoi).divide(10000)
      .select(['B2', 'B3', 'B4', 'B8']); // Blue, Green, Red, NIR for RGB and NDWI
  });

var median = s2.median();

print('Sentinel-2 collection filtered and processed');
print('Number of images used:', s2.size());

// Step 3: Display RGB composite for reference
var rgbVis = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 0.3,
  gamma: 1.2
};
Map.addLayer(median, rgbVis, 'Sentinel-2 RGB (2023)', false);

// Step 4: Compute NDWI: (Green - NIR) / (Green + NIR)
var ndwi = median.normalizedDifference(['B3', 'B8']).rename('NDWI');

// Visualize NDWI with enhanced color scheme
var ndwiVis = {
  min: -1,
  max: 1,
  palette: ['8B4513', 'D2B48C', 'FFFFE0', '87CEEB', '0000FF'] // Brown to blue gradient
};
Map.addLayer(ndwi, ndwiVis, 'NDWI Index', true);

// Step 5: Threshold NDWI to create water mask (using your 0.3 threshold)
var waterMask = ndwi.gt(0.3);

// Apply mask to create visual layer
var waterImage = ndwi.updateMask(waterMask).rename('Water');

// Step 6: Enhanced visualization - Water and Non-water areas
Map.addLayer(waterMask.updateMask(waterMask), {palette: ['0000FF']}, 'Water Bodies', true);
Map.addLayer(waterMask.updateMask(waterMask.not()), {palette: ['8B4513']}, 'Non-Water Areas', false);

// Step 7: Create enhanced legend with proper styling
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px',
    backgroundColor: 'white'
  }
});

var legendTitle = ui.Label({
  value: 'NDWI Water Mapping Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 0 8px 0',
    color: '333'
  }
});
legend.add(legendTitle);

var makeRow = function(color, name) {
  var colorBox = ui.Label('', {
    backgroundColor: color,
    padding: '10px',
    margin: '0 8px 4px 0',
    border: '1px solid black'
  });
  var description = ui.Label(name, {
    margin: '0 0 4px 0',
    fontSize: '14px'
  });
  return ui.Panel([colorBox, description], ui.Panel.Layout.Flow('horizontal'));
};

legend.add(makeRow('0000FF', 'Water Bodies (NDWI > 0.3)'));
legend.add(makeRow('8B4513', 'Non-Water Areas'));
legend.add(makeRow('FFFF00', 'Study Area Boundary'));

Map.add(legend);

// Step 8: Convert raster to vectors with optimized parameters
var waterVector = waterMask.selfMask().reduceToVectors({
  geometry: aoi,
  scale: 30,
  geometryType: 'polygon',
  eightConnected: false,
  labelProperty: 'water',
  maxPixels: 1e13,
  bestEffort: true,
  tileScale: 2
});

print('Water bodies converted to vector polygons');
print('Number of water body polygons:', waterVector.size());

// Step 9: Calculate comprehensive area statistics
var areaStats = waterVector.map(function(feature) {
  var area_m2 = feature.geometry().area(1); // with 1m error margin
  var area_ha = area_m2.divide(10000); // Convert to hectares
  var area_sqkm = area_m2.divide(1000000); // Convert to sq.km
  var perimeter = feature.geometry().perimeter(1); // Perimeter with error margin
  
  return feature.set({
    'area_m2': area_m2,
    'area_ha': area_ha,
    'area_sqkm': area_sqkm,
    'perimeter_m': perimeter,
    'ndwi_threshold': 0.3
  });
});

// Print detailed area statistics
print('Water Body Area Statistics:');
print('Individual water bodies with area stats:', areaStats.limit(10));

// Calculate total water area
var totalWaterArea = waterMask.multiply(ee.Image.pixelArea())
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e13,
    bestEffort: true
  });

var totalArea_ha = ee.Number(totalWaterArea.get('NDWI')).divide(10000);
var totalArea_sqkm = ee.Number(totalWaterArea.get('NDWI')).divide(1000000);

print('TOTAL WATER AREA SUMMARY:');
print('Total Water Area (hectares):', totalArea_ha);
print('Total Water Area (sq km):', totalArea_sqkm);

// Step 10: Export area statistics as CSV with comprehensive data
Export.table.toDrive({
  collection: areaStats,
  description: 'WaterBody_Area_Stats_Detailed',
  folder: 'GEE_Exports',
  fileFormat: 'CSV',
  selectors: ['water', 'area_m2', 'area_ha', 'area_sqkm', 'perimeter_m', 'ndwi_threshold']
});

// Step 11: Export NDWI raster layer as GeoTIFF
Export.image.toDrive({
  image: ndwi.clip(aoi),
  description: 'NDWI_Raster_Chilka_2023',
  folder: 'GEE_Exports',
  fileNamePrefix: 'Chilka_NDWI_2023',
  region: aoi.geometry(),
  scale: 10, // Use Sentinel-2 native resolution
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

// Step 12: Export water mask as binary raster
Export.image.toDrive({
  image: waterMask.clip(aoi),
  description: 'Water_Mask_Binary_2023',
  folder: 'GEE_Exports',
  fileNamePrefix: 'Chilka_WaterMask_2023',
  region: aoi.geometry(),
  scale: 10,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

// Step 13: Export water body polygons as shapefile
Export.table.toDrive({
  collection: areaStats,
  description: 'WaterBodies_Polygons_Chilka',
  folder: 'GEE_Exports',
  fileFormat: 'SHP'
});

// Step 14: Export RGB reference image
Export.image.toDrive({
  image: median.select(['B4', 'B3', 'B2']).clip(aoi),
  description: 'Sentinel2_RGB_Reference_2023',
  folder: 'GEE_Exports',
  fileNamePrefix: 'Chilka_RGB_2023',
  region: aoi.geometry(),
  scale: 10,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

// Step 15: Create comprehensive summary report
var summaryStats = ee.Dictionary({
  'Study_Area': 'Chilka Lake, Odisha, India',
  'Analysis_Period': '2023-01-01 to 2023-12-31',
  'Satellite_Data': 'Sentinel-2 SR Harmonized',
  'NDWI_Formula': '(B3-B8)/(B3+B8)',
  'Water_Threshold': 'NDWI > 0.3',
  'Spatial_Resolution': '10m (native Sentinel-2)',
  'Processing_Scale': '30m (for vectorization)',
  'Total_Water_Area_ha': totalArea_ha,
  'Total_Water_Area_sqkm': totalArea_sqkm,
  'Number_of_Water_Bodies': waterVector.size(),
  'Cloud_Cover_Filter': '< 10%',
  'Composite_Method': 'Median'
});

print('=== ANALYSIS SUMMARY ===');
print(summaryStats);

// Step 16: Add analysis information panel
var infoPanel = ui.Panel({
  style: {
    position: 'top-right',
    padding: '10px',
    backgroundColor: 'white'
  }
});

var infoTitle = ui.Label('Analysis Information', {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0'
});

var infoText = ui.Label(
  'Study Area: Chilka Lake, Odisha\n' +
  'Period: 2023\n' +
  'Method: NDWI > 0.3\n' +
  'Data: Sentinel-2 SR\n' +
  'Resolution: 10m',
  {fontSize: '12px', whiteSpace: 'pre'}
);

infoPanel.add(infoTitle);
infoPanel.add(infoText);
Map.add(infoPanel);

