# 🌊 NDWI Water Body Mapping of Chilika Lake

[![Google Earth Engine](https://img.shields.io/badge/Google%20Earth%20Engine-Enabled-blue)](https://earthengine.google.com/)
[![Sentinel-2](https://img.shields.io/badge/Data-Sentinel--2-orange)](https://sentinel.esa.int/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A comprehensive geospatial analysis project for monitoring water body extent in Chilika Lake, Odisha using NDWI (Normalized Difference Water Index) and Google Earth Engine.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Methodology](#methodology)
- [Data Sources](#data-sources)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Outputs & Exports](#outputs--exports)
- [Results](#results)
- [Technical Details](#technical-details)
- [Future Enhancements](#future-enhancements)
- [Author](#author)
- [License](#license)

## 🌍 Overview

This repository presents a **NDWI-based water body mapping** solution for **Chilika Lake**, Asia's largest brackish water lagoon. Using Google Earth Engine and Sentinel-2 satellite imagery, this project analyzes water extent dynamics, seasonal variations, and provides detailed geospatial statistics for wetland monitoring and environmental research.

### Study Area: Chilika Lake

- **Location**: Odisha, India
- **Significance**: Ramsar Wetland Site, critical biodiversity hotspot
- **Analysis Period**: 2023
- **Satellite Data**: Sentinel-2 Surface Reflectance (10m resolution)

## ✨ Features

- ✅ **Automated Water Detection**: NDWI-based thresholding (0.3 threshold)
- ✅ **Cloud Filtering**: <10% cloud cover for image quality
- ✅ **Multi-Format Exports**: CSV, GeoTIFF, Shapefile outputs
- ✅ **Vector Conversion**: Raster-to-polygon with area/perimeter metrics
- ✅ **Visual Analysis**: Interactive maps with RGB composites and NDWI visualization
- ✅ **Statistical Summary**: Automated area calculations and detailed reports
- ✅ **Legend Integration**: Informative map legend for easy interpretation

## 🔬 Methodology

### NDWI Calculation

The Normalized Difference Water Index (NDWI) is calculated using the formula:

```
NDWI = (Green - NIR) / (Green + NIR)
```

Where:
- **Green**: Sentinel-2 Band B3 (560 nm)
- **NIR**: Sentinel-2 Band B8 (842 nm)

### Water Classification

- **Water Pixels**: NDWI > 0.3
- **Non-Water Pixels**: NDWI ≤ 0.3

This threshold effectively separates water bodies from land, vegetation, and other surface features.

### Processing Pipeline

1. **Data Acquisition**: Load Sentinel-2 SR Harmonized imagery
2. **Preprocessing**: Filter by date, location, and cloud cover
3. **Composite Generation**: Create median composite for 2023
4. **Index Calculation**: Compute NDWI for all pixels
5. **Classification**: Apply threshold to generate water mask
6. **Vectorization**: Convert raster mask to polygon features
7. **Analysis**: Calculate area, perimeter, and other statistics
8. **Visualization**: Generate maps with multiple layers
9. **Export**: Save results in multiple formats

## 📊 Data Sources

### Primary Data
- **Sentinel-2 Surface Reflectance Harmonized**
  - Collection: `COPERNICUS/S2_SR_HARMONIZED`
  - Bands Used: B3 (Green), B4 (Red), B8 (NIR)
  - Resolution: 10 meters
  - Temporal Range: January 1 - December 31, 2023

### Study Area Boundary
- **Asset**: `projects/lulc-467806/assets/ChilkaSHP`
- **Format**: Shapefile
- **Coverage**: Chilika Lake AOI (Area of Interest)

## 🚀 Installation & Setup

### Prerequisites

1. **Google Earth Engine Account**
   - Sign up at [https://earthengine.google.com/](https://earthengine.google.com/)
   - Wait for account approval

2. **Access to GEE Code Editor**
   - Navigate to [https://code.earthengine.google.com/](https://code.earthengine.google.com/)

### Repository Setup

```bash
# Clone the repository
git clone https://github.com/satwik-shreshth/NDWI_Chilika.git

# Navigate to project directory
cd NDWI_Chilika
```

### Assets Required

Ensure the Chilika Lake shapefile is uploaded to your GEE assets:
- Path: `projects/lulc-467806/assets/ChilkaSHP`
- Format: Shapefile with all components (.shp, .shx, .dbf, .prj)

## 💻 Usage

### Running the Script

1. Open the Google Earth Engine Code Editor
2. Copy the contents of `NDWI_Chilika JS.js`
3. Paste into the GEE code editor
4. Verify asset path: `"projects/lulc-467806/assets/ChilkaSHP"`
5. Click **Run** to execute the analysis

### Viewing Results

The script will display:
- **RGB Composite**: True color visualization of Chilika Lake
- **NDWI Map**: Continuous NDWI values (-1 to 1)
- **Water/Non-Water Classification**: Binary classification map
- **Vector Boundaries**: Water body polygons
- **Statistics Panel**: Summary of water extent and metrics

### Exporting Data

The script includes automated export tasks:

```javascript
// Exports are automatically queued in the Tasks tab
// Click "Run" on each export task to download
```

## 📤 Outputs & Exports

### 1. Statistical Reports
- **Water Body Area Statistics** (CSV)
  - Polygon ID
  - Area (hectares/sq km)
  - Perimeter (meters)
  - NDWI statistics

### 2. Raster Datasets
- **NDWI Raster** (GeoTIFF)
  - Continuous NDWI values
  - 10m resolution
  - Full AOI coverage

- **Water Mask** (GeoTIFF)
  - Binary classification (0/1)
  - Water = 1, Non-water = 0

### 3. Vector Data
- **Water Body Polygons** (Shapefile)
  - Individual water body features
  - Area and perimeter attributes
  - Compatible with QGIS/ArcGIS

### 4. Reference Imagery
- **RGB Composite** (GeoTIFF)
  - True color image for reference
  - Bands: Red, Green, Blue

## 📈 Results

### Key Findings (2023 Analysis)

The analysis provides comprehensive insights into:
- Total water surface area in Chilika Lake
- Seasonal water extent variations
- Identification of distinct water bodies
- Change detection capabilities

### Applications

- **Environmental Monitoring**: Track wetland health and changes
- **Biodiversity Studies**: Support habitat assessment
- **Climate Research**: Analyze water extent patterns
- **Policy Planning**: Inform conservation strategies
- **Disaster Management**: Monitor flooding and drought conditions

## 🛠️ Technical Details

### GEE Script Components

```javascript
// Key functions and operations
- ee.FeatureCollection() // Load AOI
- ee.ImageCollection() // Sentinel-2 data
- .filterBounds() // Spatial filter
- .filterDate() // Temporal filter
- .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)) // Cloud filter
- .median() // Composite generation
- .normalizedDifference(['B3', 'B8']) // NDWI calculation
- .gt(0.3) // Thresholding
- .reduceToVectors() // Vectorization
```

### System Requirements

- **Browser**: Chrome, Firefox, or Edge (latest versions)
- **Internet**: Stable connection for GEE processing
- **Storage**: Adequate Google Drive space for exports

### Performance Optimization

- Cloud filtering reduces processing time
- Median compositing handles missing data
- Vectorization limited to water pixels for efficiency

## 🔮 Future Enhancements

- [ ] Multi-temporal analysis (2020-2025)
- [ ] Seasonal comparison (pre-monsoon vs post-monsoon)
- [ ] Integration with other indices (MNDWI, AWEI)
- [ ] Machine learning classification
- [ ] Time-series animation
- [ ] Automated change detection
- [ ] Real-time monitoring dashboard
- [ ] Integration with precipitation data

## 👨‍💻 Author

**Satwik Shreshth**
- 🎓 MCA Final Year, Sikkim University
- 🔬 Research Focus: IoT, ML, Remote Sensing
- 🌐 Portfolio: [satwik-shreshth.github.io](https://satwik-shreshth.github.io/)
- 📧 Connect via [Portfolio Contact](https://satwik-shreshth.github.io/contact.html)

### Contributions

This project is part of my research in geospatial analysis and environmental monitoring. Contributions, suggestions, and feedback are welcome!

## 📄 License

**© 2024 Satwik Shreshth. All rights reserved.**

This project is developed for educational and research purposes. The code is available for academic use with proper attribution.

## 🙏 Acknowledgments

- **Google Earth Engine**: For providing the cloud-based platform
- **ESA Copernicus Programme**: For Sentinel-2 satellite data
- **QGIS**: For shapefile preparation and validation
- **Sikkim University**: For academic support

## 📚 References

- McFeeters, S. K. (1996). The use of the Normalized Difference Water Index (NDWI) in the delineation of open water features.
- Sentinel-2 User Handbook: ESA Standard Document
- Google Earth Engine Documentation: [https://developers.google.com/earth-engine](https://developers.google.com/earth-engine)

---

**⭐ If you find this project useful, please consider starring the repository!**

For questions or collaboration opportunities, feel free to reach out through my portfolio website.
