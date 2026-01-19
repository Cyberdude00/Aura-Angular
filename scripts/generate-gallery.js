#!/usr/bin/env node

/**
 * generate-gallery.js
 * Script que genera archivos JSON con datos de modelos leyendo carpetas en src/assets/models/
 *
 * Estructura esperada:
 * src/assets/models/
 *   ├── korea/
 *   │   ├── model_001/
 *   │   │   ├── main.jpg (foto de portada)
 *   │   │   ├── mini/ (carpeta con miniaturas)
 *   │   │   └── full/ (carpeta con imágenes en alta resolución)
 *   │   └── model_002/...
 *   └── china/
 *       └── ...
 *
 * Ejecutar: node scripts/generate-gallery.js
 */

const fs = require('fs');
const path = require('path');

// Configuración
const MODELS_DIR = path.join(__dirname, '../src/assets/models');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/data');
const MODEL_DATA_FILE = path.join(__dirname, '../src/assets/models/models-metadata.json');

// Crear carpeta de salida si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✓ Carpeta creada: ${OUTPUT_DIR}`);
}

/**
 * Lee el archivo de metadatos (models-metadata.json)
 * Estructura esperada:
 * {
 *   "korea": {
 *     "model_001": {
 *       "name": "Anna Kim",
 *       "gender": "Mujeres",
 *       "height": "180cm",
 *       "measurements": "85-60-90cm",
 *       ...
 *     }
 *   }
 * }
 */
function loadMetadata() {
  if (!fs.existsSync(MODEL_DATA_FILE)) {
    console.warn(`⚠ Archivo de metadatos no encontrado: ${MODEL_DATA_FILE}`);
    console.warn('Asegúrate de crear un archivo models-metadata.json con los datos de los modelos.');
    return {};
  }

  const content = fs.readFileSync(MODEL_DATA_FILE, 'utf-8');
  return JSON.parse(content);
}

/**
 * Obtiene las imágenes de una carpeta
 */
function getImagesFromFolder(folderPath) {
  if (!fs.existsSync(folderPath)) return [];

  return fs.readdirSync(folderPath)
    .filter(file => /\.(jpg|jpeg|png|gif|mp4|webm|mov)$/i.test(file))
    .map(file => `models/${file.split(path.sep).slice(-4).join('/')}`)
    .sort();
}

/**
 * Genera el JSON para una región
 */
function generateRegionData(region, regionPath, metadata) {
  const regionMetadata = metadata[region] || {};
  const models = [];

  // Leer directorios de modelos
  const modelDirs = fs.readdirSync(regionPath)
    .filter(dir => fs.statSync(path.join(regionPath, dir)).isDirectory());

  modelDirs.forEach(modelDir => {
    const modelPath = path.join(regionPath, modelDir);
    const modelMeta = regionMetadata[modelDir] || {};

    // Buscar la foto de portada (main.jpg, main.png, etc.)
    const photoFile = fs.readdirSync(modelPath)
      .find(file => /^main\.(jpg|jpeg|png)$/i.test(file));

    if (!photoFile) {
      console.warn(`⚠ No se encontró main.jpg/png para ${region}/${modelDir}`);
      return;
    }

    // Obtener imágenes del portfolio
    let portfolio = [];
    const miniPath = path.join(modelPath, 'mini');
    const fullPath = path.join(modelPath, 'full');

    if (fs.existsSync(miniPath)) {
      portfolio = getImagesFromFolder(miniPath);
    } else if (fs.existsSync(fullPath)) {
      portfolio = getImagesFromFolder(fullPath);
    }

    // Obtener imágenes de Instagram si existen
    let instagram = [];
    const instaPath = path.join(modelPath, 'instagram');
    if (fs.existsSync(instaPath)) {
      instagram = getImagesFromFolder(instaPath);
    }

    const model = {
      id: modelDir,
      name: modelMeta.name || modelDir.replace(/_/g, ' '),
      gender: modelMeta.gender || 'Mujeres',
      photo: `assets/models/${region}/${modelDir}/${photoFile}`,
      height: modelMeta.height || '',
      measurements: modelMeta.measurements || '',
      hair: modelMeta.hair || '',
      eyes: modelMeta.eyes || '',
      shoe: modelMeta.shoe || '',
      availability: modelMeta.availability || 'on',
      download: modelMeta.download || null,
      portfolio: portfolio,
      instagram: instagram
    };

    models.push(model);
  });

  return models;
}

/**
 * Función principal
 */
function generateGallery() {
  console.log('🔄 Generando archivos de galería...\n');

  if (!fs.existsSync(MODELS_DIR)) {
    console.error(`❌ Carpeta de modelos no encontrada: ${MODELS_DIR}`);
    console.error('Por favor, crea la estructura de carpetas en src/assets/models/');
    process.exit(1);
  }

  const metadata = loadMetadata();
  const regions = fs.readdirSync(MODELS_DIR)
    .filter(dir => fs.statSync(path.join(MODELS_DIR, dir)).isDirectory());

  if (regions.length === 0) {
    console.warn('⚠ No se encontraron regiones en', MODELS_DIR);
    console.warn('Crea carpetas con nombres de regiones (ej: korea, china, brazil, etc.)');
    process.exit(0);
  }

  regions.forEach(region => {
    const regionPath = path.join(MODELS_DIR, region);
    const models = generateRegionData(region, regionPath, metadata);

    const outputFile = path.join(OUTPUT_DIR, `${region}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(models, null, 2), 'utf-8');

    console.log(`✓ ${region}.json generado (${models.length} modelos)`);
  });

  console.log(`\n✅ Archivos generados en: ${OUTPUT_DIR}`);
}

// Ejecutar
generateGallery();
