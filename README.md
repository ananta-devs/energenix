# Gemstone

This repository contains the Gemstone project, a monorepo with separate applications for the admin panel and the client-facing interface.

## Project Structure

The project is organized into the following main directories:

-   `admin/`: Contains the admin panel application.
    -   `admin/backend/`: The backend service for the admin panel.
    -   `admin/frontend/`: The frontend interface for the admin panel.
-   `client/`: Contains the client-facing application.
    -   `client/backend/`: The backend service for the client application.
    -   `client/frontend/`: The frontend interface for the client application.

## Technology Stack

Each application (admin/client, frontend/backend) is a self-contained project built with [React](https://react.dev/) and [Vite](https://vitejs.dev/).

## Getting Started

To run any of the applications, navigate to its specific directory and follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

For example, to run the client frontend:

```bash
cd client/frontend
npm install
npm run dev
```
