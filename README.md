# Chapa Fullstack Interview Assignment

A single-page web application for a fictional Payment Service Provider company, built with **Laravel** (backend) and **React** (frontend).

## Features & User Roles

### User
- View wallet balance
- See transaction history
- Initiate a payment (mocked, no real payment integration)

### Admin
- View list of users
- Activate/deactivate users
- View a summary of payments made by users

### Super Admin
- All Admin features, plus:
- Create or remove Admins
- View system-wide statistics (total payments, number of active users, etc.)

## Authentication
- Uses **Laravel Sanctum** for authentication
- No token-based API auth required
- Only the **super_admin** is seeded by default (see below for credentials)

## Technical Stack
- **Backend:** Laravel
- **Frontend:** React (with Vite, TypeScript, TailwindCSS, shadcn/ui)
- **Database:** SQLite (default, can be changed)
- **Package manager:** pnpm (recommended)

## Project Structure & Approach
- Clean, organized folder structure for both backend and frontend
- Role-based routing and UI on the frontend
- Basic, modern styling and user-friendly UI

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/yishak-cs/chapa-fullstack-interview-assignment.git
cd chapa-fullstack-interview-assignment
```

### 2. Install dependencies
#### Backend (Laravel)
```sh
composer install
```
#### Frontend (React)
```sh
pnpm install
```

### 3. Set up environment
- Copy `.env.example` to `.env` and configure as needed (default uses SQLite)
- Generate Laravel app key:
```sh
php artisan key:generate
```

### 4. Run migrations and seeders
```sh
php artisan migrate --seed
```
- This will seed the database with a **super_admin** account:
  - **Email:** test@example.com
  - **Password:** password
- **No other users, admins, transactions, or wallets are seeded by default.**

### 5. Create Admins and Users
- Log in as the super_admin (see credentials above).
- Go to the Users page and create one or more Admin accounts.
- Log out, then log in as an Admin you created.
- As an Admin, go to the Users page and create User accounts. **Each user account will automatically have a wallet with a starting balance of 1000.**
- Once multiple users exist, you can log in as a user and make transactions to other users.

### 6. Start the development servers
#### Backend (Laravel API)
```sh
php artisan serve
```
#### Frontend (Vite React)
```sh
pnpm run dev
```

### 7. Access the app
- Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)
- Log in with the seeded super_admin, or with any admin/user you create

## Notes
- **Role-based UI:** The dashboard and navigation change based on the logged-in user's role (User, Admin, Super Admin).
- **Wallets:** **Only user-role accounts have wallets.** Admin and super_admin accounts do not have wallets. When a user is activated/deactivated, their wallet is also updated. When an admin is activated/deactivated, all users they manage and their wallets are updated accordingly.
- **Transactions:** Users can make payments to other users. Admins and super admins can view summaries and statistics.
- **Styling:** Uses TailwindCSS and shadcn/ui for a modern, responsive UI.
- **Package manager:** pnpm is recommended for faster and more efficient installs.

## Author
**Yishak Abraham Bantirgu**  
Email: yishakab@24gmail.com  
Phone: 0907968056  
GitHub: [github.com/yishak-cs](https://github.com/yishak-cs)

---

**Repository:** [chapa-fullstack-interview-assignment](https://github.com/yishak-cs/chapa-fullstack-interview-assignment)
