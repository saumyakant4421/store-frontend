# Store Rating App Frontend

This is the frontend for the **Store Rating App**, a simple web application for discovering, rating, and managing stores. Users can sign up, log in, browse stores, leave ratings, and (if authorized) manage stores and users.

## Live Demo

**Current running URL:**  
https://store-frontend-gamma-five.vercel.app/

> **Note:** The website may react with a short delay (a few seconds) on API calls due to backend cold starts or free hosting limitations. Please be patient when submitting forms or loading data.

## Tech Stack

- **React** (with hooks)
- **Axios** (for API requests)
- **Radix UI** (for accessible UI components)
- **Vercel** (for deployment)
- **Custom CSS** (modular, in `/src/styles`)

## Features
- User authentication (signup, login, JWT)
- Store listing, search, and sorting
- Star rating system
- Admin dashboard for user/store management
- Store owner dashboard

## Super Admin Details

A System Administrator account is seeded for initial access:
- **Email:** superadmin@example.com
- **Password:** SuperAdmin!2025
- **Role:** System Administrator

Use these credentials to log in as a super admin and manage users, stores, and ratings.

## Development

1. Clone the repo
2. Run `npm install`
3. Run `npm start` (dev server at http://localhost:3000)

## Production Build

- Run `npm run build` to create a production build.
- Deploy to Vercel or any static hosting provider.

---

**Backend:** [See backend repo for API and deployment details.]
