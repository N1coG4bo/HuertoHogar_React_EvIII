import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCGMS8r7LiPhLfskGih_6ignJq_52dbMfU',
  authDomain: 'huertomobil-17e85.firebaseapp.com',
  projectId: 'huertomobil-17e85',
  storageBucket: 'huertomobil-17e85.firebasestorage.app',
  messagingSenderId: '44710382716',
  appId: '1:44710382716:web:8cc57d4234733278264df9',
  measurementId: 'G-GJWS4326KP',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const analytics = isSupported().then((supported) => (supported ? getAnalytics(app) : null));

const collections = {
  users: collection(db, 'users'),
  friends: (email) => collection(db, 'users', email, 'friends'),
  messages: collection(db, 'messages'),
  chatsHistory: collection(db, 'chats_history'),
  pedidos: collection(db, 'pedidos'),
  products: collection(db, 'products'),
};

export { app, db, analytics, collections };
