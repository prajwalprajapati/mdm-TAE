# SpendWise: Digital Expense Manager with Charts UI

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

A responsive, client-side **Digital Expense Manager & Cashflow Balancer** built using semantic HTML5, Tailwind CSS CDN, Vanilla JavaScript (ES6+), and Chart.js.

---

## 🌟 Key Features

1. **Visual Income vs Outcome Balancer Gauge**:
   - Real-time inflow vs outflow percentage ratio bar.
   - Financial Health status badge (*Surplus*, *Balanced*, *Deficit*).
   - Net balance & Savings Rate calculation.
   - Monthly budget cap tracker with real-time threshold progress.

2. **Handcrafted Greyish-Black Modern UI**:
   - Premium zinc/slate dark mode and clean light mode with seamless toggle.
   - Micro-interactions, custom toast alerts, and modal dialogs.
   - Mobile-first, fully responsive layout.

3. **Interactive & Dynamic Charts UI**:
   - **Cashflow Timeline Chart**: Toggle between Multi-Month Bar Comparison and Area Trendline.
   - **Category Breakdown Doughnut Chart**: Interactive spend distribution with percentage badges.
   - Theme-synced chart colors (auto-adapting grids & tooltips on Dark/Light mode change).

4. **Complete Ledger CRUD & Local Storage**:
   - Add, edit, and delete transactions with full validation.
   - Live search by title, note, or payment method.
   - Filter by type (*All, Income, Expense*) and category (*Food, Housing, Transport, etc.*).
   - Multi-field sorting (*Date Newest/Oldest, Amount High/Low*).
   - Pagination for long ledgers.
   - Data persists across browser refreshes via `window.localStorage`.

5. **Data Backup & Export**:
   - Export ledger to **CSV Spreadsheet** for Excel/Google Sheets.
   - Backup data to **JSON**.
   - Demo dataset quick reset button.

---

## 📁 File Structure

```text
digital-expense-manager/
├── index.html        # Semantic HTML5 layout & components
├── style.css         # Custom theme styling, scrollbars & print rules
├── app.js            # Core JavaScript application, storage & Chart.js logic
├── README.md         # Project documentation & setup instructions
└── PROJECT_REPORT.md # Academic PBL report for TAE-1 submission
```

---

## 🚀 How to Run Locally

1. Clone or download this project folder.
2. Open `index.html` directly in any modern browser (Google Chrome, Microsoft Edge, Brave, Firefox, Safari).
3. (Optional) Run with Live Server in VS Code for live reload during development.

---

## 🌐 Deployment to GitHub Pages

1. Initialize a git repository and commit the files:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of Digital Expense Manager with Charts UI"
   ```
2. Push to your GitHub repository:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
3. Enable GitHub Pages:
   - Go to **Settings** > **Pages** in your GitHub repository.
   - Under **Branch**, select `main` and `/root`, then click **Save**.
   - Your live site will be published at `https://<your-username>.github.io/<your-repo-name>/`.

---

## 👨‍🎓 Academic Assessment Alignment (TAE-1)

- **Subject**: MDM-Web Fundamentals & Basic Frontend Design
- **Topic ID / Title**: Digital Expense Manager with Charts UI
- **Criteria Met**:
  - Semantic HTML5 structure.
  - Tailwind CSS CDN for styling.
  - Vanilla JS for state, storage, and calculations.
  - Chart.js for data visualization.
  - LocalStorage persistence for client-side functionality.
