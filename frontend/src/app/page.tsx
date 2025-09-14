import { auth0 } from "@/lib/auth0";
import ClientHome from "./Home";

export default async function Home() {
  const session = await auth0.getSession(); 
  return <ClientHome session={session} />;
}