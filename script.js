/**
 * ============================================================================
 * SMARTMART – INTEGRATED RETAIL MANAGEMENT SYSTEM
 * Core Application Logic, State Management, POS Billing & Reporting
 * Git Lab 6 Project Submission
 * ============================================================================
 */

// Global App Namespace & State Container
const SmartMart = {
  // LocalStorage Keys
  KEYS: {
    PRODUCTS: 'smartmart_products',
    CATEGORIES: 'smartmart_categories',
    SUPPLIERS: 'smartmart_suppliers',
    PURCHASE_ORDERS: 'smartmart_purchase_orders',
    CUSTOMERS: 'smartmart_customers',
    SALES: 'smartmart_sales',
    STOCK_MOVEMENTS: 'smartmart_stock_movements',
    LOYALTY_LEDGER: 'smartmart_loyalty_ledger',
    SETTINGS: 'smartmart_settings',
    ROLE: 'smartmart_role'
  },

  // Active Runtime State
  state: {
    currentRole: 'admin', // admin | manager | cashier | inventory
    activeView: 'dashboard',
    cart: [],
    selectedCustomer: null,
    redeemPoints: false,
    orderDiscountPct: 0,
    audioEnabled: true,
    paymentMethod: 'Cash',
    isCheckingOut: false,
    analyticsFilter: 'all',
    charts: {} // Chart.js instances
  }
};

/* ============================================================================
   1. SEED DATA & STORAGE LAYER
   ============================================================================ */
const StorageManager = {
  get(key, fallback = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return fallback;
    }
  },

  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.error(`Error saving ${key} to localStorage:`, e);
      return false;
    }
  },

  initDatabase() {
    if (!localStorage.getItem(SmartMart.KEYS.PRODUCTS)) {
      this.seedInitialData();
    }
  },

  seedInitialData() {
    console.log('[SmartMart] Seeding realistic supermarket demonstration database...');

    const categories = [
      'Dairy & Eggs',
      'Bakery & Bread',
      'Fresh Produce',
      'Pantry & Staples',
      'Beverages',
      'Snacks & Confectionery',
      'Household & Cleaning',
      'Personal Care'
    ];

    const suppliers = [
      {
        id: 'SUP-01',
        name: 'Amul Dairy Supplies Pvt Ltd',
        contact: 'Rajesh Sharma',
        phone: '+91 98111 22334',
        email: 'orders@amuldairy.demo',
        address: 'Sector 18, Industrial Area, Anand',
        categories: 'Dairy & Eggs, Beverages',
        status: 'Active'
      },
      {
        id: 'SUP-02',
        name: 'Britannia & Modern Bakers Hub',
        contact: 'Sunita Rao',
        phone: '+91 98222 33445',
        email: 'supply@britannia-demo.com',
        address: 'Bakehouse Road, Whitefield',
        categories: 'Bakery & Bread, Snacks & Confectionery',
        status: 'Active'
      },
      {
        id: 'SUP-03',
        name: 'ITC FMCG & Staples Distributors',
        contact: 'Manoj Verma',
        phone: '+91 98333 44556',
        email: 'logistics@itcdist.demo',
        address: 'Warehouse Hub 4, Ring Road',
        categories: 'Pantry & Staples, Personal Care',
        status: 'Active'
      },
      {
        id: 'SUP-04',
        name: 'Organic Greens & Produce Mandi',
        contact: 'Ramesh Patel',
        phone: '+91 98444 55667',
        email: 'fresh@organicgreens.demo',
        address: 'Kisan Market Yard, Gate 2',
        categories: 'Fresh Produce',
        status: 'Active'
      },
      {
        id: 'SUP-05',
        name: 'Hindustan Unilever Retail Logistics',
        contact: 'Deepak Nayak',
        phone: '+91 98555 66778',
        email: 'dispatch@hul-retail.demo',
        address: 'Logistics Park, Phase 1',
        categories: 'Household & Cleaning, Personal Care',
        status: 'Active'
      }
    ];

    // 22 realistic supermarket products with SKUs, barcodes, costs, prices, safety thresholds
    const products = [
      {
        id: 'PRD-1001',
        sku: 'DAI-MILK-500',
        barcode: '890103001',
        name: 'Amul Taaza Homogenised Toned Milk 500ml',
        category: 'Dairy & Eggs',
        supplier: 'Amul Dairy Supplies Pvt Ltd',
        cost: 24.00,
        price: 28.00,
        stock: 35,
        minStock: 15,
        expiry: '2026-11-20',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1002',
        sku: 'DAI-BUTR-100',
        barcode: '890103002',
        name: 'Amul Pasteurized Salted Butter 100g',
        category: 'Dairy & Eggs',
        supplier: 'Amul Dairy Supplies Pvt Ltd',
        cost: 48.00,
        price: 58.00,
        stock: 18,
        minStock: 10,
        expiry: '2026-12-15',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1003',
        sku: 'DAI-CHSE-200',
        barcode: '890103003',
        name: 'Amul Cheese Slices 200g (10 Slices)',
        category: 'Dairy & Eggs',
        supplier: 'Amul Dairy Supplies Pvt Ltd',
        cost: 110.00,
        price: 135.00,
        stock: 8, // Low Stock trigger
        minStock: 10,
        expiry: '2026-12-30',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1004',
        sku: 'DAI-EGGS-006',
        barcode: '890103004',
        name: 'Farm Fresh White Table Eggs (Pack of 6)',
        category: 'Dairy & Eggs',
        supplier: 'Amul Dairy Supplies Pvt Ltd',
        cost: 38.00,
        price: 48.00,
        stock: 25,
        minStock: 12,
        expiry: '2026-11-05',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1005',
        sku: 'BAK-BRD-400',
        barcode: '890105881',
        name: 'Britannia 100% Whole Wheat Bread 400g',
        category: 'Bakery & Bread',
        supplier: 'Britannia & Modern Bakers Hub',
        cost: 35.00,
        price: 45.00,
        stock: 6, // Low stock trigger
        minStock: 10,
        expiry: '2026-10-30',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1006',
        sku: 'BAK-RUSK-200',
        barcode: '890105882',
        name: 'Britannia Premium Toastee Elaichi Rusk 200g',
        category: 'Bakery & Bread',
        supplier: 'Britannia & Modern Bakers Hub',
        cost: 30.00,
        price: 40.00,
        stock: 28,
        minStock: 10,
        expiry: '2027-02-15',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1007',
        sku: 'BAK-BUNS-002',
        barcode: '890105883',
        name: 'Modern Soft Burger Buns (Pack of 2)',
        category: 'Bakery & Bread',
        supplier: 'Britannia & Modern Bakers Hub',
        cost: 18.00,
        price: 25.00,
        stock: 0, // OUT OF STOCK Trigger
        minStock: 8,
        expiry: '2026-10-28',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1008',
        sku: 'PAN-RICE-005',
        barcode: '890102001',
        name: 'India Gate Basmati Rice Feast Rozzana 5kg',
        category: 'Pantry & Staples',
        supplier: 'ITC FMCG & Staples Distributors',
        cost: 390.00,
        price: 475.00,
        stock: 22,
        minStock: 8,
        expiry: '2027-08-30',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1009',
        sku: 'PAN-ATTA-005',
        barcode: '890102002',
        name: 'Aashirvaad Shudh Chakki Atta 5kg',
        category: 'Pantry & Staples',
        supplier: 'ITC FMCG & Staples Distributors',
        cost: 210.00,
        price: 255.00,
        stock: 30,
        minStock: 10,
        expiry: '2027-04-10',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1010',
        sku: 'PAN-OIL-1000',
        barcode: '890102003',
        name: 'Fortune Sunlite Refined Sunflower Oil 1L Pouch',
        category: 'Pantry & Staples',
        supplier: 'ITC FMCG & Staples Distributors',
        cost: 115.00,
        price: 138.00,
        stock: 45,
        minStock: 15,
        expiry: '2027-06-20',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1011',
        sku: 'PAN-SUGR-001',
        barcode: '890102004',
        name: 'Madhur Pure & Hygienic Refined Sugar 1kg',
        category: 'Pantry & Staples',
        supplier: 'ITC FMCG & Staples Distributors',
        cost: 44.00,
        price: 54.00,
        stock: 4, // Low Stock trigger
        minStock: 15,
        expiry: '2027-10-01',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1012',
        sku: 'PAN-SALT-001',
        barcode: '890102005',
        name: 'Tata Salt Vacuum Evaporated Iodised Salt 1kg',
        category: 'Pantry & Staples',
        supplier: 'ITC FMCG & Staples Distributors',
        cost: 22.00,
        price: 28.00,
        stock: 60,
        minStock: 20,
        expiry: '2028-01-01',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1013',
        sku: 'BEV-TEA-250',
        barcode: '890106001',
        name: 'Tata Tea Gold Rich Taste & Aroma 250g',
        category: 'Beverages',
        supplier: 'ITC FMCG & Staples Distributors',
        cost: 115.00,
        price: 140.00,
        stock: 20,
        minStock: 10,
        expiry: '2027-07-15',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1014',
        sku: 'BEV-COFF-050',
        barcode: '890106002',
        name: 'Nescafe Classic Instant Coffee Jar 50g',
        category: 'Beverages',
        supplier: 'ITC FMCG & Staples Distributors',
        cost: 145.00,
        price: 175.00,
        stock: 14,
        minStock: 8,
        expiry: '2027-09-10',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1015',
        sku: 'SNC-ORIO-120',
        barcode: '890104001',
        name: 'Cadbury Oreo Original Vanilla Sandwich Biscuits 120g',
        category: 'Snacks & Confectionery',
        supplier: 'Britannia & Modern Bakers Hub',
        cost: 28.00,
        price: 35.00,
        stock: 40,
        minStock: 15,
        expiry: '2027-03-01',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1016',
        sku: 'SNC-LAYS-050',
        barcode: '890104002',
        name: "Lay's India's Magic Masala Potato Chips 50g",
        category: 'Snacks & Confectionery',
        supplier: 'Britannia & Modern Bakers Hub',
        cost: 16.00,
        price: 20.00,
        stock: 55,
        minStock: 20,
        expiry: '2026-12-10',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1017',
        sku: 'HOU-SURF-001',
        barcode: '890107001',
        name: 'Surf Excel Easy Wash Detergent Powder 1kg',
        category: 'Household & Cleaning',
        supplier: 'Hindustan Unilever Retail Logistics',
        cost: 110.00,
        price: 135.00,
        stock: 26,
        minStock: 10,
        expiry: '2028-05-15',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1018',
        sku: 'HOU-VIML-500',
        barcode: '890107002',
        name: 'Vim Dishwash Liquid Gel Lemon Bottle 500ml',
        category: 'Household & Cleaning',
        supplier: 'Hindustan Unilever Retail Logistics',
        cost: 95.00,
        price: 118.00,
        stock: 19,
        minStock: 10,
        expiry: '2028-03-20',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1019',
        sku: 'PER-DOVE-100',
        barcode: '890108001',
        name: 'Dove Cream Beauty Bathing Bar Soap 100g',
        category: 'Personal Care',
        supplier: 'Hindustan Unilever Retail Logistics',
        cost: 45.00,
        price: 56.00,
        stock: 32,
        minStock: 12,
        expiry: '2028-01-10',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1020',
        sku: 'PER-COLG-150',
        barcode: '890108002',
        name: 'Colgate Strong Teeth Dental Cream Toothpaste 150g',
        category: 'Personal Care',
        supplier: 'Hindustan Unilever Retail Logistics',
        cost: 72.00,
        price: 90.00,
        stock: 22,
        minStock: 10,
        expiry: '2027-11-20',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1021',
        sku: 'FSH-APPL-001',
        barcode: '890109001',
        name: 'Fresh Washington Red Delicious Apples 1kg',
        category: 'Fresh Produce',
        supplier: 'Organic Greens & Produce Mandi',
        cost: 140.00,
        price: 180.00,
        stock: 15,
        minStock: 5,
        expiry: '2026-10-31',
        status: 'ACTIVE'
      },
      {
        id: 'PRD-1022',
        sku: 'DAI-YOGT-EXP',
        barcode: '890103999',
        name: 'Nestle Sweet Dahi Creamy Cup 200g (Sample Expired Item)',
        category: 'Dairy & Eggs',
        supplier: 'Amul Dairy Supplies Pvt Ltd',
        cost: 20.00,
        price: 30.00,
        stock: 5,
        minStock: 5,
        expiry: '2026-10-15', // EXPIRED Trigger
        status: 'ACTIVE'
      }
    ];

    const customers = [
      {
        id: 'CUST-001',
        name: 'Rahul Sharma',
        phone: '9876543210',
        email: 'rahul.sharma@gmail.demo',
        points: 45,
        totalSpend: 4500.00,
        joinedDate: '2026-08-10'
      },
      {
        id: 'CUST-002',
        name: 'Priya Patel',
        phone: '9812345678',
        email: 'priya.patel@outlook.demo',
        points: 82,
        totalSpend: 8250.00,
        joinedDate: '2026-08-15'
      },
      {
        id: 'CUST-003',
        name: 'Amit Verma',
        phone: '9823456789',
        email: 'amit.v@yahoo.demo',
        points: 120,
        totalSpend: 12100.00,
        joinedDate: '2026-09-01'
      },
      {
        id: 'CUST-004',
        name: 'Sneha Reddy',
        phone: '9834567890',
        email: 'sneha.r@gmail.demo',
        points: 15,
        totalSpend: 1520.00,
        joinedDate: '2026-09-18'
      },
      {
        id: 'CUST-005',
        name: 'Vikram Singh',
        phone: '9845678901',
        email: 'vikram.singh@corporate.demo',
        points: 60,
        totalSpend: 6050.00,
        joinedDate: '2026-10-02'
      }
    ];

    // Seed realistic past sales so analytics and recent transactions are populated immediately
    const sales = [
      {
        invoiceNumber: 'INV-2026-0001',
        timestamp: '2026-10-25 11:20:15',
        customerId: 'CUST-001',
        customerName: 'Rahul Sharma',
        items: [
          { id: 'PRD-1001', name: 'Amul Taaza Homogenised Toned Milk 500ml', price: 28, qty: 2, total: 56 },
          { id: 'PRD-1005', name: 'Britannia 100% Whole Wheat Bread 400g', price: 45, qty: 1, total: 45 },
          { id: 'PRD-1015', name: 'Cadbury Oreo Original Vanilla Sandwich Biscuits 120g', price: 35, qty: 2, total: 70 }
        ],
        subtotal: 171.00,
        tax: 8.55,
        discount: 0,
        pointsRedeemed: 0,
        grandTotal: 179.55,
        paymentMethod: 'UPI',
        amountTendered: 179.55,
        changeDue: 0,
        pointsEarned: 1,
        cashier: 'Harsh (Administrator)'
      },
      {
        invoiceNumber: 'INV-2026-0002',
        timestamp: '2026-10-25 14:45:00',
        customerId: 'CUST-002',
        customerName: 'Priya Patel',
        items: [
          { id: 'PRD-1008', name: 'India Gate Basmati Rice Feast Rozzana 5kg', price: 475, qty: 1, total: 475 },
          { id: 'PRD-1010', name: 'Fortune Sunlite Refined Sunflower Oil 1L Pouch', price: 138, qty: 2, total: 276 },
          { id: 'PRD-1012', name: 'Tata Salt Vacuum Evaporated Iodised Salt 1kg', price: 28, qty: 1, total: 28 }
        ],
        subtotal: 779.00,
        tax: 38.95,
        discount: 20.00,
        pointsRedeemed: 20,
        grandTotal: 797.95,
        paymentMethod: 'Card',
        amountTendered: 797.95,
        changeDue: 0,
        pointsEarned: 7,
        cashier: 'Harsh (Administrator)'
      },
      {
        invoiceNumber: 'INV-2026-0003',
        timestamp: '2026-10-24 18:10:40',
        customerId: null,
        customerName: 'Guest Patron',
        items: [
          { id: 'PRD-1017', name: 'Surf Excel Easy Wash Detergent Powder 1kg', price: 135, qty: 1, total: 135 },
          { id: 'PRD-1018', name: 'Vim Dishwash Liquid Gel Lemon Bottle 500ml', price: 118, qty: 1, total: 118 },
          { id: 'PRD-1019', name: 'Dove Cream Beauty Bathing Bar Soap 100g', price: 56, qty: 2, total: 112 }
        ],
        subtotal: 365.00,
        tax: 18.25,
        discount: 0,
        pointsRedeemed: 0,
        grandTotal: 383.25,
        paymentMethod: 'Cash',
        amountTendered: 500.00,
        changeDue: 116.75,
        pointsEarned: 0,
        cashier: 'Ananya Sen (Cashier)'
      },
      {
        invoiceNumber: 'INV-2026-0004',
        timestamp: '2026-10-23 16:30:10',
        customerId: 'CUST-003',
        customerName: 'Amit Verma',
        items: [
          { id: 'PRD-1009', name: 'Aashirvaad Shudh Chakki Atta 5kg', price: 255, qty: 2, total: 510 },
          { id: 'PRD-1013', name: 'Tata Tea Gold Rich Taste & Aroma 250g', price: 140, qty: 1, total: 140 },
          { id: 'PRD-1014', name: 'Nescafe Classic Instant Coffee Jar 50g', price: 175, qty: 1, total: 175 }
        ],
        subtotal: 825.00,
        tax: 41.25,
        discount: 0,
        pointsRedeemed: 0,
        grandTotal: 866.25,
        paymentMethod: 'UPI',
        amountTendered: 866.25,
        changeDue: 0,
        pointsEarned: 8,
        cashier: 'Harsh (Administrator)'
      }
    ];

    const purchaseOrders = [
      {
        poNumber: 'PO-2026-101',
        supplierId: 'SUP-01',
        supplierName: 'Amul Dairy Supplies Pvt Ltd',
        orderDate: '2026-10-20',
        expectedDate: '2026-10-22',
        items: [
          { id: 'PRD-1001', name: 'Amul Taaza Homogenised Toned Milk 500ml', qty: 50, cost: 24.00, lineTotal: 1200.00 },
          { id: 'PRD-1002', name: 'Amul Pasteurized Salted Butter 100g', qty: 20, cost: 48.00, lineTotal: 960.00 }
        ],
        totalAmount: 2160.00,
        status: 'Received',
        receivedDate: '2026-10-22'
      },
      {
        poNumber: 'PO-2026-102',
        supplierId: 'SUP-03',
        supplierName: 'ITC FMCG & Staples Distributors',
        orderDate: '2026-10-24',
        expectedDate: '2026-10-27',
        items: [
          { id: 'PRD-1011', name: 'Madhur Pure & Hygienic Refined Sugar 1kg', qty: 40, cost: 44.00, lineTotal: 1760.00 }
        ],
        totalAmount: 1760.00,
        status: 'Pending',
        receivedDate: null
      }
    ];

    const stockMovements = [
      {
        timestamp: '2026-10-22 10:15:00',
        productId: 'PRD-1001',
        productName: 'Amul Taaza Homogenised Toned Milk 500ml',
        type: 'PO_RECEIPT',
        quantity: 50,
        beforeStock: 5,
        afterStock: 55,
        reason: 'Received against PO-2026-101',
        userRole: 'Administrator'
      },
      {
        timestamp: '2026-10-25 11:20:15',
        productId: 'PRD-1001',
        productName: 'Amul Taaza Homogenised Toned Milk 500ml',
        type: 'SALE_DEDUCTION',
        quantity: -2,
        beforeStock: 37,
        afterStock: 35,
        reason: 'POS Sale INV-2026-0001',
        userRole: 'Cashier'
      }
    ];

    const loyaltyLedger = [
      {
        timestamp: '2026-10-25 11:20:15',
        customerId: 'CUST-001',
        customerName: 'Rahul Sharma',
        type: 'CREDIT',
        points: 1,
        reference: 'Invoice INV-2026-0001'
      },
      {
        timestamp: '2026-10-25 14:45:00',
        customerId: 'CUST-002',
        customerName: 'Priya Patel',
        type: 'DEBIT',
        points: -20,
        reference: 'Redemption in INV-2026-0002'
      },
      {
        timestamp: '2026-10-25 14:45:00',
        customerId: 'CUST-002',
        customerName: 'Priya Patel',
        type: 'CREDIT',
        points: 7,
        reference: 'Earned in INV-2026-0002'
      }
    ];

    const settings = {
      storeName: 'SmartMart Supermarket',
      storeAddress: '#12, Commercial Road, Central District',
      storePhone: '+91 98765 43210',
      storeGst: '29ABCDE1234F1Z5',
      taxRate: 5.0,
      currencySymbol: '₹',
      loyaltySpendRatio: 100,
      loyaltyRedemptionVal: 1.0
    };

    this.set(SmartMart.KEYS.CATEGORIES, categories);
    this.set(SmartMart.KEYS.SUPPLIERS, suppliers);
    this.set(SmartMart.KEYS.PRODUCTS, products);
    this.set(SmartMart.KEYS.CUSTOMERS, customers);
    this.set(SmartMart.KEYS.SALES, sales);
    this.set(SmartMart.KEYS.PURCHASE_ORDERS, purchaseOrders);
    this.set(SmartMart.KEYS.STOCK_MOVEMENTS, stockMovements);
    this.set(SmartMart.KEYS.LOYALTY_LEDGER, loyaltyLedger);
    this.set(SmartMart.KEYS.SETTINGS, settings);
    this.set(SmartMart.KEYS.ROLE, 'admin');

    console.log('[SmartMart] Database initialized with 22 products and seed records.');
  }
};

/* ============================================================================
   2. AUDIO SYNTHESIZER (WEB AUDIO API) & UI MANAGERS
   ============================================================================ */
const AudioManager = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  beep() {
    if (!SmartMart.state.audioEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  },
  chime() {
    if (!SmartMart.state.audioEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch (e) {}
  }
};

const UIManager = {
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  confirm(title, message, onConfirmCallback) {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;

    const yesBtn = document.getElementById('confirm-modal-yes-btn');
    const newYesBtn = yesBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);

    newYesBtn.addEventListener('click', () => {
      this.closeModal('confirm-modal');
      if (typeof onConfirmCallback === 'function') onConfirmCallback();
    });

    this.openModal('confirm-modal');
  },

  formatCurrency(amount) {
    const settings = StorageManager.get(SmartMart.KEYS.SETTINGS, { currencySymbol: '₹' });
    const sym = settings.currencySymbol || '₹';
    const num = Number(amount) || 0;
    return `${sym}${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  isExpired(expiryDate) {
    if (!expiryDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return expiryDate < today;
  }
};

/* ============================================================================
   3. MAIN APPLICATION ORCHESTRATOR & NAVIGATION
   ============================================================================ */
const App = {
  init() {
    StorageManager.initDatabase();
    this.bindGlobalEvents();
    this.setupRoleManagement();
    this.refreshAllAlerts();
    this.startLiveClock();
    this.switchView('dashboard');
  },

  startLiveClock() {
    const clockElem = document.getElementById('header-live-clock');
    if (!clockElem) return;
    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      clockElem.innerHTML = `<i class="fa-regular fa-clock"></i> ${timeStr}`;
    };
    update();
    setInterval(update, 1000);
  },

  bindGlobalEvents() {
    // Sidebar Navigation Click Handling
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        this.switchView(view);

        // Auto close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('active');
      });
    });

    // Mobile Sidebar Toggles
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const overlay = document.getElementById('sidebar-overlay');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          document.getElementById('sidebar').classList.add('open');
          overlay.classList.add('active');
        } else {
          document.body.classList.toggle('sidebar-collapsed');
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    // Modal Close Buttons (data-close-modal attribute)
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        UIManager.closeModal(modalId);
      });
    });

    // Quick POS Button in Header
    const quickPosBtn = document.getElementById('header-quick-pos-btn');
    if (quickPosBtn) {
      quickPosBtn.addEventListener('click', () => this.switchView('pos'));
    }

    // Notification Dropdown Toggle
    const notifBtn = document.getElementById('notification-btn');
    const notifDropdown = document.getElementById('notification-dropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.style.display = notifDropdown.style.display === 'block' ? 'none' : 'block';
      });

      document.addEventListener('click', () => {
        notifDropdown.style.display = 'none';
      });

      notifDropdown.addEventListener('click', (e) => e.stopPropagation());
    }

    const viewInvAlertsBtn = document.getElementById('view-inventory-alerts-btn');
    if (viewInvAlertsBtn) {
      viewInvAlertsBtn.addEventListener('click', () => {
        notifDropdown.style.display = 'none';
        this.switchView('inventory');
        document.getElementById('inv-status-filter').value = 'LOW_STOCK';
        ProductsModule.filterAndRender();
      });
    }

    // Global Search Bar in Header
    this.setupGlobalSearch();

    // Fast POS Keyboard Shortcuts (F2: Scan focus, F4: Checkout, Esc: Close modals)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        if (SmartMart.state.activeView !== 'pos') {
          this.switchView('pos');
        }
        const barcodeInput = document.getElementById('pos-barcode-input');
        if (barcodeInput) {
          barcodeInput.focus();
          barcodeInput.select();
        }
      } else if (e.key === 'F4') {
        e.preventDefault();
        const completeBtn = document.getElementById('pos-complete-sale-btn');
        if (completeBtn && !completeBtn.disabled && !SmartMart.state.isCheckingOut) {
          POSModule.processCheckout();
        }
      } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          modal.classList.remove('active');
        });
      }
    });
  },

  switchView(viewName) {
    // Role Permissions Gate
    if (!this.checkRolePermission(viewName)) {
      UIManager.showToast(`Access Restricted: Active role (${SmartMart.state.currentRole}) lacks privilege for this section.`, 'warning');
      return;
    }

    SmartMart.state.activeView = viewName;

    // Update active nav link
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update view containers
    document.querySelectorAll('.content-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add('active');

    // Update page title
    const titles = {
      dashboard: 'Store Dashboard & Overview',
      pos: 'Point of Sale (POS) Billing',
      inventory: 'Products & Inventory Management',
      suppliers: 'Suppliers & Purchase Orders',
      customers: 'Customers & Loyalty Program',
      analytics: 'Sales Analytics & Reports',
      staff: 'Staff & Role Management (RBAC)',
      settings: 'System Settings & Data Management'
    };
    document.getElementById('page-title').textContent = titles[viewName] || 'Retail OS';

    // Trigger module initializations
    if (viewName === 'dashboard') DashboardModule.render();
    if (viewName === 'pos') POSModule.init();
    if (viewName === 'inventory') ProductsModule.init();
    if (viewName === 'suppliers') SuppliersModule.init();
    if (viewName === 'customers') CustomersModule.init();
    if (viewName === 'analytics') AnalyticsModule.init();
    if (viewName === 'settings') SettingsModule.init();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setupRoleManagement() {
    const roleSelect = document.getElementById('role-select');
    const storedRole = StorageManager.get(SmartMart.KEYS.ROLE, 'admin');
    SmartMart.state.currentRole = storedRole;
    if (roleSelect) roleSelect.value = storedRole;

    this.updateRoleUI(storedRole);

    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        this.switchRole(e.target.value);
      });
    }
  },

  switchRole(role) {
    SmartMart.state.currentRole = role;
    StorageManager.set(SmartMart.KEYS.ROLE, role);
    const roleSelect = document.getElementById('role-select');
    if (roleSelect) roleSelect.value = role;

    this.updateRoleUI(role);
    UIManager.showToast(`Switched active demonstration role to: ${role.toUpperCase()}`, 'info');

    // If currently on a forbidden view, redirect to dashboard or pos
    if (!this.checkRolePermission(SmartMart.state.activeView)) {
      this.switchView(role === 'cashier' ? 'pos' : 'dashboard');
    }
  },

  updateRoleUI(role) {
    const roleNames = {
      admin: 'Administrator',
      manager: 'Store Manager',
      cashier: 'Cashier',
      inventory: 'Inventory Staff'
    };

    const roleIcons = {
      admin: 'fa-user-shield',
      manager: 'fa-user-tie',
      cashier: 'fa-cash-register',
      inventory: 'fa-boxes-stacked'
    };

    document.getElementById('sidebar-role-name').textContent = roleNames[role] || role;
    const roleIconElem = document.getElementById('sidebar-role-icon');
    if (roleIconElem) {
      roleIconElem.className = `fa-solid ${roleIcons[role] || 'fa-user'}`;
    }

    const banner = document.getElementById('role-alert-banner');
    const bannerText = document.getElementById('role-alert-text');
    if (role !== 'admin' && banner && bannerText) {
      banner.style.display = 'flex';
      bannerText.textContent = `Demo Role Active: ${roleNames[role]}. Certain operational actions are restricted according to business rules.`;
    } else if (banner) {
      banner.style.display = 'none';
    }
  },

  checkRolePermission(viewName) {
    const role = SmartMart.state.currentRole;
    if (role === 'admin') return true;

    if (role === 'manager') {
      return ['dashboard', 'pos', 'inventory', 'suppliers', 'customers', 'analytics', 'staff'].includes(viewName);
    }

    if (role === 'cashier') {
      return ['dashboard', 'pos', 'customers', 'staff'].includes(viewName);
    }

    if (role === 'inventory') {
      return ['dashboard', 'inventory', 'suppliers', 'staff'].includes(viewName);
    }

    return true;
  },

  refreshAllAlerts() {
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    let lowStockCount = 0;
    let expiredCount = 0;
    const alertsList = [];

    products.forEach(p => {
      const isExp = UIManager.isExpired(p.expiry);
      const isLow = p.stock <= p.minStock;

      if (isExp) {
        expiredCount++;
        alertsList.push({
          type: 'expired',
          text: `EXPIRED: ${p.name} (Exp: ${p.expiry})`,
          sku: p.sku
        });
      } else if (isLow) {
        lowStockCount++;
        alertsList.push({
          type: 'low-stock',
          text: `LOW STOCK: ${p.name} (${p.stock} units left, Min: ${p.minStock})`,
          sku: p.sku
        });
      }
    });

    const totalAlerts = lowStockCount + expiredCount;

    // Header Bell Badge
    const counter = document.getElementById('notification-counter');
    if (counter) {
      if (totalAlerts > 0) {
        counter.textContent = totalAlerts;
        counter.style.display = 'flex';
      } else {
        counter.style.display = 'none';
      }
    }

    // Sidebar Stock Badge
    const sidebarBadge = document.getElementById('sidebar-stock-alert-badge');
    if (sidebarBadge) {
      if (lowStockCount > 0) {
        sidebarBadge.textContent = lowStockCount;
        sidebarBadge.style.display = 'inline-block';
      } else {
        sidebarBadge.style.display = 'none';
      }
    }

    // Dropdown list
    const listElem = document.getElementById('notifications-list');
    const summaryCountElem = document.getElementById('alert-summary-count');
    if (summaryCountElem) {
      summaryCountElem.textContent = `${totalAlerts} urgent warnings`;
    }

    if (listElem) {
      if (alertsList.length === 0) {
        listElem.innerHTML = `<div class="p-3 text-center text-muted" style="padding:1.5rem;font-size:0.85rem;">All stock levels healthy. No urgent alerts.</div>`;
      } else {
        listElem.innerHTML = alertsList.slice(0, 8).map(a => `
          <div class="notification-item ${a.type}">
            <i class="fa-solid ${a.type === 'expired' ? 'fa-triangle-exclamation text-rose' : 'fa-clock-rotate-left text-amber'}"></i>
            <div>
              <div style="font-weight:600;">${a.text}</div>
              <small class="text-muted">SKU: ${a.sku}</small>
            </div>
          </div>
        `).join('');
      }
    }
  },

  setupGlobalSearch() {
    const input = document.getElementById('global-product-search');
    const results = document.getElementById('global-search-results');
    if (!input || !results) return;

    input.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q.length < 2) {
        results.style.display = 'none';
        return;
      }

      const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
      const matches = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q)
      ).slice(0, 5);

      if (matches.length === 0) {
        results.innerHTML = `<div class="search-result-item" style="cursor:default;color:#64748b;">No products found matching "${q}"</div>`;
      } else {
        results.innerHTML = matches.map(m => `
          <div class="search-result-item" data-sku="${m.sku}">
            <div class="search-result-info">
              <span class="search-result-name">${m.name}</span>
              <span class="search-result-sub">SKU: ${m.sku} | Stock: ${m.stock}</span>
            </div>
            <span class="search-result-price">${UIManager.formatCurrency(m.price)}</span>
          </div>
        `).join('');

        results.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const sku = item.getAttribute('data-sku');
            results.style.display = 'none';
            input.value = '';
            // Switch to products view and search for this SKU
            App.switchView('inventory');
            const invSearch = document.getElementById('inv-search-input');
            if (invSearch) {
              invSearch.value = sku;
              ProductsModule.filterAndRender();
            }
          });
        });
      }

      results.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !results.contains(e.target)) {
        results.style.display = 'none';
      }
    });
  }
};

/* ============================================================================
   4. DASHBOARD MODULE
   ============================================================================ */
const DashboardModule = {
  render() {
    this.calculateKPIs();
    this.renderRecentTransactions();
    this.renderStockAlerts();
    this.renderCharts();
    this.bindEvents();
  },

  calculateKPIs() {
    const sales = StorageManager.get(SmartMart.KEYS.SALES, []);
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);

    // Filter today's sales
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.timestamp.startsWith(todayStr));

    const todayRevenue = todaySales.reduce((acc, s) => acc + s.grandTotal, 0);
    const todayTxCount = todaySales.length;

    // Products & Stock calculations
    const activeProducts = products.filter(p => p.status === 'ACTIVE').length;
    const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);

    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStock && !UIManager.isExpired(p.expiry)).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const expiredCount = products.filter(p => UIManager.isExpired(p.expiry)).length;

    document.getElementById('dash-today-sales').textContent = UIManager.formatCurrency(todayRevenue);
    document.getElementById('dash-tx-count').textContent = todayTxCount;
    document.getElementById('dash-active-products').textContent = activeProducts;
    document.getElementById('dash-total-units').textContent = totalUnits;
    document.getElementById('dash-low-stock-count').textContent = lowStockCount;
    document.getElementById('dash-out-stock-count').textContent = outOfStockCount;
    document.getElementById('dash-expired-count').textContent = expiredCount;
  },

  renderRecentTransactions() {
    const sales = StorageManager.get(SmartMart.KEYS.SALES, []);
    const tbody = document.getElementById('dash-recent-sales-tbody');
    if (!tbody) return;

    const recent = sales.slice(-5).reverse();

    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:1.5rem;">No sales recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = recent.map(s => {
      const itemCount = s.items.reduce((sum, item) => sum + item.qty, 0);
      const timeOnly = s.timestamp.split(' ')[1] || s.timestamp;
      return `
        <tr>
          <td><strong>${s.invoiceNumber}</strong></td>
          <td>${timeOnly}</td>
          <td>${itemCount} items</td>
          <td><span class="badge badge-info">${s.paymentMethod}</span></td>
          <td><strong>${UIManager.formatCurrency(s.grandTotal)}</strong></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="POSModule.viewInvoiceReceipt('${s.invoiceNumber}')" title="Print / View Receipt">
              <i class="fa-solid fa-receipt"></i> Receipt
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderStockAlerts() {
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const tbody = document.getElementById('dash-alerts-tbody');
    if (!tbody) return;

    // Filter items with stock <= minStock or expired
    const urgentItems = products.filter(p => p.stock <= p.minStock || UIManager.isExpired(p.expiry)).slice(0, 5);

    if (urgentItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding:1.5rem;">All stock levels optimal.</td></tr>`;
      return;
    }

    tbody.innerHTML = urgentItems.map(p => {
      const isExp = UIManager.isExpired(p.expiry);
      let statusBadge = `<span class="badge badge-warning">Low Stock</span>`;
      if (p.stock === 0) statusBadge = `<span class="badge badge-danger">Out of Stock</span>`;
      if (isExp) statusBadge = `<span class="badge badge-danger">Expired</span>`;

      return `
        <tr>
          <td>
            <strong>${p.name}</strong>
            <div class="text-muted" style="font-size:0.75rem;">${p.category}</div>
          </td>
          <td><code>${p.sku}</code></td>
          <td><strong>${p.stock}</strong> / ${p.minStock}</td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-outline-emerald btn-sm" onclick="ProductsModule.openStockAdjust('${p.id}')">
              <i class="fa-solid fa-arrow-up-right-dots"></i> Adjust
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded. Skipping chart rendering.');
      return;
    }

    // 1. Weekly Sales Trend Chart
    const sales = StorageManager.get(SmartMart.KEYS.SALES, []);
    const last7Days = [];
    const salesByDay = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      last7Days.push({ dateStr, label });
      salesByDay[dateStr] = 0;
    }

    sales.forEach(s => {
      const dStr = s.timestamp.split(' ')[0];
      if (salesByDay[dStr] !== undefined) {
        salesByDay[dStr] += s.grandTotal;
      }
    });

    const trendCtx = document.getElementById('salesTrendChart');
    if (trendCtx) {
      if (SmartMart.state.charts.salesTrend) SmartMart.state.charts.salesTrend.destroy();

      SmartMart.state.charts.salesTrend = new Chart(trendCtx, {
        type: 'bar',
        data: {
          labels: last7Days.map(d => d.label),
          datasets: [{
            label: 'Sales Revenue (₹)',
            data: last7Days.map(d => salesByDay[d.dateStr]),
            backgroundColor: '#10b981',
            borderRadius: 6,
            hoverBackgroundColor: '#047857'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => '₹' + val
              }
            }
          }
        }
      });
    }

    // 2. Category Distribution Doughnut Chart
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + p.stock;
    });

    const catCtx = document.getElementById('categoryDistChart');
    if (catCtx) {
      if (SmartMart.state.charts.categoryDist) SmartMart.state.charts.categoryDist.destroy();

      SmartMart.state.charts.categoryDist = new Chart(catCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(categoryCounts),
          datasets: [{
            data: Object.values(categoryCounts),
            backgroundColor: [
              '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6',
              '#ec4899', '#14b8a6', '#f97316', '#64748b'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  },

  bindEvents() {
    const viewAllBtn = document.getElementById('dash-view-all-sales');
    if (viewAllBtn) {
      viewAllBtn.onclick = () => App.switchView('analytics');
    }

    const quickAddBtn = document.getElementById('dash-quick-add-btn');
    if (quickAddBtn) {
      quickAddBtn.onclick = () => {
        App.switchView('inventory');
        ProductsModule.openAddProductModal();
      };
    }

    const autoPoBtn = document.getElementById('dash-auto-po-btn');
    if (autoPoBtn) {
      autoPoBtn.onclick = () => {
        App.switchView('suppliers');
        SuppliersModule.autoDraftLowStockPO();
      };
    }
  }
};

/* ============================================================================
   5. POINT OF SALE (POS) BILLING MODULE
   ============================================================================ */
const POSModule = {
  init() {
    this.renderCategoryPills();
    this.renderCatalog();
    this.renderCustomerDropdown();
    this.renderCart();
    this.bindEvents();
    this.generateNewInvoiceId();
  },

  generateNewInvoiceId() {
    const sales = StorageManager.get(SmartMart.KEYS.SALES, []);
    const nextSeq = String(sales.length + 1).padStart(4, '0');
    const newId = `INV-2026-${nextSeq}`;
    document.getElementById('pos-current-invoice-id').textContent = newId;
    return newId;
  },

  renderCategoryPills() {
    const categories = StorageManager.get(SmartMart.KEYS.CATEGORIES, []);
    const container = document.getElementById('pos-category-pills');
    if (!container) return;

    container.innerHTML = `
      <button class="pill-btn active" data-category="ALL">All Categories</button>
      ${categories.map(c => `<button class="pill-btn" data-category="${c}">${c}</button>`).join('')}
    `;

    container.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderCatalog();
      });
    });
  },

  renderCatalog() {
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const grid = document.getElementById('pos-product-grid');
    if (!grid) return;

    const activeCatBtn = document.querySelector('#pos-category-pills .pill-btn.active');
    const selectedCategory = activeCatBtn ? activeCatBtn.getAttribute('data-category') : 'ALL';
    const searchQuery = (document.getElementById('pos-catalog-search')?.value || '').trim().toLowerCase();

    const filtered = products.filter(p => {
      if (p.status !== 'ACTIVE') return false;
      const matchesCat = (selectedCategory === 'ALL' || p.category === selectedCategory);
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.sku.toLowerCase().includes(searchQuery) ||
        p.barcode.includes(searchQuery);
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #64748b;">
          <i class="fa-solid fa-box-open" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <p>No products found matching the criteria.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const isExp = UIManager.isExpired(p.expiry);
      const isOut = p.stock <= 0;
      let cardClass = 'pos-item-card';
      let stockBadge = `<span class="pos-item-stock-tag text-success">${p.stock} in stock</span>`;

      if (isExp) {
        cardClass += ' expired';
        stockBadge = `<span class="pos-item-stock-tag text-rose"><i class="fa-solid fa-triangle-exclamation"></i> Expired</span>`;
      } else if (isOut) {
        cardClass += ' out-of-stock';
        stockBadge = `<span class="pos-item-stock-tag text-rose">Out of stock</span>`;
      } else if (p.stock <= p.minStock) {
        stockBadge = `<span class="pos-item-stock-tag text-amber">Low (${p.stock} left)</span>`;
      }

      return `
        <div class="${cardClass}" onclick="POSModule.addToCart('${p.id}')">
          <div>
            <span class="pos-item-category">${p.category}</span>
            <h4 class="pos-item-name">${p.name}</h4>
            <span class="pos-item-sku">SKU: ${p.sku}</span>
          </div>
          <div class="pos-item-footer">
            <span class="pos-item-price">${UIManager.formatCurrency(p.price)}</span>
            ${stockBadge}
          </div>
        </div>
      `;
    }).join('');
  },

  renderCustomerDropdown() {
    const customers = StorageManager.get(SmartMart.KEYS.CUSTOMERS, []);
    const select = document.getElementById('pos-customer-select');
    if (!select) return;

    select.innerHTML = `
      <option value="">Guest Walk-in Customer (No points)</option>
      ${customers.map(c => `<option value="${c.id}">${c.name} (${c.phone}) - ${c.points} pts</option>`).join('')}
    `;

    if (SmartMart.state.selectedCustomer) {
      select.value = SmartMart.state.selectedCustomer.id;
    }
  },

  addToCart(productId) {
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const product = products.find(p => p.id === productId);

    if (!product) {
      UIManager.showToast('Product not found.', 'error');
      return;
    }

    // Business Logic: Block Expired products
    if (UIManager.isExpired(product.expiry)) {
      UIManager.showToast(`Cannot sell "${product.name}": Product expired on ${product.expiry}.`, 'error');
      return;
    }

    // Business Logic: Block Out-of-Stock products
    if (product.stock <= 0) {
      UIManager.showToast(`Cannot add "${product.name}": Item is out of stock.`, 'error');
      return;
    }

    const existingIndex = SmartMart.state.cart.findIndex(i => i.id === product.id);

    if (existingIndex > -1) {
      // Check stock limit
      if (SmartMart.state.cart[existingIndex].qty + 1 > product.stock) {
        UIManager.showToast(`Cannot add more units: Only ${product.stock} units currently in stock.`, 'warning');
        return;
      }
      SmartMart.state.cart[existingIndex].qty += 1;
      SmartMart.state.cart[existingIndex].total = SmartMart.state.cart[existingIndex].qty * product.price;
    } else {
      SmartMart.state.cart.push({
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        qty: 1,
        total: product.price
      });
    }

    this.renderCart();
    AudioManager.beep();
    UIManager.showToast(`Added ${product.name} to cart.`, 'success');
  },

  updateCartQty(productId, newQty) {
    const itemIndex = SmartMart.state.cart.findIndex(i => i.id === productId);
    if (itemIndex === -1) return;

    if (newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = SmartMart.state.cart[itemIndex];
    if (newQty > item.stock) {
      UIManager.showToast(`Cannot exceed current stock limit of ${item.stock} units.`, 'warning');
      return;
    }

    item.qty = newQty;
    item.total = item.qty * item.price;
    this.renderCart();
  },

  removeFromCart(productId) {
    SmartMart.state.cart = SmartMart.state.cart.filter(i => i.id !== productId);
    this.renderCart();
  },

  clearCart() {
    SmartMart.state.cart = [];
    SmartMart.state.redeemPoints = false;
    SmartMart.state.orderDiscountPct = 0;
    document.querySelectorAll('#pos-discount-pills .disc-pill').forEach((p, idx) => {
      if (idx === 0) p.classList.add('active');
      else p.classList.remove('active');
    });
    const chk = document.getElementById('pos-redeem-points-chk');
    if (chk) chk.checked = false;
    this.renderCart();
  },

  renderCart() {
    const tbody = document.getElementById('pos-cart-tbody');
    const emptyMsg = document.getElementById('pos-empty-cart-message');
    const completeBtn = document.getElementById('pos-complete-sale-btn');
    if (!tbody || !emptyMsg) return;

    if (SmartMart.state.cart.length === 0) {
      tbody.innerHTML = '';
      emptyMsg.style.display = 'block';
      if (completeBtn) {
        completeBtn.disabled = true;
        completeBtn.innerHTML = `<i class="fa-solid fa-check-double"></i> Complete & Print Invoice (₹0.00)`;
      }
      this.calculateTotals(0);
      return;
    }

    emptyMsg.style.display = 'none';

    tbody.innerHTML = SmartMart.state.cart.map(item => `
      <tr>
        <td>
          <div class="cart-item-info">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-stock-limit">SKU: ${item.sku} | Max: ${item.stock}</span>
          </div>
        </td>
        <td>${UIManager.formatCurrency(item.price)}</td>
        <td>
          <div class="qty-control-group">
            <button class="qty-btn" onclick="POSModule.updateCartQty('${item.id}', ${item.qty - 1})">-</button>
            <input type="number" class="qty-input" value="${item.qty}" min="1" max="${item.stock}" onchange="POSModule.updateCartQty('${item.id}', parseInt(this.value) || 1)">
            <button class="qty-btn" onclick="POSModule.updateCartQty('${item.id}', ${item.qty + 1})">+</button>
          </div>
        </td>
        <td><strong>${UIManager.formatCurrency(item.total)}</strong></td>
        <td>
          <button class="btn-icon" onclick="POSModule.removeFromCart('${item.id}')" title="Remove Item" style="color:#ef4444;width:24px;height:24px;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </td>
      </tr>
    `).join('');

    const subtotal = SmartMart.state.cart.reduce((acc, i) => acc + i.total, 0);
    this.calculateTotals(subtotal);
  },

  calculateTotals(subtotal) {
    const settings = StorageManager.get(SmartMart.KEYS.SETTINGS, { taxRate: 5.0, loyaltyRedemptionVal: 1.0 });
    const taxRate = settings.taxRate || 5.0;
    const tax = (subtotal * taxRate) / 100;

    const orderDiscountPct = SmartMart.state.orderDiscountPct || 0;
    const orderDiscountAmt = (subtotal * orderDiscountPct) / 100;

    let pointsDiscount = 0;
    if (SmartMart.state.selectedCustomer && SmartMart.state.redeemPoints) {
      const pointVal = settings.loyaltyRedemptionVal || 1.0;
      const maxDiscount = SmartMart.state.selectedCustomer.points * pointVal;
      pointsDiscount = Math.min(maxDiscount, Math.max(0, subtotal + tax - orderDiscountAmt));
    }

    const totalDiscount = orderDiscountAmt + pointsDiscount;
    const grandTotal = Math.max(0, subtotal + tax - totalDiscount);

    document.getElementById('pos-subtotal').textContent = UIManager.formatCurrency(subtotal);
    document.getElementById('pos-tax').textContent = UIManager.formatCurrency(tax);

    const orderDiscLine = document.getElementById('pos-order-discount-line');
    if (orderDiscLine) {
      if (orderDiscountAmt > 0) {
        orderDiscLine.style.display = 'flex';
        document.getElementById('pos-order-discount').textContent = `-${UIManager.formatCurrency(orderDiscountAmt)} (${orderDiscountPct}%)`;
      } else {
        orderDiscLine.style.display = 'none';
      }
    }

    const discountLine = document.getElementById('pos-discount-line');
    if (discountLine) {
      if (pointsDiscount > 0) {
        discountLine.style.display = 'flex';
        document.getElementById('pos-discount').textContent = `-${UIManager.formatCurrency(pointsDiscount)}`;
      } else {
        discountLine.style.display = 'none';
      }
    }

    document.getElementById('pos-grand-total').textContent = UIManager.formatCurrency(grandTotal);

    const completeBtn = document.getElementById('pos-complete-sale-btn');
    if (completeBtn) {
      completeBtn.disabled = (SmartMart.state.cart.length === 0);
      completeBtn.innerHTML = `<i class="fa-solid fa-check-double"></i> Complete & Print Invoice (${UIManager.formatCurrency(grandTotal)})`;
    }

    this.updateCashChange(grandTotal);
  },

  updateCashChange(grandTotal) {
    if (SmartMart.state.paymentMethod !== 'Cash') return;
    const tenderedInput = document.getElementById('pos-tendered-amount');
    const changeField = document.getElementById('pos-change-due');

    const tendered = parseFloat(tenderedInput.value) || 0;
    const change = Math.max(0, tendered - grandTotal);
    changeField.value = UIManager.formatCurrency(change);
  },

  bindEvents() {
    // Barcode input simulator (Enter key or Add Item button)
    const barcodeInput = document.getElementById('pos-barcode-input');
    const barcodeBtn = document.getElementById('pos-barcode-add-btn');

    const handleBarcodeAdd = () => {
      const code = barcodeInput.value.trim();
      if (!code) return;

      const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
      const matched = products.find(p => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase());

      if (matched) {
        this.addToCart(matched.id);
        barcodeInput.value = '';
      } else {
        UIManager.showToast(`No item found matching barcode/SKU: "${code}"`, 'warning');
      }
    };

    if (barcodeInput) {
      barcodeInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleBarcodeAdd();
        }
      };
    }

    if (barcodeBtn) {
      barcodeBtn.onclick = handleBarcodeAdd;
    }

    // Catalog search
    const catalogSearch = document.getElementById('pos-catalog-search');
    if (catalogSearch) {
      catalogSearch.oninput = () => this.renderCatalog();
    }

    // Clear cart button
    const clearBtn = document.getElementById('pos-clear-cart-btn');
    if (clearBtn) {
      clearBtn.onclick = () => {
        if (SmartMart.state.cart.length === 0) return;
        UIManager.confirm('Clear Cart', 'Are you sure you want to discard all items currently in this cart?', () => {
          this.clearCart();
          UIManager.showToast('Cart cleared.', 'info');
        });
      };
    }

    // Customer Selection
    const customerSelect = document.getElementById('pos-customer-select');
    const loyaltyPill = document.getElementById('pos-customer-loyalty-info');
    const pointsSpan = document.getElementById('pos-customer-points');
    const pointsValSpan = document.getElementById('pos-points-discount-val');
    const redeemChk = document.getElementById('pos-redeem-points-chk');

    if (customerSelect) {
      customerSelect.onchange = (e) => {
        const custId = e.target.value;
        const customers = StorageManager.get(SmartMart.KEYS.CUSTOMERS, []);
        const customer = customers.find(c => c.id === custId);
        SmartMart.state.selectedCustomer = customer || null;
        SmartMart.state.redeemPoints = false;
        if (redeemChk) redeemChk.checked = false;

        if (customer && customer.points > 0) {
          loyaltyPill.style.display = 'flex';
          pointsSpan.textContent = customer.points;
          pointsValSpan.textContent = UIManager.formatCurrency(customer.points);
        } else {
          loyaltyPill.style.display = 'none';
        }

        const subtotal = SmartMart.state.cart.reduce((acc, i) => acc + i.total, 0);
        this.calculateTotals(subtotal);
      };
    }

    if (redeemChk) {
      redeemChk.onchange = (e) => {
        SmartMart.state.redeemPoints = e.target.checked;
        const subtotal = SmartMart.state.cart.reduce((acc, i) => acc + i.total, 0);
        this.calculateTotals(subtotal);
      };
    }

    // Quick Add Customer Modal
    const quickAddCustBtn = document.getElementById('pos-add-customer-quick-btn');
    if (quickAddCustBtn) {
      quickAddCustBtn.onclick = () => {
        CustomersModule.openAddCustomerModal();
      };
    }

    // Discount Pills Handling
    const discPills = document.querySelectorAll('#pos-discount-pills .disc-pill');
    discPills.forEach(pill => {
      pill.onclick = () => {
        discPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        SmartMart.state.orderDiscountPct = parseFloat(pill.getAttribute('data-disc')) || 0;
        const subtotal = SmartMart.state.cart.reduce((acc, i) => acc + i.total, 0);
        this.calculateTotals(subtotal);
      };
    });

    // Audio Toggle Button
    const audioBtn = document.getElementById('pos-audio-toggle-btn');
    const audioIcon = document.getElementById('pos-audio-icon');
    if (audioBtn) {
      audioBtn.onclick = () => {
        SmartMart.state.audioEnabled = !SmartMart.state.audioEnabled;
        if (audioIcon) {
          audioIcon.className = SmartMart.state.audioEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        }
        UIManager.showToast(SmartMart.state.audioEnabled ? 'POS Scanner Sound Enabled' : 'POS Scanner Sound Muted', 'info');
      };
    }

    // Payment Method Tabs
    const paymentTabs = document.getElementById('pos-payment-tabs');
    const cashCalc = document.getElementById('pos-cash-calculator');
    const digiNote = document.getElementById('pos-digital-payment-note');

    if (paymentTabs) {
      paymentTabs.querySelectorAll('.pay-tab').forEach(tab => {
        tab.onclick = () => {
          paymentTabs.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const method = tab.getAttribute('data-method');
          SmartMart.state.paymentMethod = method;

          if (method === 'Cash') {
            cashCalc.style.display = 'block';
            digiNote.style.display = 'none';
          } else {
            cashCalc.style.display = 'none';
            digiNote.style.display = 'flex';
          }
        };
      });
    }

    // Cash Tender Quick Pills
    document.querySelectorAll('.cash-pill').forEach(pill => {
      pill.onclick = () => {
        const tenderedInput = document.getElementById('pos-tendered-amount');
        const subtotal = SmartMart.state.cart.reduce((acc, i) => acc + i.total, 0);
        const settings = StorageManager.get(SmartMart.KEYS.SETTINGS, { taxRate: 5.0 });
        const tax = (subtotal * settings.taxRate) / 100;
        const discount = SmartMart.state.redeemPoints && SmartMart.state.selectedCustomer ? SmartMart.state.selectedCustomer.points : 0;
        const grandTotal = Math.max(0, subtotal + tax - discount);

        const amt = pill.getAttribute('data-amount');
        if (amt === 'exact') {
          tenderedInput.value = grandTotal.toFixed(2);
        } else {
          tenderedInput.value = amt;
        }
        this.updateCashChange(grandTotal);
      };
    });

    const tenderedInput = document.getElementById('pos-tendered-amount');
    if (tenderedInput) {
      tenderedInput.oninput = () => {
        const subtotal = SmartMart.state.cart.reduce((acc, i) => acc + i.total, 0);
        const settings = StorageManager.get(SmartMart.KEYS.SETTINGS, { taxRate: 5.0 });
        const tax = (subtotal * settings.taxRate) / 100;
        const discount = SmartMart.state.redeemPoints && SmartMart.state.selectedCustomer ? SmartMart.state.selectedCustomer.points : 0;
        const grandTotal = Math.max(0, subtotal + tax - discount);
        this.updateCashChange(grandTotal);
      };
    }

    // Complete Sale Button
    const completeBtn = document.getElementById('pos-complete-sale-btn');
    if (completeBtn) {
      completeBtn.onclick = () => this.processCheckout();
    }
  },

  processCheckout() {
    // Prevent duplicate checkout triggers
    if (SmartMart.state.isCheckingOut) return;
    if (SmartMart.state.cart.length === 0) {
      UIManager.showToast('Cart is empty. Add products to proceed.', 'warning');
      return;
    }

    SmartMart.state.isCheckingOut = true;

    // Recalculate totals
    const settings = StorageManager.get(SmartMart.KEYS.SETTINGS, {
      taxRate: 5.0,
      loyaltySpendRatio: 100,
      loyaltyRedemptionVal: 1.0
    });

    const subtotal = SmartMart.state.cart.reduce((acc, i) => acc + i.total, 0);
    const tax = (subtotal * (settings.taxRate || 5.0)) / 100;

    const orderDiscountPct = SmartMart.state.orderDiscountPct || 0;
    const orderDiscountAmt = (subtotal * orderDiscountPct) / 100;

    let pointsRedeemed = 0;
    let pointsDiscount = 0;
    if (SmartMart.state.selectedCustomer && SmartMart.state.redeemPoints) {
      pointsRedeemed = SmartMart.state.selectedCustomer.points;
      pointsDiscount = Math.min(pointsRedeemed * (settings.loyaltyRedemptionVal || 1.0), Math.max(0, subtotal + tax - orderDiscountAmt));
    }

    const totalDiscount = orderDiscountAmt + pointsDiscount;
    const grandTotal = Math.max(0, subtotal + tax - totalDiscount);

    // Validate cash tender if cash payment
    let tendered = grandTotal;
    let change = 0;
    if (SmartMart.state.paymentMethod === 'Cash') {
      const tenderedInputVal = parseFloat(document.getElementById('pos-tendered-amount')?.value);
      if (isNaN(tenderedInputVal) || tenderedInputVal < grandTotal) {
        UIManager.showToast(`Insufficient cash tendered. Total is ${UIManager.formatCurrency(grandTotal)}.`, 'warning');
        SmartMart.state.isCheckingOut = false;
        return;
      }
      tendered = tenderedInputVal;
      change = tendered - grandTotal;
    }

    // Step 1: Inventory stock verification & deduction
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const movements = StorageManager.get(SmartMart.KEYS.STOCK_MOVEMENTS, []);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const invoiceNum = this.generateNewInvoiceId();

    for (const item of SmartMart.state.cart) {
      const prod = products.find(p => p.id === item.id);
      if (!prod || prod.stock < item.qty) {
        UIManager.showToast(`Checkout failed: "${item.name}" only has ${prod ? prod.stock : 0} units left in stock!`, 'error');
        SmartMart.state.isCheckingOut = false;
        return;
      }

      // Deduct stock
      const beforeStock = prod.stock;
      prod.stock -= item.qty;

      // Log stock movement audit trail
      movements.unshift({
        timestamp: nowStr,
        productId: prod.id,
        productName: prod.name,
        type: 'SALE_DEDUCTION',
        quantity: -item.qty,
        beforeStock: beforeStock,
        afterStock: prod.stock,
        reason: `POS Checkout ${invoiceNum}`,
        userRole: SmartMart.state.currentRole.toUpperCase()
      });
    }

    // Step 2: Customer loyalty accrual & balance update
    let pointsEarned = 0;
    if (SmartMart.state.selectedCustomer) {
      const ratio = settings.loyaltySpendRatio || 100;
      pointsEarned = Math.floor(grandTotal / ratio);

      const customers = StorageManager.get(SmartMart.KEYS.CUSTOMERS, []);
      const custObj = customers.find(c => c.id === SmartMart.state.selectedCustomer.id);
      const ledger = StorageManager.get(SmartMart.KEYS.LOYALTY_LEDGER, []);

      if (custObj) {
        if (pointsRedeemed > 0) {
          custObj.points -= pointsRedeemed;
          ledger.unshift({
            timestamp: nowStr,
            customerId: custObj.id,
            customerName: custObj.name,
            type: 'DEBIT',
            points: -pointsRedeemed,
            reference: `Redeemed in ${invoiceNum}`
          });
        }

        if (pointsEarned > 0) {
          custObj.points += pointsEarned;
          ledger.unshift({
            timestamp: nowStr,
            customerId: custObj.id,
            customerName: custObj.name,
            type: 'CREDIT',
            points: pointsEarned,
            reference: `Earned in ${invoiceNum}`
          });
        }

        custObj.totalSpend = (custObj.totalSpend || 0) + grandTotal;
        StorageManager.set(SmartMart.KEYS.CUSTOMERS, customers);
        StorageManager.set(SmartMart.KEYS.LOYALTY_LEDGER, ledger);
      }
    }

    // Step 3: Record Sales Transaction
    const newSale = {
      invoiceNumber: invoiceNum,
      timestamp: nowStr,
      customerId: SmartMart.state.selectedCustomer ? SmartMart.state.selectedCustomer.id : null,
      customerName: SmartMart.state.selectedCustomer ? SmartMart.state.selectedCustomer.name : 'Guest Patron',
      items: SmartMart.state.cart.map(i => ({
        id: i.id,
        sku: i.sku,
        name: i.name,
        price: i.price,
        cost: i.cost,
        qty: i.qty,
        total: i.total
      })),
      subtotal,
      tax,
      discount: totalDiscount,
      pointsRedeemed,
      grandTotal,
      paymentMethod: SmartMart.state.paymentMethod,
      amountTendered: tendered,
      changeDue: change,
      pointsEarned,
      cashier: document.getElementById('sidebar-role-name')?.textContent || 'Cashier'
    };

    const sales = StorageManager.get(SmartMart.KEYS.SALES, []);
    sales.unshift(newSale);

    // Save All Atomic State Changes to LocalStorage
    StorageManager.set(SmartMart.KEYS.PRODUCTS, products);
    StorageManager.set(SmartMart.KEYS.STOCK_MOVEMENTS, movements);
    StorageManager.set(SmartMart.KEYS.SALES, sales);

    // Audio chime confirmation
    AudioManager.chime();

    UIManager.showToast(`Sale completed! Invoice ${invoiceNum} generated.`, 'success');

    // Step 4: Show Printable Thermal Receipt
    this.viewInvoiceReceipt(invoiceNum);

    // Step 5: Reset Cart
    this.clearCart();
    this.generateNewInvoiceId();
    this.renderCatalog();
    App.refreshAllAlerts();

    SmartMart.state.isCheckingOut = false;
  },

  viewInvoiceReceipt(invoiceNumber) {
    const sales = StorageManager.get(SmartMart.KEYS.SALES, []);
    const sale = sales.find(s => s.invoiceNumber === invoiceNumber);
    if (!sale) {
      UIManager.showToast('Invoice record not found.', 'error');
      return;
    }

    const settings = StorageManager.get(SmartMart.KEYS.SETTINGS, {
      storeName: 'SmartMart Supermarket',
      storeAddress: '#12, Commercial Road, Central District',
      storePhone: '+91 98765 43210',
      storeGst: '29ABCDE1234F1Z5'
    });

    document.getElementById('receipt-store-name').textContent = settings.storeName;
    document.getElementById('receipt-store-address').textContent = settings.storeAddress;
    document.getElementById('receipt-store-phone').textContent = settings.storePhone;
    document.getElementById('receipt-store-gst').textContent = settings.storeGst;

    document.getElementById('receipt-inv-num').textContent = sale.invoiceNumber;
    document.getElementById('receipt-datetime').textContent = sale.timestamp;
    document.getElementById('receipt-cashier').textContent = sale.cashier || 'Cashier Desk 1';
    document.getElementById('receipt-customer').textContent = sale.customerName || 'Guest';

    // Populate Items
    const itemsTbody = document.getElementById('receipt-items-tbody');
    itemsTbody.innerHTML = sale.items.map(item => `
      <tr>
        <td class="text-left">${item.name}</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-right">${UIManager.formatCurrency(item.price)}</td>
        <td class="text-right">${UIManager.formatCurrency(item.total)}</td>
      </tr>
    `).join('');

    document.getElementById('receipt-subtotal').textContent = UIManager.formatCurrency(sale.subtotal);
    document.getElementById('receipt-cgst').textContent = UIManager.formatCurrency(sale.tax / 2);
    document.getElementById('receipt-sgst').textContent = UIManager.formatCurrency(sale.tax / 2);

    const discountRow = document.getElementById('receipt-discount-row');
    if (sale.discount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('receipt-discount').textContent = `-${UIManager.formatCurrency(sale.discount)}`;
    } else {
      discountRow.style.display = 'none';
    }

    document.getElementById('receipt-grand-total').textContent = UIManager.formatCurrency(sale.grandTotal);
    document.getElementById('receipt-pay-method').textContent = sale.paymentMethod.toUpperCase();

    const tenderRow = document.getElementById('receipt-tender-row');
    const changeRow = document.getElementById('receipt-change-row');

    if (sale.paymentMethod === 'Cash') {
      tenderRow.style.display = 'flex';
      changeRow.style.display = 'flex';
      document.getElementById('receipt-tendered').textContent = UIManager.formatCurrency(sale.amountTendered);
      document.getElementById('receipt-change').textContent = UIManager.formatCurrency(sale.changeDue);
    } else {
      tenderRow.style.display = 'none';
      changeRow.style.display = 'none';
    }

    const loyaltyRow = document.getElementById('receipt-loyalty-row');
    if (sale.pointsEarned > 0) {
      loyaltyRow.style.display = 'flex';
      document.getElementById('receipt-points-earned').textContent = `+${sale.pointsEarned} pts`;
    } else {
      loyaltyRow.style.display = 'none';
    }

    document.getElementById('receipt-barcode-text').textContent = sale.invoiceNumber;

    // Print Receipt Event
    document.getElementById('receipt-print-btn').onclick = () => {
      window.print();
    };

    UIManager.openModal('receipt-modal');
  }
};

/* ============================================================================
   6. PRODUCTS & INVENTORY MANAGEMENT MODULE
   ============================================================================ */
const ProductsModule = {
  init() {
    this.populateCategoryFilter();
    this.filterAndRender();
    this.bindEvents();
  },

  populateCategoryFilter() {
    const categories = StorageManager.get(SmartMart.KEYS.CATEGORIES, []);
    const select = document.getElementById('inv-category-filter');
    if (!select) return;

    select.innerHTML = `
      <option value="ALL">All Categories</option>
      ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
    `;
  },

  filterAndRender() {
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const searchQuery = (document.getElementById('inv-search-input')?.value || '').trim().toLowerCase();
    const category = document.getElementById('inv-category-filter')?.value || 'ALL';
    const status = document.getElementById('inv-status-filter')?.value || 'ALL';
    const sortBy = document.getElementById('inv-sort-by')?.value || 'name_asc';

    let filtered = products.filter(p => {
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.sku.toLowerCase().includes(searchQuery) ||
        p.barcode.includes(searchQuery);

      const matchesCat = (category === 'ALL' || p.category === category);

      let matchesStatus = true;
      const isExp = UIManager.isExpired(p.expiry);
      if (status === 'IN_STOCK') matchesStatus = (p.stock > p.minStock && !isExp);
      if (status === 'LOW_STOCK') matchesStatus = (p.stock > 0 && p.stock <= p.minStock && !isExp);
      if (status === 'OUT_OF_STOCK') matchesStatus = (p.stock === 0);
      if (status === 'EXPIRED') matchesStatus = isExp;

      return matchesSearch && matchesCat && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'stock_asc') return a.stock - b.stock;
      if (sortBy === 'stock_desc') return b.stock - a.stock;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });

    const tbody = document.getElementById('inventory-table-body');
    const countInfo = document.getElementById('inv-table-count');
    if (!tbody) return;

    if (countInfo) countInfo.textContent = `Showing ${filtered.length} of ${products.length} registered products`;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted" style="padding:2rem;">No products match current search or filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(p => {
      const isExp = UIManager.isExpired(p.expiry);
      let statusBadge = `<span class="badge badge-success">In Stock</span>`;
      if (p.stock === 0) statusBadge = `<span class="badge badge-danger">Out of Stock</span>`;
      else if (p.stock <= p.minStock) statusBadge = `<span class="badge badge-warning">Low Stock</span>`;
      if (isExp) statusBadge = `<span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Expired</span>`;

      return `
        <tr>
          <td>
            <strong>${p.name}</strong>
            <div class="text-muted" style="font-size:0.75rem;">Supplier: ${p.supplier}</div>
          </td>
          <td>
            <code>${p.sku}</code>
            <div class="text-muted" style="font-size:0.75rem;"><i class="fa-solid fa-barcode"></i> ${p.barcode}</div>
          </td>
          <td><span class="badge badge-muted">${p.category}</span></td>
          <td>${UIManager.formatCurrency(p.cost)}</td>
          <td><strong>${UIManager.formatCurrency(p.price)}</strong></td>
          <td>
            <span style="font-weight:700; ${p.stock <= p.minStock ? 'color:#ef4444;' : 'color:#10b981;'}">
              ${p.stock}
            </span>
          </td>
          <td>${p.minStock}</td>
          <td>${p.expiry || '<span class="text-muted">N/A</span>'}</td>
          <td>${statusBadge}</td>
          <td class="text-right">
            <div style="display:flex;gap:0.35rem;justify-content:flex-end;">
              <button class="btn btn-secondary btn-sm" onclick="ProductsModule.openStockAdjust('${p.id}')" title="Adjust Stock">
                <i class="fa-solid fa-arrow-up-right-dots"></i>
              </button>
              <button class="btn btn-secondary btn-sm" onclick="ProductsModule.openEditProductModal('${p.id}')" title="Edit Product">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn btn-secondary btn-sm" onclick="ProductsModule.deleteProduct('${p.id}')" title="Deactivate / Delete" style="color:#ef4444;">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  bindEvents() {
    const searchInput = document.getElementById('inv-search-input');
    const catFilter = document.getElementById('inv-category-filter');
    const statusFilter = document.getElementById('inv-status-filter');
    const sortBy = document.getElementById('inv-sort-by');

    if (searchInput) searchInput.oninput = () => this.filterAndRender();
    if (catFilter) catFilter.onchange = () => this.filterAndRender();
    if (statusFilter) statusFilter.onchange = () => this.filterAndRender();
    if (sortBy) sortBy.onchange = () => this.filterAndRender();

    const addBtn = document.getElementById('inv-add-product-btn');
    if (addBtn) addBtn.onclick = () => this.openAddProductModal();

    const quickAdjustBtn = document.getElementById('inv-quick-adjust-btn');
    if (quickAdjustBtn) quickAdjustBtn.onclick = () => this.openStockAdjust();

    const exportCsvBtn = document.getElementById('inv-export-csv-btn');
    if (exportCsvBtn) exportCsvBtn.onclick = () => this.exportInventoryCSV();

    const movementBtn = document.getElementById('inv-movement-history-btn');
    if (movementBtn) movementBtn.onclick = () => this.openMovementHistoryModal();

    // Product Form Submit
    const prodForm = document.getElementById('product-form');
    if (prodForm) {
      prodForm.onsubmit = (e) => {
        e.preventDefault();
        this.saveProductForm();
      };
    }

    // Stock Adjust Form Submit
    const adjustForm = document.getElementById('stock-adjust-form');
    if (adjustForm) {
      adjustForm.onsubmit = (e) => {
        e.preventDefault();
        this.saveStockAdjustment();
      };
    }
  },

  openAddProductModal() {
    // Check permission
    if (SmartMart.state.currentRole === 'cashier') {
      UIManager.showToast('Permission Denied: Cashier role cannot add products.', 'warning');
      return;
    }

    document.getElementById('product-modal-title').textContent = 'Add New Product';
    document.getElementById('prod-form-id').value = '';
    document.getElementById('product-form').reset();

    // Populate category & supplier dropdowns
    this.populateModalSelects();

    // Default auto SKU generator
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    document.getElementById('prod-sku').value = `PRD-${1000 + products.length + 1}`;
    document.getElementById('prod-barcode').value = `89010${String(products.length + 1).padStart(4, '0')}`;

    UIManager.openModal('product-modal');
  },

  openEditProductModal(productId) {
    if (SmartMart.state.currentRole === 'cashier') {
      UIManager.showToast('Permission Denied: Cashier role cannot edit products.', 'warning');
      return;
    }

    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    this.populateModalSelects();

    document.getElementById('product-modal-title').textContent = 'Edit Product Details';
    document.getElementById('prod-form-id').value = product.id;
    document.getElementById('prod-sku').value = product.sku;
    document.getElementById('prod-barcode').value = product.barcode;
    document.getElementById('prod-name').value = product.name;
    document.getElementById('prod-category').value = product.category;
    document.getElementById('prod-supplier').value = product.supplier;
    document.getElementById('prod-cost').value = product.cost;
    document.getElementById('prod-price').value = product.price;
    document.getElementById('prod-stock').value = product.stock;
    document.getElementById('prod-min-stock').value = product.minStock;
    document.getElementById('prod-expiry').value = product.expiry || '';
    document.getElementById('prod-status').value = product.status || 'ACTIVE';

    UIManager.openModal('product-modal');
  },

  populateModalSelects() {
    const categories = StorageManager.get(SmartMart.KEYS.CATEGORIES, []);
    const suppliers = StorageManager.get(SmartMart.KEYS.SUPPLIERS, []);

    const catSelect = document.getElementById('prod-category');
    catSelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');

    const suppSelect = document.getElementById('prod-supplier');
    suppSelect.innerHTML = suppliers.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
  },

  saveProductForm() {
    const id = document.getElementById('prod-form-id').value;
    const sku = document.getElementById('prod-sku').value.trim();
    const barcode = document.getElementById('prod-barcode').value.trim();
    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const supplier = document.getElementById('prod-supplier').value;
    const cost = parseFloat(document.getElementById('prod-cost').value);
    const price = parseFloat(document.getElementById('prod-price').value);
    const stock = parseInt(document.getElementById('prod-stock').value);
    const minStock = parseInt(document.getElementById('prod-min-stock').value);
    const expiry = document.getElementById('prod-expiry').value;
    const status = document.getElementById('prod-status').value;

    if (cost < 0 || price < 0 || stock < 0 || minStock < 0) {
      UIManager.showToast('Negative values are not permitted for prices or quantities.', 'error');
      return;
    }

    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);

    // Unique SKU & Barcode validation
    const skuConflict = products.find(p => p.sku.toLowerCase() === sku.toLowerCase() && p.id !== id);
    if (skuConflict) {
      UIManager.showToast(`Product with SKU "${sku}" already exists!`, 'error');
      return;
    }

    const barcodeConflict = products.find(p => p.barcode === barcode && p.id !== id);
    if (barcodeConflict) {
      UIManager.showToast(`Product with Barcode "${barcode}" already exists!`, 'error');
      return;
    }

    if (id) {
      // Edit existing product
      const index = products.findIndex(p => p.id === id);
      if (index > -1) {
        products[index] = {
          ...products[index],
          sku, barcode, name, category, supplier,
          cost, price, stock, minStock, expiry, status
        };
        UIManager.showToast(`Product "${name}" updated successfully.`, 'success');
      }
    } else {
      // Add new product
      const newProduct = {
        id: `PRD-${Date.now().toString().slice(-6)}`,
        sku, barcode, name, category, supplier,
        cost, price, stock, minStock, expiry, status
      };
      products.push(newProduct);
      UIManager.showToast(`Product "${name}" registered into inventory.`, 'success');
    }

    StorageManager.set(SmartMart.KEYS.PRODUCTS, products);
    UIManager.closeModal('product-modal');
    this.filterAndRender();
    App.refreshAllAlerts();
  },

  deleteProduct(productId) {
    if (SmartMart.state.currentRole === 'cashier') {
      UIManager.showToast('Permission Denied: Cashier role cannot delete products.', 'warning');
      return;
    }

    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    UIManager.confirm(
      'Deactivate / Remove Product',
      `Are you sure you want to deactivate "${product.name}"? It will no longer be available for sale.`,
      () => {
        // Toggle status to inactive or remove
        const updated = products.filter(p => p.id !== productId);
        StorageManager.set(SmartMart.KEYS.PRODUCTS, updated);
        UIManager.showToast(`Product "${product.name}" deleted.`, 'info');
        this.filterAndRender();
        App.refreshAllAlerts();
      }
    );
  },

  openStockAdjust(preselectedProductId = null) {
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const select = document.getElementById('adjust-prod-select');
    if (!select) return;

    select.innerHTML = products.map(p => `
      <option value="${p.id}" ${p.id === preselectedProductId ? 'selected' : ''}>
        ${p.name} (SKU: ${p.sku}) - Current Stock: ${p.stock}
      </option>
    `).join('');

    const updatePreview = () => {
      const selected = products.find(p => p.id === select.value);
      if (selected) {
        document.getElementById('adjust-current-preview').innerHTML = `
          Selected Product: <strong>${selected.name}</strong><br>
          Current Stock: <strong>${selected.stock} units</strong> | Safety Min: ${selected.minStock}
        `;
      }
    };

    select.onchange = updatePreview;
    updatePreview();

    UIManager.openModal('stock-adjust-modal');
  },

  saveStockAdjustment() {
    const productId = document.getElementById('adjust-prod-select').value;
    const adjustType = document.getElementById('adjust-type').value;
    const qty = parseInt(document.getElementById('adjust-qty').value) || 0;
    const reason = document.getElementById('adjust-reason').value;
    const notes = document.getElementById('adjust-notes').value.trim();

    if (qty <= 0) {
      UIManager.showToast('Adjustment quantity must be greater than zero.', 'warning');
      return;
    }

    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const movements = StorageManager.get(SmartMart.KEYS.STOCK_MOVEMENTS, []);
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const beforeStock = product.stock;
    let afterStock = beforeStock;
    let movementQty = qty;

    if (adjustType === 'ADD') {
      afterStock = beforeStock + qty;
      movementQty = qty;
    } else if (adjustType === 'SUBTRACT') {
      if (qty > beforeStock) {
        UIManager.showToast(`Cannot subtract ${qty} units: only ${beforeStock} available in stock.`, 'error');
        return;
      }
      afterStock = beforeStock - qty;
      movementQty = -qty;
    } else if (adjustType === 'SET') {
      afterStock = qty;
      movementQty = afterStock - beforeStock;
    }

    product.stock = afterStock;

    // Log to Stock Movement History
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    movements.unshift({
      timestamp: nowStr,
      productId: product.id,
      productName: product.name,
      type: `MANUAL_${adjustType}`,
      quantity: movementQty,
      beforeStock,
      afterStock,
      reason: `${reason} - ${notes || 'Manual stock adjustment'}`,
      userRole: SmartMart.state.currentRole.toUpperCase()
    });

    StorageManager.set(SmartMart.KEYS.PRODUCTS, products);
    StorageManager.set(SmartMart.KEYS.STOCK_MOVEMENTS, movements);

    UIManager.showToast(`Stock for "${product.name}" updated to ${afterStock} units.`, 'success');
    UIManager.closeModal('stock-adjust-modal');
    this.filterAndRender();
    App.refreshAllAlerts();
  },

  openMovementHistoryModal() {
    const movements = StorageManager.get(SmartMart.KEYS.STOCK_MOVEMENTS, []);
    const tbody = document.getElementById('movement-history-tbody');
    if (!tbody) return;

    if (movements.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:2rem;">No stock movement records logged yet.</td></tr>`;
    } else {
      tbody.innerHTML = movements.map(m => {
        const qtyFormatted = m.quantity > 0 ? `+${m.quantity}` : `${m.quantity}`;
        const qtyColor = m.quantity > 0 ? 'text-success' : 'text-rose';
        return `
          <tr>
            <td><small>${m.timestamp}</small></td>
            <td><strong>${m.productName}</strong></td>
            <td><span class="badge badge-muted">${m.type}</span></td>
            <td><strong class="${qtyColor}">${qtyFormatted}</strong></td>
            <td>${m.beforeStock} &rarr; <strong>${m.afterStock}</strong></td>
            <td>${m.reason}</td>
            <td><span class="badge badge-primary">${m.userRole || 'Admin'}</span></td>
          </tr>
        `;
      }).join('');
    }

    UIManager.openModal('movement-history-modal');
  },

  exportInventoryCSV() {
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const headers = ['Product ID', 'SKU', 'Barcode', 'Product Name', 'Category', 'Supplier', 'Cost Price (INR)', 'Selling Price (INR)', 'Stock Qty', 'Min Threshold', 'Expiry Date', 'Status'];

    const rows = products.map(p => [
      `"${p.id}"`,
      `"${p.sku}"`,
      `"${p.barcode}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.supplier}"`,
      p.cost,
      p.price,
      p.stock,
      p.minStock,
      `"${p.expiry || ''}"`,
      `"${p.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartMart_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    UIManager.showToast('Inventory exported to CSV.', 'success');
  }
};

/* ============================================================================
   7. SUPPLIERS & PURCHASE ORDERS MODULE
   ============================================================================ */
const SuppliersModule = {
  init() {
    this.renderSuppliers();
    this.renderPurchaseOrders();
    this.bindEvents();
  },

  renderSuppliers() {
    const suppliers = StorageManager.get(SmartMart.KEYS.SUPPLIERS, []);
    const tbody = document.getElementById('suppliers-table-body');
    const badge = document.getElementById('supp-count-badge');
    if (badge) badge.textContent = suppliers.length;
    if (!tbody) return;

    tbody.innerHTML = suppliers.map(s => `
      <tr>
        <td><strong>${s.id}</strong></td>
        <td><strong>${s.name}</strong></td>
        <td>${s.contact}</td>
        <td>
          <div><i class="fa-solid fa-phone text-muted"></i> ${s.phone}</div>
          <small class="text-muted">${s.email}</small>
        </td>
        <td><span class="badge badge-muted">${s.categories}</span></td>
        <td><span class="badge badge-success">${s.status}</span></td>
        <td class="text-right">
          <button class="btn btn-secondary btn-sm" onclick="SuppliersModule.openEditSupplierModal('${s.id}')">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
        </td>
      </tr>
    `).join('');
  },

  renderPurchaseOrders() {
    const pos = StorageManager.get(SmartMart.KEYS.PURCHASE_ORDERS, []);
    const tbody = document.getElementById('po-table-body');
    const badge = document.getElementById('po-count-badge');
    if (badge) badge.textContent = pos.length;
    if (!tbody) return;

    if (pos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding:2rem;">No purchase orders logged.</td></tr>`;
      return;
    }

    tbody.innerHTML = pos.map(p => {
      let statusBadge = `<span class="badge badge-warning">Pending</span>`;
      let actionBtn = `
        <button class="btn btn-primary btn-sm" onclick="SuppliersModule.receiveOrder('${p.poNumber}')">
          <i class="fa-solid fa-boxes-packing"></i> Mark Received
        </button>
      `;

      if (p.status === 'Received') {
        statusBadge = `<span class="badge badge-success">Received</span>`;
        actionBtn = `<span class="text-muted" style="font-size:0.75rem;"><i class="fa-solid fa-check"></i> Stock Added</span>`;
      } else if (p.status === 'Cancelled') {
        statusBadge = `<span class="badge badge-danger">Cancelled</span>`;
        actionBtn = ``;
      }

      return `
        <tr>
          <td><strong>${p.poNumber}</strong></td>
          <td><strong>${p.supplierName}</strong></td>
          <td>${p.orderDate}</td>
          <td>${p.items.length} product(s)</td>
          <td><strong>${UIManager.formatCurrency(p.totalAmount)}</strong></td>
          <td>${p.expectedDate}</td>
          <td>${statusBadge}</td>
          <td class="text-right">${actionBtn}</td>
        </tr>
      `;
    }).join('');
  },

  receiveOrder(poNumber) {
    const pos = StorageManager.get(SmartMart.KEYS.PURCHASE_ORDERS, []);
    const po = pos.find(p => p.poNumber === poNumber);

    if (!po) return;

    // Strict validation: Prevent receiving the same order twice
    if (po.status === 'Received') {
      UIManager.showToast('This purchase order has already been received and stock incremented.', 'warning');
      return;
    }

    UIManager.confirm(
      'Receive Purchase Order',
      `Confirm physical receipt of goods for ${po.poNumber}? Product inventory will be incremented accordingly.`,
      () => {
        const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
        const movements = StorageManager.get(SmartMart.KEYS.STOCK_MOVEMENTS, []);
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

        // Update product stock and log audit movements
        po.items.forEach(item => {
          const prod = products.find(p => p.id === item.id);
          if (prod) {
            const beforeStock = prod.stock;
            prod.stock += item.qty;

            movements.unshift({
              timestamp: nowStr,
              productId: prod.id,
              productName: prod.name,
              type: 'PO_RECEIPT',
              quantity: item.qty,
              beforeStock,
              afterStock: prod.stock,
              reason: `Received against Purchase Order ${po.poNumber}`,
              userRole: SmartMart.state.currentRole.toUpperCase()
            });
          }
        });

        po.status = 'Received';
        po.receivedDate = nowStr.split(' ')[0];

        StorageManager.set(SmartMart.KEYS.PRODUCTS, products);
        StorageManager.set(SmartMart.KEYS.STOCK_MOVEMENTS, movements);
        StorageManager.set(SmartMart.KEYS.PURCHASE_ORDERS, pos);

        UIManager.showToast(`Order ${po.poNumber} received! Stock updated successfully.`, 'success');
        this.renderPurchaseOrders();
        App.refreshAllAlerts();
      }
    );
  },

  autoDraftLowStockPO() {
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const lowStockItems = products.filter(p => p.stock <= p.minStock && !UIManager.isExpired(p.expiry));

    if (lowStockItems.length === 0) {
      UIManager.showToast('No low stock items require replenishment at this time.', 'info');
      return;
    }

    // Pick top supplier from the low stock items
    const primarySupplier = lowStockItems[0].supplier || 'Amul Dairy Supplies Pvt Ltd';
    const suppliers = StorageManager.get(SmartMart.KEYS.SUPPLIERS, []);
    const suppObj = suppliers.find(s => s.name === primarySupplier) || suppliers[0];

    // Pre-populate items
    this.openCreatePOModal();
    document.getElementById('po-supplier-select').value = suppObj.id;

    const tbody = document.getElementById('po-lines-tbody');
    tbody.innerHTML = '';

    lowStockItems.forEach(item => {
      const orderQty = Math.max(20, item.minStock * 2);
      this.addPOLineItem(item.id, orderQty, item.cost);
    });

    UIManager.showToast(`Generated draft purchase order lines for ${lowStockItems.length} low-stock items.`, 'info');
  },

  openCreatePOModal() {
    const suppliers = StorageManager.get(SmartMart.KEYS.SUPPLIERS, []);
    const select = document.getElementById('po-supplier-select');
    select.innerHTML = suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    // Delivery date default 3 days in advance
    const d = new Date();
    d.setDate(d.getDate() + 3);
    document.getElementById('po-expected-date').value = d.toISOString().split('T')[0];

    const tbody = document.getElementById('po-lines-tbody');
    tbody.innerHTML = '';
    this.addPOLineItem();

    UIManager.openModal('po-create-modal');
  },

  addPOLineItem(preselectedProdId = null, defaultQty = 10, defaultCost = null) {
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const tbody = document.getElementById('po-lines-tbody');
    if (!tbody) return;

    const tr = document.createElement('tr');
    tr.className = 'po-line-row';

    const selectedProd = products.find(p => p.id === preselectedProdId) || products[0];
    const unitCost = defaultCost !== null ? defaultCost : (selectedProd ? selectedProd.cost : 0);
    const lineTotal = defaultQty * unitCost;

    tr.innerHTML = `
      <td>
        <select class="form-select po-prod-select">
          ${products.map(p => `<option value="${p.id}" data-cost="${p.cost}" data-stock="${p.stock}" ${p.id === selectedProd.id ? 'selected' : ''}>${p.name}</option>`).join('')}
        </select>
      </td>
      <td class="po-current-stock">${selectedProd.stock}</td>
      <td>
        <input type="number" class="form-control po-qty-input" value="${defaultQty}" min="1">
      </td>
      <td>
        <input type="number" class="form-control po-cost-input" value="${unitCost}" min="0" step="any">
      </td>
      <td><strong class="po-line-total">${UIManager.formatCurrency(lineTotal)}</strong></td>
      <td>
        <button type="button" class="btn-icon" onclick="this.closest('tr').remove(); SuppliersModule.recalcPOTotals();" style="color:#ef4444;">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;

    const prodSelect = tr.querySelector('.po-prod-select');
    const qtyInput = tr.querySelector('.po-qty-input');
    const costInput = tr.querySelector('.po-cost-input');

    const updateLine = () => {
      const selectedOption = prodSelect.options[prodSelect.selectedIndex];
      const stock = selectedOption.getAttribute('data-stock');
      const cost = parseFloat(costInput.value) || 0;
      const q = parseInt(qtyInput.value) || 0;

      tr.querySelector('.po-current-stock').textContent = stock;
      tr.querySelector('.po-line-total').textContent = UIManager.formatCurrency(q * cost);
      this.recalcPOTotals();
    };

    prodSelect.onchange = () => {
      const selectedOption = prodSelect.options[prodSelect.selectedIndex];
      costInput.value = selectedOption.getAttribute('data-cost');
      updateLine();
    };

    qtyInput.oninput = updateLine;
    costInput.oninput = updateLine;

    tbody.appendChild(tr);
    this.recalcPOTotals();
  },

  recalcPOTotals() {
    let grandTotal = 0;
    document.querySelectorAll('.po-line-row').forEach(tr => {
      const q = parseInt(tr.querySelector('.po-qty-input')?.value) || 0;
      const c = parseFloat(tr.querySelector('.po-cost-input')?.value) || 0;
      grandTotal += (q * c);
    });

    document.getElementById('po-calc-total').textContent = UIManager.formatCurrency(grandTotal);
  },

  savePOCreation() {
    const suppliers = StorageManager.get(SmartMart.KEYS.SUPPLIERS, []);
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const suppId = document.getElementById('po-supplier-select').value;
    const suppObj = suppliers.find(s => s.id === suppId);
    const expectedDate = document.getElementById('po-expected-date').value;

    const items = [];
    let totalAmount = 0;

    document.querySelectorAll('.po-line-row').forEach(tr => {
      const prodId = tr.querySelector('.po-prod-select').value;
      const q = parseInt(tr.querySelector('.po-qty-input').value) || 0;
      const c = parseFloat(tr.querySelector('.po-cost-input').value) || 0;
      const prod = products.find(p => p.id === prodId);

      if (prod && q > 0) {
        const lineTotal = q * c;
        totalAmount += lineTotal;
        items.push({
          id: prod.id,
          name: prod.name,
          qty: q,
          cost: c,
          lineTotal
        });
      }
    });

    if (items.length === 0) {
      UIManager.showToast('Please add at least one line item to the order.', 'warning');
      return;
    }

    const pos = StorageManager.get(SmartMart.KEYS.PURCHASE_ORDERS, []);
    const newSeq = String(pos.length + 101);
    const poNumber = `PO-2026-${newSeq}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const newPO = {
      poNumber,
      supplierId: suppId,
      supplierName: suppObj ? suppObj.name : 'Unknown Supplier',
      orderDate: todayStr,
      expectedDate,
      items,
      totalAmount,
      status: 'Pending',
      receivedDate: null
    };

    pos.unshift(newPO);
    StorageManager.set(SmartMart.KEYS.PURCHASE_ORDERS, pos);

    UIManager.showToast(`Purchase order ${poNumber} created with status: PENDING.`, 'success');
    UIManager.closeModal('po-create-modal');
    this.renderPurchaseOrders();
  },

  openEditSupplierModal(suppId = null) {
    const suppliers = StorageManager.get(SmartMart.KEYS.SUPPLIERS, []);
    document.getElementById('supplier-form').reset();

    if (suppId) {
      const supp = suppliers.find(s => s.id === suppId);
      if (supp) {
        document.getElementById('supplier-modal-title').textContent = 'Edit Supplier';
        document.getElementById('supp-form-id').value = supp.id;
        document.getElementById('supp-name').value = supp.name;
        document.getElementById('supp-contact').value = supp.contact;
        document.getElementById('supp-phone').value = supp.phone;
        document.getElementById('supp-email').value = supp.email || '';
        document.getElementById('supp-address').value = supp.address || '';
        document.getElementById('supp-categories').value = supp.categories || '';
      }
    } else {
      document.getElementById('supplier-modal-title').textContent = 'Add New Supplier';
      document.getElementById('supp-form-id').value = '';
    }

    UIManager.openModal('supplier-modal');
  },

  saveSupplierForm() {
    const id = document.getElementById('supp-form-id').value;
    const name = document.getElementById('supp-name').value.trim();
    const contact = document.getElementById('supp-contact').value.trim();
    const phone = document.getElementById('supp-phone').value.trim();
    const email = document.getElementById('supp-email').value.trim();
    const address = document.getElementById('supp-address').value.trim();
    const categories = document.getElementById('supp-categories').value.trim();

    const suppliers = StorageManager.get(SmartMart.KEYS.SUPPLIERS, []);

    if (id) {
      const index = suppliers.findIndex(s => s.id === id);
      if (index > -1) {
        suppliers[index] = { ...suppliers[index], name, contact, phone, email, address, categories };
        UIManager.showToast(`Supplier "${name}" updated.`, 'success');
      }
    } else {
      const newId = `SUP-${String(suppliers.length + 1).padStart(2, '0')}`;
      suppliers.push({
        id: newId,
        name, contact, phone, email, address, categories,
        status: 'Active'
      });
      UIManager.showToast(`Supplier "${name}" registered.`, 'success');
    }

    StorageManager.set(SmartMart.KEYS.SUPPLIERS, suppliers);
    UIManager.closeModal('supplier-modal');
    this.renderSuppliers();
  },

  bindEvents() {
    // Sub tabs switcher (PO vs Suppliers)
    document.querySelectorAll('.tab-pill-bar .tab-pill').forEach(pill => {
      pill.onclick = () => {
        document.querySelectorAll('.tab-pill-bar .tab-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const targetId = pill.getAttribute('data-subtab');
        document.querySelectorAll('.subtab-content').forEach(sub => sub.classList.remove('active'));
        document.getElementById(targetId)?.classList.add('active');
      };
    });

    const createPoBtn = document.getElementById('supp-create-po-btn');
    if (createPoBtn) createPoBtn.onclick = () => this.openCreatePOModal();

    const autoLowStockBtn = document.getElementById('supp-auto-low-stock-po');
    if (autoLowStockBtn) autoLowStockBtn.onclick = () => this.autoDraftLowStockPO();

    const addSuppBtn = document.getElementById('supp-add-supplier-btn');
    if (addSuppBtn) addSuppBtn.onclick = () => this.openEditSupplierModal();

    const addLineBtn = document.getElementById('po-add-line-btn');
    if (addLineBtn) addLineBtn.onclick = () => this.addPOLineItem();

    const poForm = document.getElementById('po-create-form');
    if (poForm) {
      poForm.onsubmit = (e) => {
        e.preventDefault();
        this.savePOCreation();
      };
    }

    const suppForm = document.getElementById('supplier-form');
    if (suppForm) {
      suppForm.onsubmit = (e) => {
        e.preventDefault();
        this.saveSupplierForm();
      };
    }
  }
};

/* ============================================================================
   8. CUSTOMERS & LOYALTY MODULE
   ============================================================================ */
const CustomersModule = {
  init() {
    this.renderCustomers();
    this.bindEvents();
  },

  renderCustomers() {
    const customers = StorageManager.get(SmartMart.KEYS.CUSTOMERS, []);
    const search = (document.getElementById('cust-search-input')?.value || '').trim().toLowerCase();
    const tbody = document.getElementById('customers-table-body');
    if (!tbody) return;

    const filtered = customers.filter(c =>
      !search ||
      c.name.toLowerCase().includes(search) ||
      c.phone.includes(search) ||
      c.id.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding:2rem;">No customers found matching "${search}".</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td><strong>${c.name}</strong></td>
        <td><i class="fa-solid fa-phone text-muted"></i> ${c.phone}</td>
        <td>${c.email || '<span class="text-muted">Not provided</span>'}</td>
        <td><span class="badge badge-success"><i class="fa-solid fa-award"></i> ${c.points} pts</span></td>
        <td><strong>${UIManager.formatCurrency(c.totalSpend || 0)}</strong></td>
        <td>${c.joinedDate || '2026-08-01'}</td>
        <td class="text-right">
          <button class="btn btn-secondary btn-sm" onclick="CustomersModule.viewCustomerHistory('${c.id}')" title="Purchase History">
            <i class="fa-solid fa-receipt"></i> Orders
          </button>
        </td>
      </tr>
    `).join('');
  },

  openAddCustomerModal() {
    document.getElementById('customer-form').reset();
    document.getElementById('cust-form-id').value = '';
    document.getElementById('customer-modal-title').textContent = 'Register New Customer';
    UIManager.openModal('customer-modal');
  },

  saveCustomerForm() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const email = document.getElementById('cust-email').value.trim();

    if (!name || !phone) {
      UIManager.showToast('Please provide customer name and phone number.', 'warning');
      return;
    }

    const customers = StorageManager.get(SmartMart.KEYS.CUSTOMERS, []);

    // Check duplicate phone
    if (customers.find(c => c.phone === phone)) {
      UIManager.showToast(`A customer with phone number ${phone} is already registered!`, 'error');
      return;
    }

    const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    const newCust = {
      id: newId,
      name,
      phone,
      email,
      points: 0,
      totalSpend: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    customers.push(newCust);
    StorageManager.set(SmartMart.KEYS.CUSTOMERS, customers);

    UIManager.showToast(`Customer "${name}" registered successfully.`, 'success');
    UIManager.closeModal('customer-modal');
    this.renderCustomers();

    // If POS is active, update dropdown and select newly registered customer
    POSModule.renderCustomerDropdown();
    const select = document.getElementById('pos-customer-select');
    if (select) {
      select.value = newId;
      select.dispatchEvent(new Event('change'));
    }
  },

  viewCustomerHistory(customerId) {
    const customers = StorageManager.get(SmartMart.KEYS.CUSTOMERS, []);
    const sales = StorageManager.get(SmartMart.KEYS.SALES, []);
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    document.getElementById('cust-history-modal-title').textContent = `Orders for ${cust.name} (${cust.phone})`;
    document.getElementById('cust-hist-total-spend').textContent = UIManager.formatCurrency(cust.totalSpend || 0);
    document.getElementById('cust-hist-points').textContent = `${cust.points} pts`;

    const custSales = sales.filter(s => s.customerId === customerId);
    document.getElementById('cust-hist-tx-count').textContent = custSales.length;

    const tbody = document.getElementById('cust-history-tbody');
    if (custSales.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:2rem;">No previous purchases recorded for this customer.</td></tr>`;
    } else {
      tbody.innerHTML = custSales.map(s => `
        <tr>
          <td><strong>${s.invoiceNumber}</strong></td>
          <td>${s.timestamp}</td>
          <td>${s.items.length} product(s)</td>
          <td><span class="badge badge-info">${s.paymentMethod}</span></td>
          <td><strong>${UIManager.formatCurrency(s.grandTotal)}</strong></td>
          <td><span class="text-success">+${s.pointsEarned} pts</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="POSModule.viewInvoiceReceipt('${s.invoiceNumber}')">
              <i class="fa-solid fa-receipt"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    UIManager.openModal('cust-history-modal');
  },

  bindEvents() {
    const searchInput = document.getElementById('cust-search-input');
    if (searchInput) searchInput.oninput = () => this.renderCustomers();

    const addBtn = document.getElementById('cust-add-btn');
    if (addBtn) addBtn.onclick = () => this.openAddCustomerModal();

    const form = document.getElementById('customer-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        this.saveCustomerForm();
      };
    }
  }
};

/* ============================================================================
   9. SALES & ANALYTICS MODULE
   ============================================================================ */
const AnalyticsModule = {
  init() {
    this.render();
    this.bindEvents();
  },

  render() {
    const sales = StorageManager.get(SmartMart.KEYS.SALES, []);
    const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
    const filter = SmartMart.state.analyticsFilter;

    // Filter sales based on date filter
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const filteredSales = sales.filter(s => {
      if (filter === 'all') return true;
      const sDate = new Date(s.timestamp.replace(' ', 'T'));
      const diffDays = (now - sDate) / (1000 * 60 * 60 * 24);

      if (filter === 'today') return s.timestamp.startsWith(todayStr);
      if (filter === '7d') return diffDays <= 7;
      if (filter === '30d') return diffDays <= 30;
      return true;
    });

    // Calculate Audited Financial KPIs
    const totalRev = filteredSales.reduce((acc, s) => acc + s.grandTotal, 0);
    const txCount = filteredSales.length;
    const aov = txCount > 0 ? (totalRev / txCount) : 0;

    // Inventory Valuation (Cost vs Retail)
    let totalInvCost = 0;
    let totalInvRetail = 0;
    products.forEach(p => {
      totalInvCost += (p.cost * p.stock);
      totalInvRetail += (p.price * p.stock);
    });

    // Estimate Margin from sold items
    let totalSoldCost = 0;
    filteredSales.forEach(s => {
      s.items.forEach(i => {
        totalSoldCost += (i.cost || (i.price * 0.75)) * i.qty;
      });
    });
    const estMarginPct = totalRev > 0 ? (((totalRev - totalSoldCost) / totalRev) * 100).toFixed(1) : '0';

    document.getElementById('ana-total-revenue').textContent = UIManager.formatCurrency(totalRev);
    document.getElementById('ana-tx-count').textContent = txCount;
    document.getElementById('ana-avg-order-val').textContent = UIManager.formatCurrency(aov);
    document.getElementById('ana-inv-cost-val').textContent = UIManager.formatCurrency(totalInvCost);
    document.getElementById('ana-inv-retail-val').textContent = UIManager.formatCurrency(totalInvRetail);
    document.getElementById('ana-est-margin').textContent = `${estMarginPct}%`;

    this.renderSalesTable(filteredSales);
    this.renderAnalyticsCharts(filteredSales);
  },

  renderSalesTable(sales) {
    const tbody = document.getElementById('ana-sales-table-body');
    if (!tbody) return;

    if (sales.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted" style="padding:2rem;">No sales records found for this period.</td></tr>`;
      return;
    }

    tbody.innerHTML = sales.map(s => {
      const summaryItems = s.items.map(i => `${i.name} (x${i.qty})`).join(', ');
      return `
        <tr>
          <td><strong>${s.invoiceNumber}</strong></td>
          <td><small>${s.timestamp}</small></td>
          <td>${s.customerName}</td>
          <td><span class="badge badge-info">${s.paymentMethod}</span></td>
          <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${summaryItems}">
            ${summaryItems}
          </td>
          <td>${UIManager.formatCurrency(s.subtotal)}</td>
          <td>${UIManager.formatCurrency(s.tax)}</td>
          <td class="text-emerald">${s.discount > 0 ? '-' + UIManager.formatCurrency(s.discount) : '₹0'}</td>
          <td><strong>${UIManager.formatCurrency(s.grandTotal)}</strong></td>
          <td class="text-right">
            <button class="btn btn-secondary btn-sm" onclick="POSModule.viewInvoiceReceipt('${s.invoiceNumber}')">
              <i class="fa-solid fa-print"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderAnalyticsCharts(sales) {
    if (typeof Chart === 'undefined') return;

    // 1. Revenue Trend Chart
    const trendCtx = document.getElementById('anaRevenueTrendChart');
    if (trendCtx) {
      if (SmartMart.state.charts.anaRevenue) SmartMart.state.charts.anaRevenue.destroy();

      // Aggregate revenue by date
      const revByDate = {};
      sales.forEach(s => {
        const d = s.timestamp.split(' ')[0];
        revByDate[d] = (revByDate[d] || 0) + s.grandTotal;
      });

      const dates = Object.keys(revByDate).sort();

      SmartMart.state.charts.anaRevenue = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: dates.length ? dates : ['No Data'],
          datasets: [{
            label: 'Sales Revenue (₹)',
            data: dates.length ? dates.map(d => revByDate[d]) : [0],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: v => '₹' + v }
            }
          }
        }
      });
    }

    // 2. Category Pie Chart
    const catCtx = document.getElementById('anaCategoryPieChart');
    if (catCtx) {
      if (SmartMart.state.charts.anaCategory) SmartMart.state.charts.anaCategory.destroy();

      const products = StorageManager.get(SmartMart.KEYS.PRODUCTS, []);
      const prodCatMap = {};
      products.forEach(p => prodCatMap[p.id] = p.category);

      const catSales = {};
      sales.forEach(s => {
        s.items.forEach(i => {
          const cat = prodCatMap[i.id] || 'General';
          catSales[cat] = (catSales[cat] || 0) + i.total;
        });
      });

      SmartMart.state.charts.anaCategory = new Chart(catCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(catSales),
          datasets: [{
            data: Object.values(catSales),
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' }
          }
        }
      });
    }

    // 3. Top 5 Products Bar Chart
    const topCtx = document.getElementById('anaTopProductsChart');
    if (topCtx) {
      if (SmartMart.state.charts.anaTopProd) SmartMart.state.charts.anaTopProd.destroy();

      const prodQty = {};
      sales.forEach(s => {
        s.items.forEach(i => {
          prodQty[i.name] = (prodQty[i.name] || 0) + i.qty;
        });
      });

      const sorted = Object.entries(prodQty).sort((a, b) => b[1] - a[1]).slice(0, 5);

      SmartMart.state.charts.anaTopProd = new Chart(topCtx, {
        type: 'bar',
        data: {
          labels: sorted.map(s => s[0].length > 18 ? s[0].substring(0, 18) + '...' : s[0]),
          datasets: [{
            label: 'Units Sold',
            data: sorted.map(s => s[1]),
            backgroundColor: '#3b82f6',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: { legend: { display: false } }
        }
      });
    }

    // 4. Payment Method Pie Chart
    const payCtx = document.getElementById('anaPaymentPieChart');
    if (payCtx) {
      if (SmartMart.state.charts.anaPayment) SmartMart.state.charts.anaPayment.destroy();

      const methods = {};
      sales.forEach(s => {
        methods[s.paymentMethod] = (methods[s.paymentMethod] || 0) + s.grandTotal;
      });

      SmartMart.state.charts.anaPayment = new Chart(payCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(methods),
          datasets: [{
            data: Object.values(methods),
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  },

  exportSalesCSV() {
    const sales = StorageManager.get(SmartMart.KEYS.SALES, []);
    const headers = ['Invoice Number', 'Timestamp', 'Customer Name', 'Payment Method', 'Subtotal', 'Tax', 'Discount', 'Grand Total', 'Cashier'];

    const rows = sales.map(s => [
      `"${s.invoiceNumber}"`,
      `"${s.timestamp}"`,
      `"${s.customerName}"`,
      `"${s.paymentMethod}"`,
      s.subtotal,
      s.tax,
      s.discount,
      s.grandTotal,
      `"${s.cashier || 'Cashier'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartMart_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    UIManager.showToast('Sales report exported to CSV.', 'success');
  },

  bindEvents() {
    // Date filter pills
    document.querySelectorAll('#analytics-date-filters .date-pill').forEach(pill => {
      pill.onclick = () => {
        document.querySelectorAll('#analytics-date-filters .date-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        SmartMart.state.analyticsFilter = pill.getAttribute('data-range');
        this.render();
      };
    });

    const exportBtn = document.getElementById('analytics-export-csv-btn');
    if (exportBtn) exportBtn.onclick = () => this.exportSalesCSV();
  }
};

/* ============================================================================
   10. SETTINGS & SYSTEM RESET MODULE
   ============================================================================ */
const SettingsModule = {
  init() {
    this.loadSettings();
    this.bindEvents();
  },

  loadSettings() {
    const settings = StorageManager.get(SmartMart.KEYS.SETTINGS, {
      storeName: 'SmartMart Supermarket',
      storeAddress: '#12, Commercial Road, Central District',
      storePhone: '+91 98765 43210',
      storeGst: '29ABCDE1234F1Z5',
      taxRate: 5.0,
      currencySymbol: '₹',
      loyaltySpendRatio: 100,
      loyaltyRedemptionVal: 1.0
    });

    document.getElementById('set-store-name').value = settings.storeName;
    document.getElementById('set-store-address').value = settings.storeAddress;
    document.getElementById('set-store-phone').value = settings.storePhone;
    document.getElementById('set-store-gst').value = settings.storeGst;

    document.getElementById('set-tax-rate').value = settings.taxRate;
    document.getElementById('set-currency-symbol').value = settings.currencySymbol;
    document.getElementById('set-loyalty-spend').value = settings.loyaltySpendRatio;
    document.getElementById('set-loyalty-val').value = settings.loyaltyRedemptionVal;
  },

  saveStoreProfile() {
    const settings = StorageManager.get(SmartMart.KEYS.SETTINGS, {});
    settings.storeName = document.getElementById('set-store-name').value.trim();
    settings.storeAddress = document.getElementById('set-store-address').value.trim();
    settings.storePhone = document.getElementById('set-store-phone').value.trim();
    settings.storeGst = document.getElementById('set-store-gst').value.trim();

    StorageManager.set(SmartMart.KEYS.SETTINGS, settings);
    UIManager.showToast('Store branding details saved.', 'success');
  },

  saveRules() {
    const settings = StorageManager.get(SmartMart.KEYS.SETTINGS, {});
    settings.taxRate = parseFloat(document.getElementById('set-tax-rate').value) || 0;
    settings.currencySymbol = document.getElementById('set-currency-symbol').value.trim() || '₹';
    settings.loyaltySpendRatio = parseFloat(document.getElementById('set-loyalty-spend').value) || 100;
    settings.loyaltyRedemptionVal = parseFloat(document.getElementById('set-loyalty-val').value) || 1.0;

    StorageManager.set(SmartMart.KEYS.SETTINGS, settings);
    UIManager.showToast('Commercial and loyalty rules saved.', 'success');
  },

  exportDatabaseJSON() {
    const exportData = {
      version: '2.4',
      exportDate: new Date().toISOString(),
      products: StorageManager.get(SmartMart.KEYS.PRODUCTS, []),
      categories: StorageManager.get(SmartMart.KEYS.CATEGORIES, []),
      suppliers: StorageManager.get(SmartMart.KEYS.SUPPLIERS, []),
      purchaseOrders: StorageManager.get(SmartMart.KEYS.PURCHASE_ORDERS, []),
      customers: StorageManager.get(SmartMart.KEYS.CUSTOMERS, []),
      sales: StorageManager.get(SmartMart.KEYS.SALES, []),
      stockMovements: StorageManager.get(SmartMart.KEYS.STOCK_MOVEMENTS, []),
      loyaltyLedger: StorageManager.get(SmartMart.KEYS.LOYALTY_LEDGER, []),
      settings: StorageManager.get(SmartMart.KEYS.SETTINGS, {})
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartMart_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    UIManager.showToast('Complete database exported to JSON.', 'success');
  },

  importDatabaseJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.products || !data.sales) {
          throw new Error('Invalid SmartMart JSON structure.');
        }

        StorageManager.set(SmartMart.KEYS.PRODUCTS, data.products);
        StorageManager.set(SmartMart.KEYS.CATEGORIES, data.categories || []);
        StorageManager.set(SmartMart.KEYS.SUPPLIERS, data.suppliers || []);
        StorageManager.set(SmartMart.KEYS.PURCHASE_ORDERS, data.purchaseOrders || []);
        StorageManager.set(SmartMart.KEYS.CUSTOMERS, data.customers || []);
        StorageManager.set(SmartMart.KEYS.SALES, data.sales || []);
        StorageManager.set(SmartMart.KEYS.STOCK_MOVEMENTS, data.stockMovements || []);
        StorageManager.set(SmartMart.KEYS.LOYALTY_LEDGER, data.loyaltyLedger || []);
        if (data.settings) StorageManager.set(SmartMart.KEYS.SETTINGS, data.settings);

        UIManager.showToast('Database restored successfully from file!', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        UIManager.showToast(`Failed to restore data: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
  },

  resetDemoData() {
    UIManager.confirm(
      'Restore Factory Seed Data',
      'This will erase all custom products, customer checkouts, and PO records created in this browser session and restore initial demonstration supermarket data. Proceed?',
      () => {
        localStorage.clear();
        StorageManager.seedInitialData();
        UIManager.showToast('Seed database restored. Refreshing store...', 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    );
  },

  bindEvents() {
    const storeForm = document.getElementById('settings-store-form');
    if (storeForm) {
      storeForm.onsubmit = (e) => {
        e.preventDefault();
        this.saveStoreProfile();
      };
    }

    const rulesForm = document.getElementById('settings-rules-form');
    if (rulesForm) {
      rulesForm.onsubmit = (e) => {
        e.preventDefault();
        this.saveRules();
      };
    }

    const exportBtn = document.getElementById('set-export-json-btn');
    if (exportBtn) exportBtn.onclick = () => this.exportDatabaseJSON();

    const importInput = document.getElementById('set-import-json-file');
    if (importInput) {
      importInput.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
          this.importDatabaseJSON(e.target.files[0]);
        }
      };
    }

    const resetBtn = document.getElementById('set-reset-data-btn');
    if (resetBtn) resetBtn.onclick = () => this.resetDemoData();
  }
};

/* ============================================================================
   11. INITIALIZATION ON DOM READY
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
