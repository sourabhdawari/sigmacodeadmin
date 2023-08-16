import { initializeApp } from "firebase/app";
import {  getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
 apiKey: "AIzaSyCa_YpNe9tPe0-ViKE0XmaiwLhzrrNGewU",
    authDomain: "portfolio-sigmacode.firebaseapp.com",
    databaseURL: "https://portfolio-sigmacode-default-rtdb.firebaseio.com",
    projectId: "portfolio-sigmacode",
    storageBucket: "portfolio-sigmacode.appspot.com",
    messagingSenderId: "765165030588",
    appId: "1:765165030588:web:1670cd2de2d11f5f4894b9",
    measurementId: "G-Z5HTDXQZ1W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

