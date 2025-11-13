
# NDWI Water Body Mapping of Chilika Lake

## Project Overview
This repository contains the Google Earth Engine (GEE) script for mapping water bodies in Chilika Lake, Odisha, using the Normalized Difference Water Index (NDWI). The analysis utilizes Sentinel-2 Surface Reflectance data from 2023 to detect water bodies via an NDWI threshold of 0.3, highlighting seasonal water extent and dynamics.

# Features
- Loads and clips the Chilika Lake area of interest (AOI) from a shapefile.
- Filters Sentinel-2 imagery by date, location, and cloud cover (<10%).
- Computes median composite for 2023.
- Calculates NDWI using green and near-infrared bands.
- Generates water masks based on thresholding NDWI values.
- Converts raster water masks to vector polygons with area and perimeter statistics.
- Visualizes the study area, RGB composite, NDWI index, water/non-water areas, and an informative legend.
- Exports detailed area statistics, NDWI raster, water mask, vector polygons, and RGB reference image to Google Drive.
- Includes a summary stats panel and detailed printed analysis information.

# Usage
1. Open the script in the Google Earth Engine code editor.
2. Ensure access to the Chilika Lake shapefile asset: `"projects/lulc-467806/assets/ChilkaSHP"`.
3. Run the script to view mapped water bodies and statistics for 2023.
4. Use export tasks in GEE to download CSVs, GeoTIFFs, Shapefiles, and reference imagery.

# Data Sources
- Sentinel-2 Surface Reflectance Harmonized Collection (COPERNICUS/S2_SR_HARMONIZED)
- Chilika Lake shapefile boundary for the area of interest.

# Methodology
NDWI is calculated as $$\frac{\text{Green} - \text{NIR}}{\text{Green} + \text{NIR}}$$ using Sentinel-2 bands B3 (green) and B8 (NIR). A threshold of 0.3 separates water and non-water pixels. Raster results are vectorized for detailed water body delineation and area statistics.

## Exports
- Water body area statistics (CSV)
- NDWI raster (GeoTIFF)
- Water mask binary raster (GeoTIFF)
- Water body polygons (Shapefile)
- RGB reference image (GeoTIFF)

