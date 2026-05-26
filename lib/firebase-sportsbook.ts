import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyAg_gaAZPyA3lYLSyy6rZdgQ230TA0TvP0",
  authDomain: "hvff-sportsbook.firebaseapp.com",
  projectId: "hvff-sportsbook",
  storageBucket: "hvff-sportsbook.firebasestorage.app",
  messagingSenderId: "1066899155373",
  appId: "1:1066899155373:web:6c11b252eee740aeea9924",
};

const app =
  getApps().find((a) => a.name === "sportsbook") ??
  initializeApp(config, "sportsbook");

export const sbDb = getFirestore(app);
