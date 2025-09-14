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

            return {
                "sessions": sessions,
                "total_devices": len(sessions),
            }

        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Failed to fetch sessions: {response.text}",
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@router.delete("/user-sessions/{session_id}")
def logout_session(session_id: str):
    url = f"https://{AUTH0_DOMAIN}/api/v2/sessions/{session_id}"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    try:
        response = requests.delete(url, headers=headers)

        if response.status_code in [200, 204]:
            return {"message": f"Session {session_id} logged out successfully"}
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Failed to logout session: {response.text}"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
