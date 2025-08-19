import { initializeApp, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_apiKey as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_authDomain as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_projectId as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_storageBucket as string,
  messagingSenderId: process.env
    .NEXT_PUBLIC_FIREBASE_messagingSenderId as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_appId as string,
};

export const initFirebase = (): FirebaseApp => initializeApp(firebaseConfig);
