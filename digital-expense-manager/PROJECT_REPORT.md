# PROJECT REPORT
## on
# Digital Expense Manager with Charts UI

**Submitted in partial fulfilment of**  
**“TAE-1 (Project Based Learning)”**  

**Under the Subject**  
**MDM-Web Fundamentals & Basic Frontend Design**  
**(III Semester, B.Tech. CSE)**  
**(ACADEMIC SESSION 2026-27)**  

---

**Topic ID:** WD-T1-154  
**Student Name:** Prajwal Prajapati  
**Email Address:** prajwal@gmail.com  

---

### S. B. JAIN INSTITUTE OF TECHNOLOGY, MANAGEMENT & RESEARCH, NAGPUR
**(AN AUTONOMOUS INSTITUTION AFFILIATED TO RASHTRASANT TUKADOJI MAHARAJ NAGPUR UNIVERSITY, NAAC ACCREDITED WITH 'A' GRADE)**  
**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**

---

### ~~ EVALUATION ~~

| Project Implementation & Functionality (01M) | Repository (01M) | Deployment (01M) | Documentation [PBL Report] (01M) | Viva-Voce (01M) | Total Marks (05M) | STUDENT SIGNATURE | FACULTY SIGNATURE |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| | | | | | | | |

<br>

---

## TAE DETAILS

| Field | Details |
| :--- | :--- |
| **TOPIC ID** | WD-T1-154 |
| **STUDENT NAME** | Prajwal Prajapati |
| **EMAIL ADDRESS** | prajwal@gmail.com |
| **TAE-1 TOPIC** | Digital Expense Manager with Charts UI |
| **GitHub REPOSITORY URL** | `https://github.com/prajwalprajapati/Digital-Expense-Manager` |
| **GitHub REPOSITORY QR CODE** | *[Insert static QR code generated from https://www.qrcode-monkey.com/]* |
| **DEPLOYMENT URL** | `https://prajwalprajapati.github.io/Digital-Expense-Manager/` |
| **DEPLOYMENT URL QR CODE** | *[Insert static QR code generated from https://www.qrcode-monkey.com/]* |

<br>

---

## 1. ABSTRACT
The **Digital Expense Manager with Charts UI** is a responsive, client-side web application engineered to record, categorize, and visually balance daily personal income and expense transactions. Traditional manual bookkeeping methods are prone to computational errors and lack immediate visual feedback on financial health. This system provides an intuitive interface developed with semantic HTML5, Tailwind CSS, and Vanilla JavaScript (ES6+), integrated with Chart.js for data visualization. 

The application computes net balance, savings rate percentage, category distributions, and real-time cashflow balance ratios. All data is persisted locally in the user's browser using the Web Storage API (`localStorage`), eliminating the requirement for external databases or server-side dependencies while ensuring instant responsiveness and privacy.

---

## 2. INTRODUCTION
Managing day-to-day finances, tracking variable expenses, and maintaining savings discipline requires continuous calculation and structured record-keeping. The Digital Expense Manager delivers a consolidated dashboard that provides real-time financial balancing, visual analytics, and transaction ledger control directly in the web browser.

### Objectives:
- To provide a clean, responsive single-page dashboard for logging income and expenditure.
- To visually balance income inflows against expense outflows using a real-time ratio bar.
- To render interactive data visualizations including a cashflow timeline (Bar and Trend Line views) and an expense category doughnut breakdown.
- To implement full CRUD (Create, Read, Update, Delete) transaction management with instant UI synchronization.
- To provide search, category filtering, type filtering, and multi-parameter sorting.
- To enforce budget caps with visual utilization warnings and remaining balance indicators.
- To store all records reliably using browser `localStorage` without external server overhead.
- To support data portability via CSV spreadsheet export and JSON backup.

---

## 3. METHODOLOGY
The system operates on a structured **Input → Processing → Storage → Visual Output** architecture:

```
[User Input: Auth / Transactions / Budget]
                   │
                   ▼
       [JavaScript Controller (app.js)]
      ┌────────────┴────────────┐
      ▼                         ▼
[Calculations Engine]    [Local Storage API]
(Balance, Ratio, Pct)    (Persistent JSON State)
      └────────────┬────────────┘
                   ▼
  [DOM Updating & Chart.js Engine]
(Cards, Dual Ratio Bar, Timeline & Doughnut)
```

### Step 1: User Authentication
The user signs in with their Name and Email address. A client-side session is stored in `localStorage` (`spendwise_user`), personalizing the dashboard and ledger header.

### Step 2: Transaction Entry & Classification
The user selects the transaction type:
- **Income (+)**: The user selects the income source (e.g., Salary & Stipend, Freelance & Gigs, Allowance, Investment, Other Inflow), amount, date, and payment mode. The title is automatically derived from the category.
- **Expense (-)**: The user enters an item title (e.g., Groceries, Rent, Utilities, Books), amount, date, expense category, and optional notes.

### Step 3: Mathematical Calculations & Business Logic
The JavaScript engine computes aggregate metrics on every state mutation:
1. **Total Income:**
   $$\text{Total Income} = \sum \text{Amount}_{\text{income}}$$
2. **Total Expenses:**
   $$\text{Total Expenses} = \sum \text{Amount}_{\text{expense}}$$
3. **Net Balance:**
   $$\text{Net Balance} = \text{Total Income} - \text{Total Expenses}$$
4. **Savings Rate (%):**
   $$\text{Savings Rate} = \left( \frac{\text{Total Income} - \text{Total Expenses}}{\text{Total Income}} \right) \times 100$$
5. **Flow Balance Ratios:**
   $$\text{Income Inflow Ratio} = \left( \frac{\text{Total Income}}{\text{Total Income} + \text{Total Expenses}} \right) \times 100$$
   $$\text{Expense Outflow Ratio} = 100\% - \text{Income Inflow Ratio}$$
6. **Budget Cap Utilization:**
   $$\text{Budget Used (\%)} = \min\left(100, \left(\frac{\text{Total Expenses}}{\text{Monthly Budget}}\right) \times 100\right)$$

### Step 4: UI Synchronization & Data Persistence
1. The metric cards and dual-colored ratio bar are updated via DOM manipulation.
2. Chart.js instances are refreshed with grouped chronological data.
3. The transaction array is serialized and saved via `localStorage.setItem('spendwise_transactions', JSON.stringify(transactions))`.

---

## 4. PROJECT ARCHITECTURE DIAGRAM

*(Generate/insert your architecture diagram exported from NotebookLM here, keeping it center-aligned)*

```
+-------------------------------------------------------------------------------+
|                                  USER / CLIENT                                |
+---------------------------------------+---------------------------------------+
                                        | (Interacts via Web Browser)
                                        v
+-------------------------------------------------------------------------------+
|                       FRONT-END LAYER (Client-Side SPA)                       |
|                                                                               |
|   +-----------------------+  +----------------------+  +------------------+   |
|   |  Semantic HTML5       |  |  Tailwind CSS        |  |  Chart.js        |   |
|   |  (Structure & Modals) |  |  (Slate Theme & UI)  |  |  (Canvas Charts) |   |
|   +-----------+-----------+  +----------+-----------+  +--------+---------+   |
|               |                         |                       |             |
|               +-------------------+     |     +-----------------+             |
|                                   |     |     |                               |
|                                   v     v     v                               |
|                        +---------------------------+                          |
|                        |   app.js (Core Controller)|                          |
|                        |   - State & Calculations  |                          |
|                        |   - Event Handlers        |                          |
|                        |   - Filters & Search      |                          |
|                        |   - CSV/JSON Export Engine|                          |
|                        +-------------+-------------+                          |
+--------------------------------------|----------------------------------------+
                                       | (Read / Write JSON)
                                       v
+-------------------------------------------------------------------------------+
|                            BROWSER STORAGE LAYER                              |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |  Window.localStorage                                                  |   |
|   |  - spendwise_transactions (JSON Array of entries)                     |   |
|   |  - spendwise_budget (Monthly threshold value)                         |   |
|   |  - spendwise_user (Name & Email authentication session)               |   |
|   |  - spendwise_theme (Dark / Light mode preference)                     |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```

---

## 5. TECHNOLOGY STACK

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Front-End** | HTML5 | Creates semantic structure (`<header>`, `<main>`, `<section>`, `<table>`, `<dialog>`) |
| **CSS / UI Framework** | Tailwind CSS (CDN) | Provides responsive utility-first styling, grid layouts, and slate dark/light theme |
| **Programming Language** | JavaScript (ES6+) | Handles state management, mathematical computations, DOM updates, and events |
| **Back-End** | Not Required | Operates completely as a client-side Single Page Application (SPA) |
| **Database** | Not Required | No server-side database required |
| **Data Storage** | Browser `localStorage` | Persists transaction history, user sessions, theme, and budget thresholds |
| **APIs** | Web Storage API, Canvas API | Used for data persistence and chart graphical rendering |
| **Libraries** | Chart.js, Lucide Icons | Renders responsive charts and vector iconography |
| **Development Tool** | Visual Studio Code | Used for writing, debugging, and structuring application source code |
| **Browser** | Chrome / Edge / Firefox | Target environment for running, executing, and testing the application |

### Main Features Implemented Using JavaScript:
- Client-side authentication and session persistence.
- Real-time income versus expense balancing with a dual-color flow bar.
- Dynamic multi-point timeline cashflow chart with Bar and Trend Line toggling.
- Categorized expense doughnut distribution chart with automated percentage legends.
- Add, Edit, and Delete transactions with input validation.
- Dynamic form behavior (hiding description/title for income and auto-assigning category names).
- Live query search, type filter, category filter, and multi-criteria sorting.
- Client-side data pagination for transaction ledgers.
- Export transaction records to CSV spreadsheets and JSON backup files.
- Responsive Dark Mode and Light Mode theme toggle with system preference sync.

---

## 6. APPLICATION SCREENSHOTS

*(Paste your center-aligned application screenshots below with the given figure labels)*

<br>

**Figure 6.1: Client-Side Login & Authentication Panel**  
*[Insert Screenshot of the Login Screen here - Center Aligned]*

<br>

**Figure 6.2: Main Dashboard & Real-Time Cashflow Balancer**  
*[Insert Screenshot of the Net Balance, Inflow vs Outflow Bar, and Metric Cards here - Center Aligned]*

<br>

**Figure 6.3: Interactive Visualizations (Timeline Chart & Category Doughnut)**  
*[Insert Screenshot of the Cashflow Timeline Bar/Trend chart and Expense Breakdown Doughnut here - Center Aligned]*

<br>

**Figure 6.4: Filterable Transaction Ledger & Modal Dialogs**  
*[Insert Screenshot of the Transactions Table, Search Bar, and Add/Edit Modal here - Center Aligned]*

<br>

---

## 7. CONCLUSION
The **Digital Expense Manager with Charts UI** successfully fulfills all the objectives outlined for the TAE-1 Project Based Learning assessment. The application delivers an efficient, responsive, and visually balanced tool for personal financial tracking. By leveraging HTML5, Tailwind CSS, and Vanilla JavaScript, the project demonstrates core web development concepts including asynchronous DOM manipulation, event-driven state updates, and client-side data persistence with `localStorage`. The integration of Chart.js provides clear, dynamic insights into cashflow distribution and spending trends.

### Future Enhancements:
- Integration with cloud databases (e.g., Supabase / Firebase) for multi-device synchronization.
- Automated OCR receipt scanning to extract amounts and merchant names directly from receipts.
- Recurring transaction automation for monthly subscriptions and rent.
- Multi-currency support with dynamic currency conversion APIs.
- Automated generation of downloadable PDF financial summary statements.

---

## 8. REFERENCES
1. **MDN Web Docs** — *HTML5 Semantic Elements and Structure Documentation.*  
   `https://developer.mozilla.org/en-US/docs/Web/HTML`
2. **Tailwind CSS Documentation** — *Utility-first CSS framework guides and class references.*  
   `https://tailwindcss.com/docs`
3. **MDN Web Docs** — *JavaScript Event Handling, DOM Manipulation, and Web Storage API (`localStorage`).*  
   `https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage`
4. **Chart.js Documentation** — *Configuration, Canvas rendering, and Dynamic Dataset updates.*  
   `https://www.chartjs.org/docs/latest/`
5. **W3Schools Online Web Tutorials** — *JavaScript Array Methods, Object Serialization, and Form Validation.*  
   `https://www.w3schools.com/js/`
