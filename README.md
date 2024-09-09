# Hapi.js & React.js Application

This is a full-stack web application For Jubelio technical test built with **Hapi.js** on the backend and **React.js** on the frontend. 
The application manages products and provides a simple REST API for product-related operations.

## Features

### Backend (Hapi.js)
- **CRUD Operations** for managing products.
- **RESTful API** with the following endpoints:
  - `GET /api/v1/products`: Get all products.
  - `GET /api/v1/products/{id}`: Get details of a single product by ID.
  - `POST /api/v1/products`: Insert a new product.
  - `PUT /api/v1/products/{id}`: Update an existing product by ID.
  - `DELETE /api/v1/products/{id}`: Delete a product by ID.
  - `GET /api/v1/import-product`: Import products from an external API.
- **Database Integration** with a product table (assumed to be PostgreSQL).

### Frontend (React.js)
- **Product Listing**: Displays all products fetched from the backend API.
- **Product Details**: View detailed information about a single product.
- **Product Management**: Add, edit, and delete products.

## Prerequisites

To run this project, you will need:

- **Node.js** and **npm** (or **yarn**)
- **PostgreSQL** for the backend database
- **React.js** for the frontend
- **Axios** for making HTTP requests (in React)

## Getting Started

### Backend (Hapi.js)

1. **Install Dependencies**:

   Navigate to the backend directory and run:

   ```bash
   cd server
   ```
    ```bash
   npm install
   ```
2, Set up Environment Variables:

Create a .env file in the root of the server directory with the following content:
env
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
PORT=3000
CRYPTO_SECRET=0e6d6ef5732acbb254a7126914edd05e0238f3e1d4450f70361be41
   ```
3. Run the Migration:

Navigate to the server/migrations directory and run the following SQL script to create the products table in your database:
```bash
psql -U your_database_user -d your_database_name -f server/migrations/create_products_table.sql
  ```
3. Run the Server
Start the Hapi.js server by running:
npm start

4. Running Tests
npm test 


### Frontend (React.js)
Install Dependencies:

Navigate to the frontend directory and run:

```bash
cd client
npm install
```

Run the React App:
Start the React development server by running:
```bash
npm start
```
The frontend will be running at http://localhost:3001 (if not, you can check the console output for the actual port).
