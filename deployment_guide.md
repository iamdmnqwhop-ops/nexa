# Deployment Guide

This guide covers the steps to deploy your Whop Next.js application to Vercel and configure the Whop Dashboard for production.

## 1. Environment Variables

When deploying to Vercel, you must add the following **Environment Variables** in your project settings:

| Variable | Description | Value (Example) |
| :--- | :--- | :--- |
| `WHOP_API_KEY` | Your Whop App API Key (keep secret!) | `app_...` |
| `NEXT_PUBLIC_WHOP_APP_ID` | Your Whop App ID | `app_...` |
| `NEXT_PUBLIC_WHOP_PLAN_ID` | The Plan ID for the $14 premium plan | `prod_...` |
| `GEMINI_API_KEY` | API Key for Google Gemini AI | `AIza...` |
| `WHOP_WEBHOOK_SECRET` | Secret for verifying webhooks (if used) | `...` |

> [!IMPORTANT]
> Do NOT commit your `.env` files to GitHub. Always use the Vercel dashboard to set these secrets.

## 2. Whop Dashboard Configuration

After you deploy, you will get a production URL (e.g., `https://your-app.vercel.app`). You need to update your Whop App settings:

### Base URL
*   Go to **App Settings**.
*   Update **Base URL** to your production URL: `https://your-app.vercel.app`

### Redirect URIs
*   Go to **Authentication** (or OAuth settings).
*   Add your production redirect URI. It typically looks like:
    *   `https://your-app.vercel.app/api/auth/callback` (if using NextAuth)
    *   `https://your-app.vercel.app` (if handling auth on the main page)
*   **Note:** Keep your `http://localhost:3000` URI for local development.

## 3. Deployment Steps (Vercel)

1.  Push your code to **GitHub**.
2.  Log in to **Vercel** and click **"Add New..."** > **"Project"**.
3.  Import your GitHub repository.
4.  In the **"Configure Project"** screen:
    *   Expand **"Environment Variables"**.
    *   Add all the variables listed in Step 1.
5.  Click **"Deploy"**.

## 4. Final Verification

Once deployed:
1.  Open your app in a browser using the Vercel URL.
2.  Ensure the "Unlock full access for $14" message appears (if you haven't paid).
3.  Test the payment flow (you can use a test card if Whop supports it, or create a 100% off coupon for yourself).
