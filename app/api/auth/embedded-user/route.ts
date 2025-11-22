import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";

export async function GET() {
  try {
    // Get the user token from the headers (automatically provided by Whop)
    const { userId } = await whopsdk.verifyUserToken(await headers());

    // Fetch user information
    const user = await whopsdk.users.retrieve(userId);

    return Response.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar_url,
    });

  } catch (error) {
    console.error('Embedded user auth error:', error);

    // Return 401 if not in Whop embedded experience
    return Response.json(
      { error: 'Not authenticated in Whop embedded experience' },
      { status: 401 }
    );
  }
}