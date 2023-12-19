import * as admin from 'firebase-admin';
import multer from 'multer';
import * as Storage from '@google-cloud/storage'
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyB698mC0pCbYmAI0ebPv-X_BDV_5Kjs6rI",
  authDomain: "zomato-clone-406917.firebaseapp.com",
  projectId: "zomato-clone-406917",
  storageBucket: "zomato-clone-406917.appspot.com",
  messagingSenderId: "602927526483",
  appId: "1:602927526483:web:111155fe901cf8c7220ca6",
  measurementId: "G-93XG5PS7QK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

admin.initializeApp({
    credential: admin.credential.cert(require("../config/credentials.json")),   
    storageBucket: 'gs://zomato-clone-406917.appspot.com',
  });
const storage = new Storage.Storage();
const bucket = storage.bucket(admin.storage().bucket().name);

const upload  = multer({
    storage:multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
      },});
export{admin,storage,bucket,upload,app};

