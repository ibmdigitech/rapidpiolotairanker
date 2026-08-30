import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-auth-domain.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-storage-bucket.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "mock-app-id"
};

// Initialize Firebase for SSR compatibility
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Force long-polling instead of the default WebSocket/WebChannel streaming.
// Many networks/proxies block the streaming transport, which makes the SDK
// report "client is offline" even though outbound HTTPS works. Long-polling
// routes through standard HTTPS and restores the Firestore connection.
let db: Firestore;
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db = initializeFirestore(app, { experimentalForceLongPolling: true } as any);
} catch {
  db = getFirestore(app);
}

export { app, auth, db };
