This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Running with Docker

You can run this project in a containerized environment using Docker and Docker Compose. This setup uses Node.js version `22.13.1-slim` and builds the Next.js application for production.

### Build and Run

To build and start the application using Docker Compose:

```bash
docker compose up --build
```

This will build the Docker image and start the app in a container named `typescript-app`.

### Ports

- The application will be available at [http://localhost:3000](http://localhost:3000) (port 3000 is exposed by default).

### Environment Variables

- If you have a `.env` file with environment variables, you can enable it by uncommenting the `env_file: ./.env` line in the `docker-compose.yml` file.
- Make sure to provide any required environment variables in your `.env` file as needed by your application.

### Special Configuration

- The Dockerfile is multi-stage and removes development dependencies for a smaller production image.
- The app runs as a non-root user for improved security.
- No external services (such as databases) are configured by default. If you add a database, update the `docker-compose.yml` accordingly.

---
