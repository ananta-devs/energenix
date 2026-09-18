# EnergeniX

EnergeniX is a full-stack e-commerce platform for crystal bracelets and other spiritual wellness products. The repository contains the customer storefront, an administration dashboard, and separate Node.js API services for each application.

> **Live storefront:** [energenix.store](https://energenix.store)

## Highlights

- Customer storefront built with React and Vite
- Product browsing, collections, reviews, coupons, and hero-slider content
- Customer authentication with protected routes and JWTs
- Cart and checkout flows with Razorpay payment creation and signature verification
- Cash-on-delivery and prepaid order workflows
- Order history, cancellation, and shipment tracking
- Shipmozo integration for fulfillment and tracking
- Administrative product, collection, inventory, coupon, user, and order management
- Cloudinary image uploads for product media
- Transactional email notifications through Resend
- MongoDB persistence through Mongoose
- Security middleware on the customer API, including Helmet, rate limiting, request sanitization, HPP protection, and compression

## Repository structure

```text
.
├── admin/
│   ├── backend/       # Admin API and management services
│   └── frontend/      # Admin dashboard
├── client/
│   ├── backend/       # Customer API and commerce services
│   └── frontend/      # Public storefront
└── seed.js            # Creates an initial super-admin account
```

Each application is an independent npm project. There is no root-level workspace configuration, so install dependencies and run commands from the relevant application directory.

## Technology stack

### Storefront and admin dashboard

- React 19
- Vite
- React Router
- Zustand
- Tailwind CSS
- Framer Motion
- Axios
- Recharts and Lucide React

### APIs

- Node.js and Express 5
- MongoDB and Mongoose
- JSON Web Tokens and bcryptjs
- Razorpay
- Shipmozo
- Cloudinary
- Resend

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database
- Credentials for the services used by the environment you are running:
  - Cloudinary
  - Razorpay
  - Shipmozo
  - Resend and/or email delivery

## Getting started

Clone the repository and install dependencies for the applications you need:

```bash
git clone https://github.com/ananta-devs/energenix.git
cd energenix

# Customer API
cd client/backend
npm install

# In another terminal: customer storefront
cd ../../client/frontend
npm install

# In another terminal: admin API
cd ../../admin/backend
npm install

# In another terminal: admin dashboard
cd ../frontend
npm install
```

Run each service from its own directory:

```bash
# client/backend
npm start

# admin/backend
npm start

# client/frontend
npm run dev

# admin/frontend
npm run dev
```

The frontend development servers are provided by Vite. Their displayed local URLs may vary depending on which ports are already in use.

## Environment configuration

Create `.env` files in `client/backend` and `admin/backend`. Do not commit them or expose private credentials in frontend code.

The customer API reads configuration including:

```dotenv
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173

RAZORPAY_API_KEY=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

SHIPMOZO_PUBLIC_KEY=...
SHIPMOZO_PRIVATE_KEY=...
SHIPMOZO_BASE_URL=https://shipping-api.com/app/api/v1
WAREHOUSE_ID=...
WAREHOUSE_PINCODE=...

RESEND_API_KEY=...
SENDER_EMAIL=...
EMAIL_SECRET=...
```

The admin API additionally uses values such as:

```dotenv
PORT=5001
MONGO_URI=mongodb://...
JWT_SECRET=replace-with-a-long-random-secret

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

SHIPMOZO_PUBLIC_KEY=...
SHIPMOZO_PRIVATE_KEY=...
SHIPMOZO_USERNAME=...
SHIPMOZO_PASSWORD=...
SHIPMOZO_BASE_URL=https://shipping-api.com/app/api/v1
WAREHOUSE_ID=...
WAREHOUSE_PINCODE=...

RESEND_API_KEY=...
```

Use the exact variable names required by the deployment environment and the external service accounts. Frontend API URLs are configured in the frontend source and should point to the corresponding backend deployment when running outside local development.

## API overview

The customer API is mounted under `/api` and includes:

- `/api/auth` — customer registration and login
- `/api/products` — storefront product data
- `/api/reviews` — product reviews
- `/api/payment` — Razorpay order creation and payment verification
- `/api/orders` — staging, finalization, history, tracking, cancellation, and webhooks
- `/api/coupons` — coupon operations
- `/api/shipmozo` — shipping integration
- `/api/heroslider` — storefront hero-slider content

The admin API includes management routes for users, admins, products, collections, inventory, orders, coupons, uploads, analytics, Shipmozo, HSN/GST, contacts, and temporary orders. Both APIs expose a `/health`-style operational endpoint where configured; verify the deployed route before adding it to monitoring.

## Creating an initial admin

`seed.js` connects to MongoDB and creates a super-admin record for the admin application:

```bash
# Run from the repository root after configuring MONGO_URI
node seed.js
```

Review and change the seed values before using this script. The current script contains development credentials and should not be used unchanged in production. Never reuse its example password, and remove or rotate any account created with it.

## Available scripts

| Application | Command | Purpose |
|---|---|---|
| `client/frontend` | `npm run dev` | Start the storefront development server |
| `client/frontend` | `npm run build` | Build the storefront for production |
| `client/frontend` | `npm run preview` | Preview a production build |
| `client/frontend` | `npm run lint` | Run ESLint |
| `client/backend` | `npm start` | Start the customer API |
| `admin/frontend` | `npm run dev` | Start the admin dashboard development server |
| `admin/frontend` | `npm run build` | Build the admin dashboard for production |
| `admin/frontend` | `npm run preview` | Preview a production build |
| `admin/frontend` | `npm run lint` | Run ESLint |
| `admin/backend` | `npm start` | Start the admin API |

The backend packages currently provide placeholder `npm test` scripts rather than an automated test suite.

## Deployment notes

- Deploy the customer frontend, customer API, admin frontend, and admin API as separate services unless your hosting setup combines them.
- Set `FRONTEND_URL` to the allowed storefront origin for customer API CORS.
- Configure Razorpay webhook delivery to the customer order webhook endpoint.
- Keep MongoDB, Razorpay, Cloudinary, Shipmozo, Resend, and JWT secrets in the hosting provider's secret manager.
- Configure health checks against the API service endpoints used by your deployment.
- Verify payment signatures server-side and use HTTPS in production.

## Contributing

1. Create a feature branch.
2. Make changes in the relevant application directory.
3. Run the applicable frontend lint/build commands and manually verify affected API flows.
4. Keep secrets, generated files, and local `.env` files out of commits.
5. Open a pull request with a description of the affected storefront, admin, or API behavior.

## License

The repository does not currently declare a project-level open-source license. Contact the repository maintainers before redistributing or reusing the code.
