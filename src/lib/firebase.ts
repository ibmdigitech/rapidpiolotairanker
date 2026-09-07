import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
};

const missingFirebaseConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseConfig.length > 0) {
  throw new Error(
    `Missing Firebase configuration: ${missingFirebaseConfig.join(", ")}. Add the NEXT_PUBLIC_FIREBASE_* variables and restart the dev server.`,
  );
}

if (!firebaseConfig.apiKey.startsWith("AIza")) {
  throw new Error(
    "Invalid Firebase API key format. NEXT_PUBLIC_FIREBASE_API_KEY must be the Web API key from Firebase Project settings, starting with AIza.",
  );
}

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
