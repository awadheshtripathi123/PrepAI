
# 🚀 PrepAI – AI-Powered Interview Preparation Platform

PrepAI is a full-stack AI-powered interview preparation platform built using the MERN stack. It enables users to practice mock interviews, receive intelligent feedback, and enhance their technical and communication skills through personalized AI-driven sessions.

> 🎓 **Final Year Project**
> This project is developed as part of our final year academic curriculum.

---

## 🌟 Features

* 🎯 AI-based mock interview system
* 🧠 Intelligent feedback & performance tracking
* 🔐 Secure authentication (JWT + Google OAuth)
* 👥 Role-based access (User / Host)
* 📊 User dashboard with interview history
* 🔍 Search & filter interview questions
* 🌐 Responsive and user-friendly interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS / CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT (JSON Web Token)
* Google OAuth

---

## 📁 Project Structure

```id="x5a4u1"
PrepAI/
│
├── frontend/        # React frontend
├── backend/         # Express backend
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```id="d9js6u"
git clone https://github.com/your-username/PrepAI.git
cd PrepAI
```

---

### 2️⃣ Backend Setup

```id="ccz1y7"
cd backend
npm install
```

Create a `.env` file in the backend:

```id="h1af2k"
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

Run backend:

```id="1m3pxa"
npm run dev
```

---

### 3️⃣ Frontend Setup

```id="n1f0xt"
cd frontend
npm install
npm start
```

---

## 🔐 Environment Variables

Ensure `.env` files are properly configured in both frontend and backend.

Example (Frontend):

```id="h3z9rk"
REACT_APP_API_URL=http://localhost:5000
```

---


## 🚧 Project Status

This project is currently under active development. New features and improvements are being added regularly.

---




