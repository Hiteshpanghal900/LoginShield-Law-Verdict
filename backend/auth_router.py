import requests
import os
from operator import itemgetter
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

router = APIRouter(prefix="/api")
load_dotenv()
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
ACCESS_TOKEN = os.getenv("MGMT_ACCESS_TOKEN")

@router.get("/user-sessions/{user_id}")
def active_sessions(user_id: str):
    try:
        url = f"https://{AUTH0_DOMAIN}/api/v2/users/{user_id}/sessions"
        headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            sessions = response.json().get("sessions", [])

            if not sessions:
                return {"sessions": [], "total_devices": 0}

            # Sort by last_interacted_at (latest first)
            sorted_sessions = sorted(
                sessions,
                key=itemgetter("last_interacted_at"),
                reverse=True,
            )

            filtered = sorted_sessions[1:] if len(sorted_sessions) > 1 else []

            return {
                "sessions": filtered,
                "total_devices": len(filtered),
            }

        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Failed to fetch sessions: {response.text}",
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
