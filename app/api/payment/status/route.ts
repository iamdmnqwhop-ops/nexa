import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { CONFIG } from "@/lib/config";

const REQUIRED_PLAN_ID = CONFIG.WHOP.PLAN_ID;

export async function GET() {
    try {
        // 1. Verify the user is authenticated with Whop
        const { userId } = await whopsdk.verifyUserToken(await headers());

        if (!userId) {
            return Response.json({ hasPaid: false, isChecking: false });
        }

        // 2. Check user's memberships to see if they have the required plan
        // Note: We are assuming whopsdk.users.listMemberships exists based on standard SDK patterns.
        // If this method is different, we will need to adjust.
        // We filter for valid memberships (active, not canceled/expired)

        // Since we don't have the exact type definition handy, we'll use 'any' for now and log the output to debug if needed
        const memberships = await whopsdk.memberships.list({ user_ids: [userId] });

        const validMembership = memberships.data.find((membership: any) => {
            return (
                membership.plan_id === REQUIRED_PLAN_ID &&
                (membership.status === 'active' || membership.status === 'trialing' || membership.status === 'past_due')
            );
        });

        if (validMembership) {
            return Response.json({
                hasPaid: true,
                paymentDate: (validMembership as any).created_at,
                planId: (validMembership as any).plan_id
            });
        }

        // If no specific plan match, check if they have access to the company (fallback)
        // This is useful if you want to grant access to anyone who owns *any* product in your Whop
        // const access = await whopsdk.users.checkAccess(process.env.NEXT_PUBLIC_WHOP_APP_ID!, { id: userId });
        // if (access.allowed) { ... }

        return Response.json({ hasPaid: false, isChecking: false });

    } catch (error) {
        console.error('Payment status check error:', error);

        // If verifyUserToken fails, it throws. We catch it here.
        return Response.json({ hasPaid: false, isChecking: false });
    }
}
