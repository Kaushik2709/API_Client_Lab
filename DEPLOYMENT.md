# Deploying to Render

This project is configured for easy deployment to **Render** using a Blueprint (`render.yaml`).

## Prerequisites

- A [Render](https://render.com) account.
- A [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) connection string.

## Deployment Steps

1. **Push to GitHub/GitLab**: Push your code to a repository. Make sure both `api-lab-main` and `quickapi-backend` are in the root as configured in `render.yaml`.
2. **Connect Blueprint**:
   - In the Render Dashboard, click **New +** > **Blueprint**.
   - Connect your repository.
3. **Configure Environment Variables**:
   Under the **Blueprint Config**, you will be prompted for:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for signing tokens.

## Manual Configuration (If not using Blueprints)

### Backend (Web Service)

- **Environment**: Node
- **Root Directory**: `quickapi-backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Env Vars**:
  - `PORT`: (Set by Render)
  - `MONGODB_URI`: (Your DB URL)
  - `JWT_SECRET`: (Your Secret)
  - `FRONTEND_URL`: The URL of your deployed frontend.

### Frontend (Static Site)

- **Root Directory**: `api-lab-main`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Env Vars**:
  - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://quickapi-backend.onrender.com`).
- **Redirects/Rewrites**:
  - Action: `Rewrite`
  - Source: `/*`
  - Destination: `/index.html`
