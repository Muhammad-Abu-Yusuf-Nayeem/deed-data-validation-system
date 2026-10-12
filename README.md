# Deed Data Valid Data Entry System

A secure, high-concurrency, web-based data entry portal tailored for managing land and deed registration records for the Purbachal Project. Designed to replace error-prone manual spreadsheets with an intuitive, standardized, and access-controlled workflow.

A web-based data-entry workflow for capturing land purchase deed information in a structured format using Google Apps Script and Google Sheets.

The project is intended to reduce inconsistent data entry, make deed dates unambiguous, support concurrent submissions, and establish a review-and-approval process before records are treated as clean data.

---

## 🚀 Key Features & Architectural Advantages

### 1. Secure Google Authentication & Authorization
* **Authorized Access Only:** The system restricts entry using an external **`Users`** database sheet. Only pre-approved personnel can access the application interface.
* **Google Identity Binding:** Leverages Google Active User Session to verify credentials securely and prevent unauthorized data modifications.

### 2. Standardized Data Integrity & Dropdown Control
* Eliminates inconsistent spelling, typographical anomalies, and variations in administrative names (e.g., Mouza, Thana, Deed Types, and Grantee Codes) by utilizing locked, dynamic master data dropdowns.
* Prevents date ambiguity (e.g., MM/DD vs. DD/MM confusion) by employing native HTML5 standardized date pickers (`YYYY-MM-DD`).

### 3. High-Concurrency Transaction Management
* Implements **Google Apps Script Lock Service (`LockService`)**, allowing multiple data operators (e.g., 5+ concurrent users) to submit records simultaneously without race conditions or database corruption.

### 4. Accountability & Performance Auditing
* **Automatic Record Tracking:** Every transaction generates a unique timestamped identifier (`REC-YYYYMMDD-HHMMSS`).
* **Operator Attribution:** Automatically appends the submitter's email address to every data row, establishing clear accountability, tracking daily entry volumes, and identifying processing performance (speed/accuracy) per user.

---

## 📂 Project Structure

- **`Code.js`**: Backend logic handling Google Sheets integration, transaction locks, and user authorization mapping.
- **`data entry.html`**: Fully responsive frontend UI built with Tailwind CSS, featuring modern form controls, dynamic multi-dag entry rows (1 to 10), and integrated Google Sign-In gate.

---
## Technology stack

-   HTML
-   CSS and Tailwind CSS
-   JavaScript
-   Google Apps Script
-   Google Sheets
-   Git and GitHub

## Repository structure

``` text
deed-data-validation-system/
├── Code.gs
├── data entry.html
├── README.md
└── .gitignore
```
## 🛠️ Setup and Deployment Guide

1. **Google Sheet Preparation:**
   * Create a Google Sheet with a tab named **`Data`** (containing headers for Record ID, Email, Files, Mouza, Thana, Deed Info, Khatian, and Dag details).
   * Create a second tab named **`Users`** with columns: `SL`, `Email`, and `Password Hash` (or authorized user emails).
2. **Apps Script Deployment:**
   * Open the Google Sheet, go to **Extensions > Apps Script**.
   * Paste the provided `Code.js` script.
3. **Frontend Integration:**
   * Create an HTML file named `data entry` in the Apps Script editor and paste the HTML markup.
   * Deploy as a **Web App** (`Execute as: Me`, `Who has access: Anyone`).

## Security

-   `.clasp.json` is intentionally excluded from Git using `.gitignore`.
-   Do not commit real deed records, personal information,
    company-confidential data, credentials, or access tokens.
-   Restrict spreadsheet and web-app access to authorized users.
-   Test how user identity is captured under the chosen Google Apps
    Script deployment and access settings; the active user's email may
    not be available in every deployment context.

## Project status

**Status:** Initial web-form data capture implemented; analyst review
and approved-data transfer planned.

This repository is an evolving internal-workflow and portfolio project.
Validate the application with test data and review access controls
before production use.
