"use client";
import { useEffect, useState } from "react";

interface Session {
  user: {
    sub: string;
    email?: string;
  };
  sessionId?: string;
}

interface ClientHomeProps {
  session: Session | null;
}

interface UserSession {
  id: string;
  user_id: string;
  device: {
    initial_ip: string;
  };
  last_interacted_at: string;
}

export default function ClientHome({ session }: ClientHomeProps) {
    const [userSessions, setUserSessions] = useState<UserSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const MAX_DEVICES = 2;

    useEffect(() => {
        async function fetchUserSessions() {
            if (!session) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-sessions/${session.user.sub}`);
                if (res.ok) {
                    const data = await res.json();
                    setUserSessions(data.sessions);

                    if(data.sessions.length >= MAX_DEVICES){
                        setShowPopup(true);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchUserSessions();
    }, [session]);
        
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

    if(showPopup){
        return (
            <div className="font-mono text-black flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gray-50">
            <h1 className="text-2xl mb-8 text-black">Too many devices logged in</h1>
            <ul>
                {userSessions.map((s) => (
                <li key={s.id} className="mb-2 flex items-center justify-between w-full">
                    <div>
                        <strong>User ID:</strong> {s.user_id} <br />
                        <strong>Device IP:</strong> {s.device.initial_ip} <br />
                        <strong>Last Interaction:</strong>{" "}
                        {new Date(s.last_interacted_at).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            hour12: true,
                        })}
                    </div>
                    <div>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Logout
                        </button>
                    </div>
                </li>
                ))}
            </ul>
            </div>
        )

    }





    return (
        <div className="font-mono text-black flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gray-50">
        <h1 className="text-2xl mb-8 text-black">You are Logged in!</h1>
        <h2 className="text-2xl mb-8 text-black">Hii {session?.user.email || "User"}</h2>
        <ul>
            {userSessions.map((s) => (
            <li key={s.id} className="mb-2">
                <strong>User ID:</strong> {s.user_id} <br />
                <strong>Device IP:</strong> {s.device.initial_ip} <br />
                <strong>Last Interaction:</strong>{" "}
                {new Date(s.last_interacted_at).toLocaleString()}
            </li>
            ))}
        </ul>
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <a href="/auth/logout" className="bg-blue-500 text-white px-4 py-2 text-center rounded-lg hover:bg-blue-600 transition">Log Out</a>
        </div>
        </div>
    )
}

