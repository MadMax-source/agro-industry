# Backend setup

The backend runs in the Next.js app and uses MongoDB/Mongoose for persistence, Cloudinary for product/category media uploads, and Nodemailer for contact messages.

## Configure environment

Copy `.env.example` to `.env.local` and set:

- `MONGODB_URI`: MongoDB connection string.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary API credentials.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`: SMTP server settings. Use `SMTP_SECURE=true` with implicit TLS (usually port 465); use `false` with STARTTLS (usually port 587).
- `MAIL_FROM`, `MAIL_TO`: sender and recipient addresses for incoming contact messages.

Restart the development server after editing `.env.local`. Never commit the populated environment file.

## Run

```sh
pnpm install
pnpm dev
```

The first admin catalog load initializes the database with the existing demo categories, products, and business settings only when the corresponding collections are empty. Subsequent loads use the stored records.

## API routes

- `GET /api/admin/bootstrap`: initializes demo data if needed and returns admin products, categories, and settings.
- `GET /api/catalog`: returns published products, active categories, and business settings to the storefront.
- `/api/admin/products`: list and create products; `/api/admin/products/[id]`: read, update, and delete.
- `/api/admin/categories`: list and create categories; `/api/admin/categories/[id]`: read, update, and delete (including product reassign/draft behavior).
- `PATCH /api/settings`: update business contact, footer, and WhatsApp settings; `GET /api/settings` reads them.
- `POST /api/upload`: upload an image or product video to Cloudinary. Accepts JPEG, PNG, WebP, or AVIF images up to 4 MB, and MP4, WebM, or MOV videos up to 50 MB. Products require at least one image and can have up to 12.
- `GET /api/products` and `GET /api/categories`: public catalog endpoints return published products and active categories.
- `POST /api/contact`: sends a validated contact message through the configured SMTP server.

The storefront reads live public catalog and business settings from the backend, and uses the existing demo catalog if the API is unavailable. Admin changes are stored in MongoDB.

## Prototype access warning

Admin sign-in remains the existing browser-only demo login as requested. The catalog/settings APIs and media-upload route do not have server-side authentication or authorization, so anyone who can reach the deployment can call them directly. Do not expose these endpoints publicly or use them for production data until server-verified admin authentication and authorization have been added.
