# 🌾 AgriTech - Empowering Farmers Through Digital Technology

> **Full-Stack MERN Agricultural Smart Management Platform**  
> *Developed for SkillWallet Project Evaluation*

---

## 📋 Overview

**AgriTech** is a smart, scalable, and multilingual web application designed to empower farmers with modern digital tools. It bridges the gap between traditional agricultural knowledge and cutting-edge technology by integrating **real-time weather intelligence**, **scientific soil NPK & pH analysis**, **biological pest defense alerts**, **crop monitoring across growth stages**, an **agri-resource marketplace**, and **expert agronomist consultations**.

---

## 🚀 Key Features & Modules

1. **User Authentication & Role-Based Access Control (RBAC)**
   - Secure JWT (JSON Web Tokens) authentication with `bcryptjs` password hashing.
   - Dual roles: **Farmer** (plot & crop management, ordering, asking questions) and **Admin / Agronomist** (system metrics, broadcasting pest alerts, answering queries).
   - Fast 1-click demo login buttons for mentor evaluation.

2. **Farm Profile Setup & Management (CRUD)**
   - Register multiple farm plots with acreage, location (state, district, village), soil classification (Alluvial, Black, Loamy, etc.), and irrigation type (Drip, Sprinkler, Canal, Borewell).

3. **Crop Monitoring & Phenological Tracking**
   - Track crop growth stages (Sowing, Vegetative, Flowering, Grain Filling, Ready to Harvest).
   - Real-time health status monitoring, notes, and projected yield forecasting (in kg).

4. **Soil Health & NPK Diagnostics**
   - Algorithmic analysis of Nitrogen (N), Phosphorus (P), Potassium (K), and pH levels.
   - Generates an overall Soil Health Score (0–100) and actionable corrective remedies (e.g. Agricultural Lime for acidic soil, Gypsum for alkaline soil, organic compost).
   - Suggests prime compatible crops based on soil test results.

5. **Weather Forecasting & Pest Alert Notifications**
   - Live agro-meteorological indicators (Temperature, Humidity, Wind speed, Precipitation risk).
   - 5-day farming forecast with daily field advisories (ideal spray windows, irrigation recommendations).
   - Early pest & disease alerts (e.g. Fall Armyworm, Yellow Rust, Aphids) with organic and chemical remedies.
   - Admin alert broadcast system.

6. **Agri-Resource Marketplace & Order Tracking**
   - Browse certified hybrid seeds, organic vermicompost, bio-pesticides, and solar drip kits.
   - Category filtering, search, cart management, and order checkout with Kisan Pay / Cash on Delivery.
   - Real-time order dispatch timeline (Confirmed &rarr; Dispatched &rarr; Delivered).

7. **Agronomist Consultation & Community Forum**
   - Farmers can post queries with category tags.
   - University agronomists and peer farmers can provide verified solutions and upvote helpful answers.

8. **Admin Control Center**
   - High-level platform statistics: Total users, registered acreage, active crops, orders, platform revenue.
   - Order fulfillment manager & user directory.

9. **Multilingual & Accessibility Ready**
   - One-click language switcher supporting **English (EN)**, **Hindi (हिन्दी)**, and **Telugu (తెలుగు)**.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js, CORS, Dotenv
- **Frontend:** React.js (Vite), React Router v6, Axios, Lucide React, Bootstrap 5
- **Database:** MongoDB (Local or MongoDB Atlas) + Built-in offline memory fallback

---

## ⚡ Quick Start Guide (Run Locally)

### 1. Prerequisites
Ensure **Node.js (v18+)** is installed.

### 2. Start the Backend API Server
Open a terminal in the project directory:
```bash
cd backend
npm install
npm start
```
*Backend runs on:* `http://localhost:5000`

### 3. Start the Frontend React Client
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:3000`

---

## 🔑 Demo Evaluation Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer@agritech.com` | `farmer123` | Farm CRUD, Crop tracking, Soil analysis, Marketplace, Orders |
| **Admin** | `admin@agritech.com` | `admin123` | Full admin stats, Broadcast alerts, Order status update, Expert forum |

*(Both accounts are pre-loaded with sample farms, crops, orders, and forum questions!)*

---

## 🍃 MongoDB Configuration (Optional Cloud Setup)

The backend runs automatically out of the box using built-in memory storage for instant zero-config testing. To connect to your cloud **MongoDB Atlas**:
1. Open `backend/.env`.
2. Update the `MONGO_URI`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/agritech?retryWrites=true&w=majority
   ```
3. Populate sample data:
   ```bash
   cd backend
   npm run seed
   ```

---

## 📤 How to Push to GitHub

To submit your GitHub link to SkillWallet:
```bash
git init
git add .
git commit -m "feat: complete AgriTech MERN smart farming platform"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/agritech-mern.git
git push -u origin main
```
