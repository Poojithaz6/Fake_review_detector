# AI-Based Fake Review Detection System

A full-stack role-based web application that detects suspicious product reviews using AI-inspired review analysis and database-driven workflows.

---

# - Project Overview

The **AI-Based Fake Review Detection System** is designed to help identify fake or suspicious product reviews in e-commerce platforms.

The system allows:

* Users to:

  * Browse products
  * Place orders
  * Submit reviews for purchased products

* Company Admins to:

  * Monitor reviews related to their products
  * View AI-generated fake review probability
  * Identify suspicious reviews

The project integrates:

* Frontend Development
* Backend APIs
* Database Management System concepts
* AI-based review analysis
* Role-Based Access Control (RBAC)

---

# Features

## User Features

* User Login

* Browse Products

* Place Orders

* Submit Product Reviews

* Review only purchased products

* AI review analysis after submission

---

## Admin Features

* Admin Login

* Company-specific dashboard

* View customer reviews

* View fake review probability

* Detect suspicious reviews

* Monitor company products only

---

## AI Detection Features

* Fake review probability calculation

* Fake / Genuine classification

* Keyword-based suspicious review analysis

---

# Tech Stack

| Technology | Purpose             |
| ---------- | ------------------- |
| React.js   | Frontend UI         |
| Node.js    | Backend Runtime     |
| Express.js | API Development     |
| MariaDB    | Database Management |
| Axios      | API Communication   |
| JavaScript | Application Logic   |

---

# Project Structure

```bash
DBMS_Project/
│
├── backend/
│   ├── db.js
│   ├── ai.js
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── LoginPage.jsx
│   │   ├── UserDashboard.jsx
│   │   └── AdminDashboard.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Database Tables

| Table Name | Purpose                    |
| ---------- | -------------------------- |
| User       | Stores user information    |
| Admin      | Stores admin credentials   |
| Product    | Stores product details     |
| Orders     | Stores product orders      |
| Review     | Stores customer reviews    |
| AI_Result  | Stores AI analysis results |
| Company    | Stores company details     |

---

# System Workflow

```text
USER LOGIN
    ↓
Browse Products
    ↓
Place Order
    ↓
Submit Review
    ↓
AI analyzes review
    ↓
Result stored in database

ADMIN LOGIN
    ↓
View company-specific reviews
    ↓
Monitor fake review probability
```

---

# Role-Based Access Control

The system implements Role-Based Access Control (RBAC).

### Users

Can:

* order products
* submit reviews
* access user dashboard

Cannot:

* access admin dashboard

---

### Admins

Can:

* access company reviews only
* monitor AI review results

Cannot:

* access reviews from other companies

---

# ⚙️ Installation Guide

## 1. Clone Repository

```bash
git clone <repository-link>
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Run backend:

```bash
node index.js
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Database Setup

Create database:

```sql
CREATE DATABASE FakeReviewDetection;
```

Use database:

```sql
USE FakeReviewDetection;
```

Create required tables:

* User
* Product
* Orders
* Review
* AI_Result
* Admin
* Company

---

# Backend APIs

## User Login

```http
POST /user/login
```

---

## Admin Login

```http
POST /admin/login
```

---

## Get Products

```http
GET /products
```

---

## Place Order

```http
POST /order
```

---

## Submit Review

```http
POST /review
```

---

## Admin Review Monitoring

```http
GET /admin/reviews/:company_id
```

---

# AI Review Detection Logic

The AI module analyzes reviews using suspicious patterns such as:

* excessive promotional keywords
* repeated terms
* extremely short reviews
* spam-like content

Example:

```text
"best product buy now"
```

may be classified as suspicious.

---

# Expected Outputs

## User Side

* Login Interface

* Product Dashboard

* Order Confirmation

* Review Submission

* AI Result Display

---

## Admin Side

* Review Monitoring Dashboard

* Fake Review Identification

* Company-specific Review Filtering

---

# DBMS Concepts Used

* ER Modeling

* Relational Schema Design

* Normalization

* Constraints

* Joins

* Views

* Triggers

* Transactions

* Concurrency Control

* Database Connectivity

---

# Future Enhancements

* Machine Learning-based fake review prediction

* JWT authentication

* Cloud database deployment

* Real-time analytics dashboard

* Review sentiment analysis

---

# Developed By

**Poojitha V**

AI-Based Fake Review Detection System

---

# References

* React.js Documentation
* Node.js Documentation
* Express.js Documentation
* MariaDB Documentation
* Database System Concepts by Silberschatz
