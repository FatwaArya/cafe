# Wikusama Cafe Cashier System

This is a school project for building a cashier system for Wikusama Cafe using Next.js, trpc, TypeScript, Tailwind, Prisma, and PlanetScaleDB. The system will have three types of users: cashiers, managers, and admins. 

## Functionality

### Cashier

- Login to the application
- Take orders for food and beverages
- Determine an available table number (tables that are not in use)
- View all transactions handled by the cashier
- Change the payment status of an order
- Print transaction receipts (using a roll paper that fits the cashier's printer)

### Manager

- Login to the application
- View all transaction data for all employees, both daily and monthly
- Filter transaction data based on employee names
- Filter transaction data based on specific dates
- View transaction revenue reports based on daily and monthly filters
- View dashboard statistics of the most popular and least ordered food and beverage items (using pie charts and bar charts)

### Admin

- Login to the application
- Manage user data and set user roles
- Manage food and beverage data
- Manage table data

## Technologies Used

- Next.js
- tRPC
- TypeScript
- Tailwind
- Prisma
- PlanetScaleDB

## Installation and Usage

1. Clone this repository
2. Install dependencies using `npm install`
3. Create a PlanetScaleDB database and add your database credentials to a `.env` file
4. Run database migrations using `npx prisma migrate dev`
5. Start the server using `npm run dev`
6. Access the application on `http://localhost:3000` in your web browser
