import { auth0 } from "@/lib/auth0";
import ClientHome from "./Home";

export default async function Home() {
  const authSession = await auth0.getSession(); 
  if (!authSession) {
    return <ClientHome session={null} />;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-sessions/${authSession.user.sub}`
  );
  const data = await res.json();

  const currentSessionId = data.sessions[0]?.id || null;

  const sessionWithId = {
    ...authSession,
    sessionId: currentSessionId,
  };

  return <ClientHome session={sessionWithId} />;
}