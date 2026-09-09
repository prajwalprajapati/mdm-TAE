# PROJECT REPORT
## On
# Digital Expense Manager with Charts UI

**Submitted in partial fulfilment of**  
**“TAE-1 (Project Based Learning)”**  
**Under the Subject: MDM-Web Fundamentals & Basic Frontend Design**  
*(III Semester, B.Tech. CSE)*  
*(ACADEMIC SESSION 2026-27)*  

---

### TAE DETAILS
- **Topic Name**: Digital Expense Manager with Charts UI
- **Student Name**: Prajwal Prajapati
- **Email Address**: prajwal@gmail.com
- **Technology Stack**: HTML5, Tailwind CSS CDN, Vanilla JavaScript (ES6+), Chart.js, LocalStorage
- **Deployment Platform**: GitHub Pages

---

### 1. ABSTRACT
The **Digital Expense Manager with Charts UI** is a responsive web application designed to help users record, balance, and visualize their daily financial transactions. The system tracks both income inflows and expense outflows, automatically computing the net balance, savings rate, and financial health status. Through integrated Chart.js visualizations, the application renders dynamic cashflow timelines and category-wise spend breakdowns. All records are persisted client-side using browser `localStorage`, ensuring data retention without requiring an external backend database.

---

### 2. INTRODUCTION & OBJECTIVES
Managing personal finances manually often results in calculation errors and lack of visual insights into spending habits. The Digital Expense Manager provides a centralized web solution with real-time feedback.

**Objectives:**
- To build a clean, semantic web application using HTML5, Tailwind CSS, and JavaScript.
- To balance income versus expense entries with a visual gauge indicator.
- To provide dynamic chart visualizations (cashflow timeline and category doughnut breakdown).
- To enable full CRUD operations (Add, Edit, Delete) for financial records.
- To persist data locally via browser Local Storage.
- To implement Dark/Light mode theme switching with a modern greyish-black aesthetic.
- To support data export in CSV and JSON formats.

---

### 3. METHODOLOGY
The system operates on an **Input → Processing → Visual Output** architecture:
1. **Input**: User enters transaction details (Title, Type, Amount, Category, Payment Method, Date, Notes) or sets a monthly budget cap.
2. **Processing**:
   - `Total Income = Σ(Income Entries)`
   - `Total Expense = Σ(Expense Entries)`
   - `Net Balance = Total Income - Total Expense`
   - `Savings Rate (%) = ((Total Income - Total Expense) / Total Income) × 100`
   - `Income Ratio = (Total Income / (Total Income + Total Expense)) × 100`
3. **Storage**: State is synchronized to `localStorage.setItem('spendwise_transactions', ...)` on every mutation.
4. **Visual Output**: Metrics cards, interactive balance gauge, Chart.js multi-month timeline, category doughnut distribution, and paginated filterable transaction ledger.

---

### 4. PROJECT ARCHITECTURE & COMPONENT BREAKDOWN
- **HTML5 Component (`index.html`)**: Semantic markup (`<header>`, `<main>`, `<section>`, `<dialog>`, `<table>`, `<footer>`).
- **Tailwind CSS & Styling (`style.css`)**: Dark/Light mode classes, custom scrollbars, animations, responsive grid system.
- **JavaScript Engine (`app.js`)**: State management, DOM manipulation, form validation, filter/search algorithms, CSV/JSON export routines.
- **Chart.js Module**: High-resolution rendering with auto-adjusting light/dark color schemes.
- **LocalStorage Module**: Persistent browser-level data store.

---

### 5. CONCLUSION & FUTURE ENHANCEMENTS
The project successfully meets all requirements of TAE-1 PBL evaluation criteria. Future extensions may include:
- Cloud database synchronization (Firebase / Supabase).
- OCR receipt scanning to auto-extract transaction amounts.
- Multi-currency support and currency exchange rate APIs.
- User authentication and multi-account management.
