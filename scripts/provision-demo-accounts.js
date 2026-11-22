import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYuMlp4ftdi3ynx5R3SnHUYC7jb4692j4",
  authDomain: "evex-1c901.firebaseapp.com",
  projectId: "evex-1c901",
  storageBucket: "evex-1c901.firebasestorage.app",
  messagingSenderId: "721394236496",
  appId: "1:721394236496:web:0db930d02623f41c8ea555"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const DEMO_PASSWORD = "EvexDemo@2026!";

const DEMO_ACCOUNTS = [
  {
    role: 'customer',
    email: 'customer.demo@evex.app',
    name: 'Keerthana (Demo Customer)',
    phone: '+91 98765 43210',
    city: 'Bengaluru',
    profileBio: 'Planning premium wedding & family celebrations.'
  },
  {
    role: 'manager',
    email: 'manager.demo@evex.app',
    name: 'EVEX Events Co. (Demo Manager)',
    phone: '+91 99887 76655',
    agency: 'EVEX Events Co.',
    city: 'Bengaluru',
    profileBio: 'Full-service luxury wedding & corporate event planners with 12+ years experience.'
  },
  {
    role: 'seeker',
    email: 'seeker.demo@evex.app',
    name: 'Ananya (Demo Job Seeker)',
    phone: '+91 91234 56789',
    city: 'Bengaluru',
    skills: ['Event Host', 'Coordinator', 'Stage Management', 'Guest Relations'],
    profileBio: 'Experienced event host, emcee and hospitality coordinator for weddings and corporate galas.'
  }
];

async function provisionAccount(account) {
  console.log(`\n--- Provisioning ${account.role.toUpperCase()} Account: ${account.email} ---`);
  let user = null;

  try {
    const cred = await signInWithEmailAndPassword(auth, account.email, DEMO_PASSWORD);
    user = cred.user;
    console.log(`✓ Signed in to existing Firebase Auth user: ${user.uid}`);
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
      try {
        console.log(`Creating new Firebase Auth account for ${account.email}...`);
        const newCred = await createUserWithEmailAndPassword(auth, account.email, DEMO_PASSWORD);
        user = newCred.user;
        console.log(`✓ Created new Firebase Auth user: ${user.uid}`);
      } catch (createErr) {
        console.error(`✗ Error creating user ${account.email}:`, createErr.message);
        return null;
      }
    } else {
      console.error(`✗ Auth error for ${account.email}:`, err.message);
      return null;
    }
  }

  if (!user) return null;

  try {
    await updateProfile(user, { displayName: account.name });
  } catch (e) {
    // ignore
  }

  // Write private user document /users/{uid}
  const userDocRef = doc(db, 'users', user.uid);
  const userDocData = {
    id: user.uid,
    uid: user.uid,
    email: account.email,
    name: account.name,
    phone: account.phone,
    role: account.role,
    city: account.city,
    agency: account.agency || '',
    bio: account.profileBio || '',
    skills: account.skills || [],
    verified: true,
    isDemoAccount: true,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(userDocRef, userDocData, { merge: true });
    console.log(`✓ Wrote Firestore /users/${user.uid} with role: ${account.role}`);
  } catch (err) {
    console.warn(`Firestore write notice (/users/${user.uid}):`, err.message);
  }

  // Write public profile if manager or seeker (omitting email and phone for security)
  if (account.role === 'manager' || account.role === 'seeker') {
    const pubDocRef = doc(db, 'publicProfiles', user.uid);
    const pubData = {
      id: user.uid,
      name: account.name,
      role: account.role,
      city: account.city,
      rating: 4.9,
      reviewsCount: 108,
      verified: true,
      agency: account.agency || '',
      bio: account.profileBio || '',
      isDemoAccount: true
    };
    try {
      await setDoc(pubDocRef, pubData, { merge: true });
      console.log(`✓ Wrote Firestore /publicProfiles/${user.uid}`);
    } catch (err) {
      console.warn(`Firestore publicProfiles notice:`, err.message);
    }
  }

  return { uid: user.uid, ...account };
}

async function main() {
  console.log("=== EVEX DEMO ACCOUNTS PROVISIONING START ===");
  const results = [];
  for (const acc of DEMO_ACCOUNTS) {
    const res = await provisionAccount(acc);
    if (res) results.push(res);
  }

  console.log("\n=== PROVISIONING SUMMARY ===");
  console.log(`Total accounts processed: ${results.length} / ${DEMO_ACCOUNTS.length}`);
  results.forEach(r => {
    console.log(`- [${r.role.toUpperCase()}] ${r.email} (UID: ${r.uid})`);
  });
  console.log("=== DONE ===");
  process.exit(0);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
