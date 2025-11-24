export const CONFIG = {
    // Whop Configuration
    WHOP: {
        // Replace this with your actual Plan ID from the Whop Dashboard
        // This is the plan that users need to purchase to access the premium features ($14)
        PLAN_ID: process.env.NEXT_PUBLIC_WHOP_PLAN_ID || "plan_OBcNMmJ7bljvT",

        // Optional: Add other Whop-related config here
    },

    // App Configuration
    APP: {
        NAME: "NEXA",
        VERSION: "0.1.0",
    }
};
