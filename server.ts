import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'store.json');

app.use(express.json());

const upload = multer({
  limits: { fileSize: 16 * 1024 * 1024 }
});

const IMGBB_API_KEY = process.env.IMGBB_API_KEY || 'bfbd887ebc86001dfbbd00f361b65421';

// Helper to safely read and write database
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      throw new Error('Database file does not exist');
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database:', err);
    return {
      products: [],
      categories: [],
      brands: [],
      orders: [],
      coupons: [],
      reviews: [],
      subscribers: [],
      settings: {}
    };
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

// Admin Auth Helper
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nautilus2026';
const ADMIN_TOKEN = 'np-auth-secure-session-923252571589';

function requireAdmin(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized administrative access' });
  }
}

// ---------------- API ROUTES ----------------

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if ((username === 'admin' || username === 'nautilus') && password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN, user: { username: 'Admin', role: 'SuperAdmin' } });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    res.json({ authenticated: true, user: { username: 'Admin', role: 'SuperAdmin' } });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// ImgBB Secure Upload Proxy
app.post('/api/upload/imgbb', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded' });
    }

    const base64Data = req.file.buffer.toString('base64');
    const formParams = new URLSearchParams();
    formParams.append('image', base64Data);

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: formParams.toString()
    });

    const data: any = await imgbbRes.json();
    if (data.success && data.data) {
      return res.json({
        success: true,
        url: data.data.url || data.data.display_url,
        displayUrl: data.data.display_url,
        thumbUrl: data.data.thumb?.url,
        deleteUrl: data.data.delete_url
      });
    } else {
      return res.status(imgbbRes.status || 400).json({
        success: false,
        error: data.error?.message || data.status_txt || 'ImgBB upload rejected'
      });
    }
  } catch (err: any) {
    console.error('Server upload error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Image proxy failed' });
  }
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const db = readDB();
  let list = db.products || [];
  const { category, brand, goal, search, sort, featured, bestSeller } = req.query;

  if (category && category !== 'all') {
    list = list.filter((p: any) => p.category === category || p.slug === category);
  }
  if (brand && brand !== 'all') {
    list = list.filter((p: any) => p.brand.toLowerCase() === (brand as string).toLowerCase());
  }
  if (goal && goal !== 'all') {
    list = list.filter((p: any) => p.goal === goal);
  }
  if (featured === 'true') {
    list = list.filter((p: any) => p.isFeatured);
  }
  if (bestSeller === 'true') {
    list = list.filter((p: any) => p.isBestSeller);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter((p: any) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
  }

  // Sort
  if (sort === 'price-low') {
    list.sort((a: any, b: any) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sort === 'price-high') {
    list.sort((a: any, b: any) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sort === 'newest') {
    list.sort((a: any, b: any) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else {
    // Default popular
    list.sort((a: any, b: any) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.rating - a.rating);
  }

  res.json(list);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const db = readDB();
  const identifier = req.params.id;
  const product = (db.products || []).find((p: any) => p.id === identifier || p.slug === identifier);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const productData = req.body;
  const newId = `prod-${Date.now()}`;
  const slug = (productData.name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newProduct = {
    ...productData,
    id: newId,
    slug: productData.slug || slug,
    stock: Number(productData.stock) || 0,
    inStock: (Number(productData.stock) || 0) > 0,
    price: Number(productData.price) || 0,
    salePrice: productData.salePrice ? Number(productData.salePrice) : undefined,
    rating: Number(productData.rating) || 5.0,
    reviewCount: Number(productData.reviewCount) || 0,
    nutritionFacts: productData.nutritionFacts || [],
    ingredients: productData.ingredients || [],
    flavors: productData.flavors || []
  };

  db.products = [newProduct, ...(db.products || [])];
  writeDB(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  const idx = (db.products || []).findIndex((p: any) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = db.products[idx];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
    inStock: req.body.stock !== undefined ? Number(req.body.stock) > 0 : existing.inStock,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    salePrice: req.body.salePrice !== undefined && req.body.salePrice !== '' ? Number(req.body.salePrice) : undefined
  };

  db.products[idx] = updated;
  writeDB(db);
  res.json(updated);
});

app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  const initialLen = (db.products || []).length;
  db.products = (db.products || []).filter((p: any) => p.id !== id);
  if (db.products.length === initialLen) {
    return res.status(404).json({ error: 'Product not found' });
  }
  writeDB(db);
  res.json({ success: true, message: 'Product removed' });
});

// Categories
app.get('/api/categories', (req: Request, res: Response) => {
  const db = readDB();
  const categories = (db.categories || []).map((cat: any) => {
    const count = (db.products || []).filter((p: any) => p.category === cat.slug).length;
    return { ...cat, itemCount: count };
  });
  res.json(categories);
});

app.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const newCat = {
    id: `cat-${Date.now()}`,
    ...req.body,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
  db.categories = [...(db.categories || []), newCat];
  writeDB(db);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  const idx = (db.categories || []).findIndex((c: any) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Category not found' });
  db.categories[idx] = { ...db.categories[idx], ...req.body };
  writeDB(db);
  res.json(db.categories[idx]);
});

app.delete('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  db.categories = (db.categories || []).filter((c: any) => c.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Brands
app.get('/api/brands', (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.brands || []);
});

app.post('/api/brands', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const newBrand = {
    id: `brand-${Date.now()}`,
    ...req.body,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
  db.brands = [...(db.brands || []), newBrand];
  writeDB(db);
  res.status(201).json(newBrand);
});

app.put('/api/brands/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  const idx = (db.brands || []).findIndex((b: any) => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Brand not found' });
  db.brands[idx] = { ...db.brands[idx], ...req.body };
  writeDB(db);
  res.json(db.brands[idx]);
});

app.delete('/api/brands/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  db.brands = (db.brands || []).filter((b: any) => b.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Orders
app.get('/api/orders', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const orders = [...(db.orders || [])].sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(orders);
});

// Order lookup by Order Number or Phone (Public tracking)
app.get('/api/orders/track', (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Order reference or phone number is required' });
  }

  const cleanQuery = (query as string).trim().toLowerCase().replace(/[\s-]/g, '');
  const db = readDB();
  const found = (db.orders || []).filter((o: any) => {
    const matchNumber = o.orderNumber.toLowerCase().replace(/[\s-]/g, '').includes(cleanQuery);
    const matchPhone = o.phone.toLowerCase().replace(/[\s-]/g, '').includes(cleanQuery);
    return matchNumber || matchPhone;
  });

  if (!found || found.length === 0) {
    return res.status(404).json({ error: 'No matching orders found. Please verify your order number or phone number.' });
  }

  res.json(found);
});

// Create Order (Public Checkout)
app.post('/api/orders', (req: Request, res: Response) => {
  const db = readDB();
  const {
    customerName,
    phone,
    email,
    city,
    address,
    notes,
    paymentMethod,
    paymentReference,
    items,
    couponCode
  } = req.body;

  // Validation
  if (!customerName || !phone || !city || !address) {
    return res.status(400).json({ error: 'Name, mobile phone, city, and delivery address are required.' });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty.' });
  }

  // Stock & Price Validation
  let calculatedSubtotal = 0;
  const verifiedItems: any[] = [];

  for (const item of items) {
    const product = (db.products || []).find((p: any) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product "${item.name}" is no longer available.` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for "${product.name}". Only ${product.stock} units remaining.`
      });
    }

    const itemPrice = product.salePrice || product.price;
    calculatedSubtotal += itemPrice * item.quantity;

    // Deduct stock
    product.stock -= item.quantity;
    if (product.stock <= 0) {
      product.inStock = false;
    }

    verifiedItems.push({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price: itemPrice,
      flavor: item.flavor || '',
      weight: item.weight || product.weight,
      quantity: item.quantity
    });
  }

  // Calculate Shipping
  const settings = db.settings || {};
  const freeThreshold = settings.shipping?.freeShippingThreshold || 5000;
  const standardFee = settings.shipping?.standardRate || 350;
  const shippingFee = calculatedSubtotal >= freeThreshold ? 0 : standardFee;

  // Calculate Coupon Discount
  let discount = 0;
  if (couponCode) {
    const coupon = (db.coupons || []).find(
      (c: any) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive
    );
    if (coupon && calculatedSubtotal >= (coupon.minSpend || 0)) {
      if (coupon.discountType === 'percentage') {
        discount = Math.round((calculatedSubtotal * coupon.discountValue) / 100);
      } else {
        discount = Math.min(coupon.discountValue, calculatedSubtotal);
      }
      coupon.usageCount = (coupon.usageCount || 0) + 1;
    }
  }

  const total = Math.max(0, calculatedSubtotal + shippingFee - discount);

  // Generate unique Order Number
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `NP-2026-${randomSuffix}`;

  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customerName: customerName.trim(),
    phone: phone.trim(),
    email: (email || '').trim(),
    city: city.trim(),
    address: address.trim(),
    notes: (notes || '').trim(),
    paymentMethod: paymentMethod || 'cod',
    paymentReference: (paymentReference || '').trim(),
    paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Pending',
    orderStatus: 'Pending',
    items: verifiedItems,
    subtotal: calculatedSubtotal,
    shippingFee,
    discount,
    couponCode: couponCode ? couponCode.trim().toUpperCase() : undefined,
    total,
    createdAt: new Date().toISOString()
  };

  db.orders = [newOrder, ...(db.orders || [])];
  writeDB(db);

  res.status(201).json(newOrder);
});

// Update Order Status (Admin)
app.put('/api/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  const { orderStatus, paymentStatus } = req.body;

  const order = (db.orders || []).find((o: any) => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();

  writeDB(db);
  res.json(order);
});

// Delete Order (Admin)
app.delete('/api/orders/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  db.orders = (db.orders || []).filter((o: any) => o.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Coupon Validation
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code required' });

  const db = readDB();
  const coupon = (db.coupons || []).find(
    (c: any) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
  );

  if (!coupon) {
    return res.status(404).json({ error: 'Invalid or expired coupon code' });
  }

  const minSpend = coupon.minSpend || 0;
  if (subtotal < minSpend) {
    return res.status(400).json({
      error: `Minimum order of PKR ${minSpend.toLocaleString()} required to use this code.`
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
  } else {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  res.json({
    valid: true,
    code: coupon.code,
    discount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue
  });
});

app.get('/api/coupons', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.coupons || []);
});

app.post('/api/coupons', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const newCoupon = {
    id: `coup-${Date.now()}`,
    code: req.body.code.trim().toUpperCase(),
    discountType: req.body.discountType || 'percentage',
    discountValue: Number(req.body.discountValue) || 10,
    minSpend: Number(req.body.minSpend) || 0,
    isActive: true,
    usageCount: 0
  };
  db.coupons = [...(db.coupons || []), newCoupon];
  writeDB(db);
  res.status(201).json(newCoupon);
});

app.delete('/api/coupons/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  db.coupons = (db.coupons || []).filter((c: any) => c.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Reviews
app.get('/api/reviews', (req: Request, res: Response) => {
  const db = readDB();
  const { productId, all } = req.query;
  let reviews = db.reviews || [];

  if (all !== 'true') {
    reviews = reviews.filter((r: any) => r.status === 'approved');
  }

  if (productId) {
    reviews = reviews.filter((r: any) => r.productId === productId);
  }

  res.json(reviews);
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { productId, customerName, rating, headline, comment } = req.body;
  if (!productId || !customerName || !rating || !comment) {
    return res.status(400).json({ error: 'Customer name, rating, and feedback are required.' });
  }

  const db = readDB();
  const product = (db.products || []).find((p: any) => p.id === productId);

  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    productName: product ? product.name : 'Nautilus Supplement',
    customerName: customerName.trim(),
    rating: Number(rating) || 5,
    headline: (headline || '').trim() || 'Verified Performance Review',
    comment: comment.trim(),
    date: new Date().toISOString().split('T')[0],
    verifiedPurchase: true,
    status: 'approved' // Automatically published with moderation safeguard
  };

  db.reviews = [newReview, ...(db.reviews || [])];

  // Recalculate product rating
  if (product) {
    const prodReviews = db.reviews.filter((r: any) => r.productId === productId && r.status === 'approved');
    const avg = prodReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / prodReviews.length;
    product.rating = Number(avg.toFixed(1));
    product.reviewCount = prodReviews.length;
  }

  writeDB(db);
  res.status(201).json(newReview);
});

app.put('/api/reviews/:id/status', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  const { status } = req.body;
  const rev = (db.reviews || []).find((r: any) => r.id === id);
  if (!rev) return res.status(404).json({ error: 'Review not found' });
  rev.status = status;
  writeDB(db);
  res.json(rev);
});

app.delete('/api/reviews/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  const id = req.params.id;
  db.reviews = (db.reviews || []).filter((r: any) => r.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Newsletter
app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const db = readDB();
  const cleanEmail = email.trim().toLowerCase();
  const exists = (db.subscribers || []).some((s: any) => s.email === cleanEmail);

  if (exists) {
    return res.json({ success: true, message: 'You are already subscribed to Nautilus updates.' });
  }

  db.subscribers = [...(db.subscribers || []), { id: `sub-${Date.now()}`, email: cleanEmail, createdAt: new Date().toISOString() }];
  writeDB(db);
  res.json({ success: true, message: 'Thank you for subscribing to Nautilus VIP notifications.' });
});

app.get('/api/newsletter', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.subscribers || []);
});

// Settings
app.get('/api/settings', (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.settings || {});
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json(db.settings);
});

// SEO & Crawlers: robots.txt and sitemap.xml
app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://nautilusprotein.pk/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const db = readDB();
  const products = db.products || [];
  const categories = db.categories || [];

  const staticUrls = [
    'https://nautilusprotein.pk/',
    'https://nautilusprotein.pk/shop',
    'https://nautilusprotein.pk/about',
    'https://nautilusprotein.pk/contact',
    'https://nautilusprotein.pk/faqs',
    'https://nautilusprotein.pk/track',
    'https://nautilusprotein.pk/privacy-policy',
    'https://nautilusprotein.pk/terms',
    'https://nautilusprotein.pk/shipping-policy',
    'https://nautilusprotein.pk/refund-policy'
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const url of staticUrls) {
    xml += `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  for (const cat of categories) {
    xml += `  <url>\n    <loc>https://nautilusprotein.pk/category/${cat.slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  for (const prod of products) {
    xml += `  <url>\n    <loc>https://nautilusprotein.pk/product/${prod.slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  }

  xml += `</urlset>`;
  res.type('application/xml');
  res.send(xml);
});

// Vite Integration & Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Nautilus Protein server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
