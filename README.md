# 🍽️ TheGoodPlate

A MERN web app that connects food donors with volunteers to reduce food waste.

## ⭐ Overview

TheGoodPlate enables donors to share surplus food and volunteers to discover available food listings nearby. The system handles real-time food availability, expiry tracking, partial item selection, and automatic removal of expired listings.

## 🚀 Live Demo
- Application: [the-good-plate.vercel.app](https://the-good-plate.vercel.app/)
- Video Walkthrough (2 min 40 sec): [Watch on YouTube](https://www.youtube.com/watch?v=1b5ANbL8FjA)

## 🚀 Features

### 👤 User Flow
- **Start as Donor** → Create & manage listings  
- **Start as Volunteer** → View Nearby Listings / View All Listings  

### 🥗 Donor Features
- Create listings with multiple food items  
- Edit listings (add/remove items, update quantities)  
- Delete listings with confirmation dialog  
- Expiry auto-calculated from shelf life (e.g., "2 days", "6 hours")  
- Listings auto-deleted after expiry (MongoDB TTL)

### 🙋 Volunteer Features
- View all active listings  
- Find nearby listings using radius-based geo search  
- View detailed listing info  
- Select full or partial quantities  
- Booking actions:  
  - Reserve items  
  - Cancel reservation  
  - Mark as Delivered  

### 🕒 Smart Expiry System
- Each item has its own expiry  
- Expired or depleted items auto-marked unavailable  
- Listings auto-removed using MongoDB TTL when all items expire  

## 🛠️ Tech Stack

**Frontend:** React, React Router, React Toastify, SweetAlert2, Bootstrap  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JOI  
**Other:** JWT Authentication, GeoSpatial Queries, TTL Indexes  

## 🧩 How It Works (Simplified)

- Shelf life → expiry timestamp generated automatically  
- Bookings decrease `remainingQuantity` in real time  
- Editing quantity resets remaining = new quantity  
- Nearby listings fetched using `$geoNear`  
- Expired listings removed via TTL index:

```javascript
listingSchema.index({ overallExpiresAt: 1 }, { expireAfterSeconds: 0 });
```
## ▶️ Running Locally

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
###  📸 Screenshots
<img width="1919" height="910" alt="Screenshot 2025-11-21 023255" src="https://github.com/user-attachments/assets/313598a6-ff10-4376-926e-bfad358678b0" />
<img width="1919" height="907" alt="Screenshot 2025-11-21 023833" src="https://github.com/user-attachments/assets/2c42abcf-07fa-4c2b-8eb4-0c1e44f5e0ba" />
<img width="1919" height="913" alt="Screenshot 2025-11-21 023348" src="https://github.com/user-attachments/assets/880b8247-881b-49df-818b-db955ba7d8cc" />
<img width="1919" height="912" alt="Screenshot 2025-11-21 023454" src="https://github.com/user-attachments/assets/90727fa5-bd68-4c65-ae41-a95d65fbee9b" />
