import { initializeApp } from 'firebase/app'

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)

const app = initializeApp(firebaseConfig)

export default app
