# TrackForge

TrackForge is a unified personal productivity and finance web application built with the MERN stack. It merges an Expense Tracker and a Schedule / Task Tracker into one clean dashboard.

## Features

- **Expense Tracker**: Log, categorize, and visualize personal spending.
- **Schedule / Task Tracker**: Manage tasks, events, deadlines, and priorities.
- **Unified Dashboard**: View insights from both modules in one place.
- **Minimalist Light UI**: Designed with a calm, airy, off-white theme.
- **User Authentication**: Secure JWT-based registration and login.
- **Data Isolation**: Each user's data is strictly scoped to their own account.

## Tech Stack

- **Frontend**: React (Vite), React Router v6, Tailwind CSS, Recharts, Lucide React, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs

## Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or a MongoDB Atlas URI)

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd trackforge
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

   - Ensure the `.env` file in the `server` directory has the correct values:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/trackforge
     JWT_SECRET=your_super_secret_key_here
     NODE_ENV=development
     ```
   - Start the backend server:
     ```bash
     npm run dev
     # or
     node server.js
     ```

3. **Frontend Setup**

   ```bash
   cd client
   npm install
   ```

   - Ensure the `.env` file in the `client` directory has the correct value:
     ```env
     VITE_API_BASE_URL=http://localhost:5000/api
     ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Access the App**
   Open your browser and navigate to `http://localhost:5173`.

## Architecture Details

- **Backend**: The Express application is structured in `routes`, `controllers`, and `services` layers for clean business logic separation.
- **Frontend**: The React application uses `AuthContext` to manage the session state globally. A custom Axios instance with an interceptor automatically attaches the JWT token to every outgoing request.

