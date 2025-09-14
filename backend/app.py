import os, json
import firebase_admin
from firebase_admin import firestore, credentials
from firebase_admin.exceptions import FirebaseError
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from auth_router import router

load_dotenv()
FIREBASE_ADMIN_CREDENTIALS = os.getenv("FIREBASE_ADMIN_CREDENTIALS")

try:
    if FIREBASE_ADMIN_CREDENTIALS and os.path.exists(FIREBASE_ADMIN_CREDENTIALS):
        cred = credentials.Certificate(FIREBASE_ADMIN_CREDENTIALS)
        firebase_admin.initialize_app(cred)
        print("Firebase credentials set.")
    else:
        print("Firebase credentials not found. Firebase functionality will not work.")
except FirebaseError as e:
    print(f"Failed to initialize Firebase: {e}")



app = FastAPI()

# CORS Middleware
origins = [
    "http://localhost:3000",
    "http://192.168.1.9:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)
