# SmartMart – Integrated Retail Management System

A centralized, responsive, single-page retail administration and Point-of-Sale (POS) application designed to digitize and integrate supermarket operations.

Developed as a functional demonstration application for **Git Lab 6: Web Application Development and Version Control Submission**.

---

## 1. Project Abstract

Traditional retail stores and mid-sized supermarkets often depend on fragmented, manual, or semi-digital record-keeping mechanisms. Disconnected spreadsheets, paper bills, and unintegrated inventory logs lead to human calculation errors, stock discrepancies, unnoticed expiry of perishable goods, and missed customer retention opportunities.

**SmartMart** addresses these challenges by offering an integrated, browser-based retail management dashboard. It consolidates product cataloging, safety stock monitoring, real-time Point of Sale (POS) checkout, supplier replenishment workflow, customer loyalty point accounting, and sales analytics into a unified client-side interface. Running purely on standard web technologies without external server dependencies, SmartMart demonstrates end-to-end retail workflow mechanics using local browser persistence.

---

## 2. Problem Statement

Supermarket floor operations require rapid, accurate coordination between cashiers, inventory handlers, procurement staff, and store administrators:
1. **Billing Delays and Overselling:** Manual price calculation or unlinked inventory causes cashiers to accidentally sell items that are out of stock or already expired.
2. **Stock Discrepancies:** Receiving new shipments from vendors without immediate digital ledger updates leads to phantom inventory or stockout scenarios.
3. **Customer Retention:** Disconnected checkout counters fail to incentivize repeat patrons through transparent loyalty accruals and point redemptions.
4. **Lack of Operational Visibility:** Store owners lack immediate financial visibility into daily revenue trends, gross margin estimates, and department-level sales share.

---

## 3. Project Objectives

- **Centralized Inventory Control:** Provide a single source of truth for products, SKUs, barcode mappings, purchase costs, selling prices, minimum safety thresholds, and expiry alerts.
- **Accurate POS Billing Engine:** Implement a fast, cashier-friendly Point of Sale module that validates stock levels, computes tax and line discounts, simulates tender payments, and produces authentic printable thermal receipts.
- **Supplier & Purchase Order Lifecycle:** Enable creation of supplier replenishment orders and automate inventory increments upon marking purchase orders as received.
- **Customer Relationship & Loyalty:** Accrue and redeem loyalty points on transactions using consistent rules (1 point per ₹100 spent, ₹1 redemption value).
- **Executive Sales Analytics:** Deliver visual metrics, revenue trends, top-selling product rankings, and category revenue distribution without requiring a backend database.
- **Zero-Dependency Portability:** Ensure the entire application runs natively in any standard modern web browser and can be hosted seamlessly on GitHub Pages.

---

## 4. Key Features & Modules

### 4.1. Real-Time Store Dashboard
- **Dynamic KPI Tiles:** Live calculation of today's sales revenue, completed transaction count, active product catalogue size, total inventory unit volume, and urgent low-stock/expired counts.
- **Visual Trends:** Interactive weekly sales performance bar chart and department-wise inventory allocation chart powered by Chart.js.
- **Recent Checkout Log:** Chronological table of the latest customer checkouts with one-click receipt inspection.
- **Urgent Action Alerts:** Direct listing of items requiring replenishment or clearance.

### 4.2. Point of Sale (POS) Billing Module
- **Barcode & SKU Lookup Simulator:** Live input field simulating physical barcode scanner triggers on `Enter` key.
- **Interactive Product Catalog:** Category pills, live search filter, visual stock badges, and click-to-add functionality.
- **Stock & Expiry Guards:** Strictly blocks addition or checkout of out-of-stock or expired merchandise.
- **Interactive Cart:** Real-time quantity adjustments, subtotal, tax (GST/VAT configurable), line removal, and total recalculations.
- **Customer Loyalty Integration:** Searchable registered patron selection, points balance display, and dynamic point redemption discount.
- **Payment Method Simulation:** Supports Cash (with tendered amount input and automatic change due calculator), Card, UPI QR simulator, and Mobile Wallet.
- **Printable Thermal Tax Invoice:** Formatted 80mm-width receipt modal equipped with a browser print trigger (`window.print()`) that isolates the receipt and hides UI chrome.

### 4.3. Product & Inventory Management
- Searchable, sortable, and filterable data table with category and stock status filters (In Stock, Low Stock, Out of Stock, Expired).
- Full product CRUD (Add, Edit, View, Deactivate/Delete) with unique SKU and Barcode validation.
- **Manual Stock Adjustment Modal:** Allows floor managers to add, subtract, or set exact counts with reason categorization (Restock, Damage/Breakage, Physical Audit, Customer Return).
- **Stock Movement Audit Log:** Chronological ledger detailing previous vs. new stock quantities, operation type, reason reference, and actor role.
- **CSV Data Export:** Client-side generation of inventory spreadsheets for audit backup.

### 4.4. Suppliers & Purchase Orders (PO)
- **Supplier Directory:** Register and maintain company details, vendor contact persons, phone numbers, and supplied product categories.
- **Purchase Order Workflow:** Create line-item POs specifying order quantities and unit purchase costs.
- **Auto-Draft PO for Low Stock:** One-click algorithm that detects all items at or below safety thresholds and prepares a replenishment order.
- **Goods Receiving Engine:** Marking an order as "Received" atomically increments product stock units in the database and prevents duplicate check-ins.

### 4.5. Customer & Loyalty Management
- Customer registry containing contact info, total spend history, and active loyalty points balance.
- Order audit history viewer per customer detailing all past invoices.
- Documented loyalty rule: 1 point earned per ₹100 spent; 1 point = ₹1 discount during checkout.

### 4.6. Sales Reports & Analytics
- Multi-period filtering: Today, Last 7 Days, Last 30 Days, All Time.
- Financial metrics: Total revenue, transaction volume, Average Order Value (AOV), inventory valuation (Cost vs. Retail), and gross margin estimate.
- 4 interactive Chart.js charts: Daily Revenue Trend, Category Revenue Share, Top 5 Best-Selling Products, and Payment Tender Breakdown.
- Export sales audit reports to CSV.

### 4.7. Role-Based Access Control Simulation (RBAC)
- Interactive role switcher demonstrating privilege differentiation across:
  - **Administrator:** Full, unrestricted store permissions.
  - **Store Manager:** Catalog, inventory, POs, and reporting.
  - **Cashier:** Front-desk billing, customer loyalty, and receipt reprints.
  - **Inventory Staff:** Stock levels, safety thresholds, and PO receiving.

### 4.8. Store Settings & Data Lifecycle
- Customizable store name, branch address, contact phone, and GSTIN registration for printed receipts.
- Configurable tax percentage, currency symbol, and loyalty redemption ratio.
- JSON data export and import for portable backup across different browsers.
- "Restore Factory Seed Data" button with confirmation step.

---

## 5. Technology Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Structure** | HTML5 Semantic Elements | Accessible, standards-compliant layout (`<aside>`, `<header>`, `<main>`, `<section>`). |
| **Styling** | Vanilla CSS3 (Custom Design System) | Forest-Emerald SaaS aesthetic, responsive flexbox/grid, print stylesheets, zero CSS bloat. |
| **Logic** | Vanilla JavaScript (ES6+) | Object-oriented modular controllers, event-driven state updates, zero framework build overhead. |
| **Persistence** | Browser `localStorage` API | Atomic client-side persistence that maintains state across browser reloads without a server. |
| **Visual Charts** | Chart.js (via CDN) | Lightweight interactive charts for revenue trends, category splits, and bestsellers. |
| **Iconography** | FontAwesome 6 (via CDN) | Industry-standard retail and interface icons. |
| **Typography** | Google Fonts (Inter & JetBrains Mono) | Clean corporate UI font paired with monospaced typography for thermal receipts and barcodes. |

---

## 6. Project Structure

```
SmartMart-Retail-Management/
├── index.html        # Main single-page application structure, modals, and views
├── style.css         # SaaS design tokens, layouts, POS panels, and @media print styles
├── script.js         # Core business logic, data models, persistence, and event handlers
└── README.md         # Academic assignment documentation and deployment guide
```

---

## 7. How to Run the Application Locally

Because SmartMart is built with pure web standards without build steps or compilation requirements, it can be launched directly:

### Option A: Direct Browser Launch
1. Download or clone this project repository to your local machine.
2. Locate the `SmartMart-Retail-Management` folder.
3. Double-click `index.html` or open it with any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Option B: Local HTTP Server (Recommended)
Using a lightweight local server ensures clean CDN asset loading:

- **Using Python 3:**
  ```bash
  cd SmartMart-Retail-Management
  python -m http.server 8000
  ```
  Open your browser and navigate to `http://localhost:8000`.

- **Using VS Code Live Server Extension:**
  Right-click `index.html` inside VS Code and choose **"Open with Live Server"**.

- **Using Node `npx serve`:**
  ```bash
  npx serve .
  ```

---

## 8. Data Persistence Architecture

SmartMart uses browser `localStorage` as a lightweight client-side relational storage layer:

| Storage Key | Data Model |
| :--- | :--- |
| `smartmart_products` | Product records (ID, SKU, barcode, name, category, supplier, cost, price, stock, minStock, expiry, status) |
| `smartmart_categories` | Retail departments and product categories |
| `smartmart_suppliers` | Vendor directory and supplied category mappings |
| `smartmart_purchase_orders` | Procurement orders, item lines, order totals, and fulfillment status |
| `smartmart_customers` | Patron profiles, contact information, spend totals, and loyalty point balances |
| `smartmart_sales` | Audited checkout records, line items, tax, discounts, tender details, and timestamps |
| `smartmart_stock_movements` | Audit ledger for stock additions, sales deductions, PO receipts, and audit corrections |
| `smartmart_loyalty_ledger` | Chronological debit/credit history for patron loyalty points |
| `smartmart_settings` | Store profile, tax rates, currency symbol, and loyalty ratios |
| `smartmart_role` | Active demonstration role selection |

> **First Visit Auto-Seeding:** On first load, SmartMart populates 22 realistic supermarket products, 5 suppliers, 5 customers, and historical sales data to ensure dashboard metrics and analytics are immediately demonstrable.

---

## 9. Known Limitations

- **Browser-Bound Storage:** `localStorage` is unique to the specific browser and machine used. Data does not automatically synchronize across multiple devices unless exported via the Settings JSON backup feature.
- **Client-Side RBAC Demonstration:** Role-based access control is simulated client-side for presentation and workflow demonstration. In production enterprise deployments, authorization must be validated server-side.
- **Payment & Hardware Simulation:** Payment gateway processing and physical barcode scanning are simulated via UI interactions and manual lookup fields; no real banking APIs or serial scanner hardware are required.

---

## 10. GitHub Pages Deployment Guide

To deploy this project to the public internet using GitHub Pages:

1. **Initialize Git Repository:**
   ```bash
   cd SmartMart-Retail-Management
   git init
   git add .
   git commit -m "Initial commit: Complete SmartMart retail management application"
   ```

2. **Push to Remote GitHub Repository:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - In your GitHub repository, navigate to **Settings** > **Pages** (under the "Code and automation" menu).
   - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`.
   - Click **Save**.
   - Wait 1–2 minutes for the GitHub Pages runner to publish the site.
   - Your live link will be available at: `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`.

---

## 11. Project Submission Links

- **GitHub Repository URL:** `[To be added by student]`
- **Live GitHub Pages URL:** `[To be added by student]`
- **Course / Lab:** Git Lab 6 – Integrated Web Applications
- **Submission Date:** October 2026
