import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Declare variables at top level
let storage: ReturnType<typeof getStorage> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

// Skip initialization during Vercel build
if (process.env.VERCEL_BUILD) {
  console.log('🚫 Skipping Firebase client initialization during Vercel build');
  // Dummy services are already null
} else {
  // Firebase configuration
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId,
    // Bucket should be *.appspot.com, not *.firebasestorage.app
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };

  // Initialize Firebase only if config is available
  let app: ReturnType<typeof initializeApp> | null = null;

  // Check if we have the required environment variables
  if (process.env.FIREBASE_API_KEY && process.env.FIREBASE_PROJECT_ID) {
    try {
      app = initializeApp(firebaseConfig);
      storage = getStorage(app);
      db = getFirestore(app);
      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.warn('Firebase client initialization failed:', error);
    }
  } else {
    console.warn('⚠️ Firebase environment variables not found, skipping initialization');
  }
}

// Export services
export { storage, db };

// Note: Using production Firestore, not emulator

// Helper function to upload image to Firebase Storage
export async function uploadImageToFirebase(
  imageBuffer: Buffer,
  fileName: string,
  folder: string = 'products'
): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }

  try {
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, imageBuffer);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase:', error);
    throw error;
  }
}
