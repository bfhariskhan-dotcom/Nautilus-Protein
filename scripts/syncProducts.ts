import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { INITIAL_PRODUCTS } from '../src/data/initialProducts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase Config
const configPath = path.join(__dirname, '..', 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Update data/store.json
const storePath = path.join(__dirname, '..', 'data', 'store.json');
let storeData: any = {};
try {
  storeData = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
} catch (e) {
  storeData = { products: [], categories: [], brands: [] };
}

storeData.products = INITIAL_PRODUCTS;

// Update category itemCounts
if (storeData.categories) {
  storeData.categories = storeData.categories.map((cat: any) => {
    let count = 0;
    if (cat.slug === 'amino-acids') count = 1;
    else if (cat.slug === 'whey-protein') count = 6;
    else if (cat.slug === 'mass-gainers') count = 5;
    else if (cat.slug === 'creatine') count = 2;
    else if (cat.slug === 'vitamins' || cat.slug === 'health-essentials') count = 4;
    else if (cat.slug === 'accessories') count = 1;
    return { ...cat, itemCount: count };
  });
}

fs.writeFileSync(storePath, JSON.stringify(storeData, null, 2), 'utf-8');
console.log(`Updated data/store.json with ${INITIAL_PRODUCTS.length} products!`);

// Helper to sanitize for Firestore
function sanitizeForFirestore(data: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        clean[key] = value.map(item =>
          typeof item === 'object' && item !== null ? sanitizeForFirestore(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        clean[key] = sanitizeForFirestore(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

// Upload all 19 products to Firestore
async function uploadToFirestore() {
  console.log(`Starting Firestore sync for ${INITIAL_PRODUCTS.length} products...`);
  let successCount = 0;
  let failCount = 0;

  for (const product of INITIAL_PRODUCTS) {
    try {
      const sanitized = sanitizeForFirestore(product);
      await setDoc(doc(db, 'products', product.id), sanitized, { merge: true });
      console.log(`✓ Uploaded to Firestore: [${product.id}] ${product.name}`);
      successCount++;
    } catch (err: any) {
      console.error(`✕ Failed to upload ${product.id}:`, err.message || err);
      failCount++;
    }
  }

  // Also sync categories
  if (storeData.categories) {
    for (const cat of storeData.categories) {
      try {
        await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
      } catch (err) {}
    }
  }

  console.log(`Sync completed! ${successCount} succeeded, ${failCount} failed.`);
  process.exit(0);
}

uploadToFirestore();
