import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { FlowManager } from "@/components/nexa/FlowManager";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  // Ensure the user is logged in on whop.
  const { userId } = await whopsdk.verifyUserToken(await headers());

  // Fetch the necessary data we want from whop.
  const [experience, user] = await Promise.all([
    whopsdk.experiences.retrieve(experienceId),
    whopsdk.users.retrieve(userId),
  ]);

  const displayName = user.name || `@${user.username}`;

  return (
    <main className="min-h-screen bg-black text-white">
      <FlowManager />
    </main>
  );
}