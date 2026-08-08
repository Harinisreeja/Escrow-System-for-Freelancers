# Escrow System: MongoDB Integration & Operations Manual

This guide explains how to connect your new full-stack MERN Escrow System to MongoDB (both local instance and MongoDB Atlas Cloud) and how to run the application.

---

## 1. Setting Up MongoDB

You can run this project using either a **local MongoDB server** or a **MongoDB Atlas Cloud database**.

### Option A: MongoDB Atlas Cloud (Recommended)

MongoDB Atlas is a free cloud database service. Follow these steps to set up your account and get a connection string:

1. **Create an Account**:
   * Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.

2. **Create a Database Cluster**:
   * Choose the **FREE M0** shared tier.
   * Pick a cloud provider (e.g., AWS) and region nearest to you.
   * Click **Create Cluster**.

3. **Configure Database Access (Credentials)**:
   * Create a database user.
   * Enter a username (e.g., `harini`) and a strong password. **Write this password down!**
   * Click **Create User**.

4. **Configure Network Access (IP Access List)**:
   * Atlas restricts access by default. In the **Network Access** settings, click **Add IP Address**.
   * Choose **Allow Access From Anywhere** (which adds `0.0.0.0/0` to allow local server connection).
   * Click **Confirm**.

5. **Retrieve Connection String**:
   * Go to your cluster dashboard and click **Connect**.
   * Select **Drivers** (under Connect to your application).
   * Choose **Node.js** as your driver and select the latest version.
   * Copy the connection string. It will look like this:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```

6. **Update `.env`**:
   * Open [backend/.env](file:///C:/Users/harin/OneDrive/Escrow%20System%20for%20Freelancers/backend/.env).
   * Replace `MONGO_URI` with your copied string.
   * Be sure to swap `<username>` and `<password>` with the database user details you created in Step 3. (If your password contains special characters like `@` or `/`, URL-encode them, or create a simple password without special characters).
   * *Example:*
     ```env
     MONGO_URI=mongodb+srv://admin:<your-password>@cluster0.abcde.mongodb.net/escrow_db?retryWrites=true&w=majority
     ```

### Option B: MongoDB Local Server

If you prefer to run MongoDB on your own computer:
1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. Install [MongoDB Compass](https://www.mongodb.com/try/download/compass) (optional, a graphical database explorer).
3. Ensure the MongoDB service is running on your machine.
4. Your connection string in [backend/.env](file:///C:/Users/harin/OneDrive/Escrow%20System%20for%20Freelancers/backend/.env) is pre-configured for local server access:
   ```env
   MONGO_URI=mongodb://localhost:27017/escrow_system
   ```

---

## 2. Project Execution Manual

To start the application, follow these commands in your PowerShell/terminal. Make sure you are at the project root folder `C:\Users\harin\OneDrive\Escrow System for Freelancers`.

### Step 1: Install Root Coordinator
Make sure your root coordinator packages are installed:
```powershell
npm install
```

### Step 2: Install All Child Dependencies
You can automatically install both frontend and backend package dependencies by running this coordinator command:
```powershell
npm run install-all
```

### Step 3: Launch Frontend & Backend Simultaneously
To run the full stack (Node/Express backend on port 5000 and React/Vite dev server on port 5173):
```powershell
npm run dev
```
Vite will serve the frontend. Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 3. Verifying the Escrow Flow

When the database is connected and started, it automatically **seeds** itself with dummy users and jobs so the application works immediately!

You can log in and test the system with these pre-seeded accounts:

### Pre-Seeded Test Credentials
| Account Role | Email Address | Password | Balance |
| :--- | :--- | :--- | :--- |
| **Client** (Hires & Funds) | `client@escrow.com` | `password123` | **$15,000** |
| **Freelancer** (Applies & Earns) | `freelancer@escrow.com` | `password123` | **$2,500** |

### Step-by-Step Test Guide
1. **Explore Jobs**: Go to [http://localhost:5173](http://localhost:5173). Click "Find Jobs" to see the active seeded jobs (Web Developer, Freelancer Copywriter, UX Designer).
2. **Submit Application**:
   * Click **Login** and log in as `freelancer@escrow.com` (password `password123`).
   * Go to "Find Jobs", click on a job, click **Apply Now**, fill out the bid and cover letter, and submit.
   * Go to your **Dashboard** to see the application listed as **Pending**.
3. **Accept & Fund Escrow**:
   * Click **Logout** and log in as the client `client@escrow.com` (password `password123`).
   * Navigate to your **Dashboard**. Under "My Job Listings", locate the job and click **View Applicants**.
   * In the tray that appears, click **Accept** on the freelancer's application.
   * Click **Setup Escrow**. Review the contract amount and click **Confirm & Lock Funds**.
   * Notice that the Client's wallet balance drops, and the Escrow shows as **Locked**.
4. **Release Payment**:
   * Once you are ready to simulate completion, log in as `client@escrow.com`.
   * Go to your **Dashboard**, find the Escrow contract under "My Active Escrows", and click **Release Funds**.
   * Log back in as `freelancer@escrow.com` and notice their wallet balance has increased by the milestone amount!
