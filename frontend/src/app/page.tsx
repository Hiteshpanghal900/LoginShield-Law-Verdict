import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div className="font-mono flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gray-50">
        <h1 className="text-2xl mb-8 text-black">Welcome to Login Shield</h1>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <a href="/auth/login" className="bg-blue-500 text-white px-4 py-2 text-center rounded-lg hover:bg-blue-600 transition">Login</a>
        </div>
      </div>
    );
  }


  return (
    <div className="font-mono flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gray-50">
      <h1 className="text-2xl mb-8 text-black">You are Logged in!</h1>
      <h2 className="text-2xl mb-8 text-black">Hii {session.user.email}</h2>

      <div className="flex flex-col gap-4 w-full max-w-sm">
          <a href="/auth/logout" className="bg-blue-500 text-white px-4 py-2 text-center rounded-lg hover:bg-blue-600 transition">Log Out</a>
      </div>
    </div>
  )
}