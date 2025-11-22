import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { FlowManager } from "@/components/nexa/FlowManager";
import { WhopEmbeddedAuthProvider } from "@/components/whop/useWhopEmbeddedAuth";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  let displayName = 'Developer';

  if (!isDevelopment) {
    try {
      // Production: Use actual Whop authentication
      const { userId } = await whopsdk.verifyUserToken(await headers());

      // Fetch the necessary data we want from whop.
      const [experience, user] = await Promise.all([
        whopsdk.experiences.retrieve(experienceId),
        whopsdk.users.retrieve(userId),
      ]);

      displayName = user.name || `@${user.username}`;
    } catch (error) {
      console.error('Whop connection error:', error);
      // Fallback for production if Whop fails
      displayName = 'User';
    }
  } else {
    console.log('🔧 Development mode: Skipping Whop authentication');
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <WhopEmbeddedAuthProvider>
        <FlowManager />
      </WhopEmbeddedAuthProvider>
    </main>
  );
}