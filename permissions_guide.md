# Whop App Permissions Guide

To "launch" your app and ensure it works correctly for users, you need to configure the correct **Permissions (Scopes)** in the Whop Developer Dashboard.

## Required Permissions

Based on the features we have implemented (Payment Verification, User Identification), you must enable the following permissions:

### 1. Memberships
*   **`member:basic:read`**: Required to check if a user has purchased your plan (`whopsdk.memberships.list`).

### 2. Users
*   **`user:read`** (or `user:basic:read`): Required to get the user's profile information (`whopsdk.users.retrieve`).

### 3. Experiences (If applicable)
*   **`experience:read`**: Required if you are fetching experience details (`whopsdk.experiences.retrieve`).

## How to Configure

1.  Go to the [Whop Developer Dashboard](https://whop.com/dev/).
2.  Select your App.
3.  Navigate to **Permissions** (or **Scopes**).
4.  Check the boxes for the permissions listed above.
5.  **Save** your changes.

> [!IMPORTANT]
> If you add new permissions *after* a user has installed your app, they may need to re-authorize it. For a new launch, this is not an issue.

## "Launching" Your App

"Launching" typically means making your app available for others to install.
1.  Ensure your **App Configuration** (Redirect URLs, etc.) is correct.
2.  In the Dashboard, look for a **"Publish"** or **"Submit for Review"** button if you intend to list it in the Whop App Store.
3.  If it's a private app for your own company, you just need to install it on your company page.
