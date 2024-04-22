import { getMessaging } from 'firebase-admin/messaging';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
// Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBLcZ_QKCpYSHSr8o4DYFoG2xrInQ8y4zE',
  authDomain: 'sharing-coffee.firebaseapp.com',
  projectId: 'sharing-coffee',
  storageBucket: 'sharing-coffee.appspot.com',
  messagingSenderId: '11188755522',
  appId: '1:11188755522:web:b54b787b94338a0ee3a1db',
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to send a notification
export async function sendNotification(token, title, body) {
  try {
    if (!token) return;
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    // Send a message to the device corresponding to the provided registration token.
    const response = await getMessaging().send(message);

    // Response is a message ID string.
    console.log('Successfully sent message:', response);

    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    // throw error;
  }
}
export async function sendNotificationToMultipleDevices(tokens, title, body) {
  try {
    const messages = tokens.map((token) => ({
      notification: {
        title: title,
        body: body,
      },
      token: token,
    }));

    const responses = await getMessaging().sendAll(messages);

    responses.forEach((response, idx) => {
      if (response.success) {
        console.log(`Message ${idx + 1} sent successfully.`);
      } else {
        console.error(`Error sending message ${idx + 1}:`, response.error);
      }
    });

    return responses;
  } catch (error) {
    console.error('Error sending multicast message:', error);
    // throw error;
  }
}

// Function to register user and send verification email
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    await sendEmailVerification(user);
    console.log('Verification email sent.');
  } catch (error) {
    console.error('Error registering user:', error.message);
  }
};

// check an email has verificated
export const checkEmailVerified = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log(userCredential.user);
    if (userCredential.user.emailVerified) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking email verification:', error.message);
    throw error;
  }
};
