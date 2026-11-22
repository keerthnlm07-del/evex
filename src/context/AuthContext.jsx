import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [selectedRole, setSelectedRole] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_selected_role');
      return saved || null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);
  const [firebaseStatus, setFirebaseStatus] = useState('connecting'); // 'connected' | 'auth-needs-setup' | 'offline'
  const [users, setUsers] = useState([]);

  // Sync public directory from Firestore (sanitized profiles without email/phone)
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, 'publicProfiles'),
        (snapshot) => {
          if (!snapshot.empty) {
            setUsers(snapshot.docs.map((d) => d.data()));
          }
        },
        (err) => {
          console.warn('Firestore publicProfiles sync notice:', err.message);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('publicProfiles listener setup error:', e.message);
    }
  }, []);

  // Persist session cache for smooth offline/Capacitor experience
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('evex_real_current_user', JSON.stringify(currentUser));
      if (currentUser.role) {
        localStorage.setItem('evex_real_selected_role', currentUser.role);
      }
    } else {
      localStorage.removeItem('evex_real_current_user');
      localStorage.removeItem('evex_real_selected_role');
    }
  }, [currentUser]);

  // Robust onAuthStateChanged listener restoring session on app startup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setCurrentUser(data);
            setSelectedRole(data.role);
            setFirebaseStatus('connected');
          } else {
            // Document fallback from cached session or Firebase Auth object
            const cached = localStorage.getItem('evex_real_current_user');
            if (cached) {
              const parsed = JSON.parse(cached);
              setCurrentUser(parsed);
              setSelectedRole(parsed.role);
            } else {
              let demoRole = selectedRole || 'customer';
              let demoName = firebaseUser.displayName || 'EVEX Member';
              let demoAgency = '';

              if (firebaseUser.email === 'customer.demo@evex.app') {
                demoRole = 'customer';
                demoName = 'Keerthana (Demo Customer)';
              } else if (firebaseUser.email === 'manager.demo@evex.app') {
                demoRole = 'manager';
                demoName = 'EVEX Events Co. (Demo Manager)';
                demoAgency = 'EVEX Events Co.';
              } else if (firebaseUser.email === 'seeker.demo@evex.app') {
                demoRole = 'seeker';
                demoName = 'Ananya (Demo Job Seeker)';
              }

              const fallback = {
                id: firebaseUser.uid,
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: demoName,
                role: demoRole,
                agency: demoAgency,
                verified: true,
                isDemoAccount: firebaseUser.email?.includes('.demo@')
              };
              setCurrentUser(fallback);
              setSelectedRole(fallback.role);

              // Attempt write to Firestore for self-healing
              try {
                await setDoc(userDocRef, fallback, { merge: true });
              } catch (e) {
                // Production rules may deny until rules deployment
              }
            }
          }
        } catch (err) {
          console.warn('Firestore user fetch on auth change notice:', err.message);
          const cached = localStorage.getItem('evex_real_current_user');
          if (cached) {
            const parsed = JSON.parse(cached);
            setCurrentUser(parsed);
            setSelectedRole(parsed.role);
          }
        }
      } else {
        // User is definitely signed out
        setCurrentUser(null);
        setSelectedRole(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const selectRole = (role) => {
    setSelectedRole(role);
    if (role) {
      localStorage.setItem('evex_real_selected_role', role);
    } else {
      localStorage.removeItem('evex_real_selected_role');
    }
  };

  // Real Firebase User Registration
  const register = async ({ name, email, phone, password, role }) => {
    const targetRole = role || selectedRole;
    if (!targetRole) {
      throw new Error('Please select an account type (Customer, Event Manager, or Job Seeker).');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    let uid = `usr_${Date.now()}`;
    let firebaseRegistered = false;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      uid = userCredential.user.uid;
      firebaseRegistered = true;

      try {
        await updateFirebaseProfile(userCredential.user, { displayName: name.trim() });
      } catch (e) {
        console.warn('DisplayName update notice:', e.message);
      }
    } catch (authError) {
      console.warn('Firebase Auth Registration:', authError.code, authError.message);
      if (authError.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email address already exists. Please sign in.');
      } else if (authError.code === 'auth/weak-password') {
        throw new Error('Password must be at least 6 characters long.');
      } else if (authError.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (authError.code === 'auth/configuration-not-found') {
        console.info('Note: Email/Password provider needs activation in Firebase Console for evex-1c901.');
      } else {
        throw new Error(`Registration error: ${authError.message}`);
      }
    }

    // Prepare user document (never store password)
    const newUser = {
      id: uid,
      uid: uid,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      role: targetRole,
      createdAt: new Date().toISOString(),
      avatar:
        targetRole === 'customer'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : targetRole === 'manager'
          ? 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      companyName: targetRole === 'manager' ? `${name.trim()} Productions` : '',
      specialties: targetRole === 'manager' ? ['Weddings', 'Corporate', 'Social'] : [],
      rating: 5.0,
      verified: true,
      skills: targetRole === 'seeker' ? ['Catering', 'Setup', 'Service'] : [],
      experience: targetRole === 'seeker' ? '1 Year' : '',
      backend: firebaseRegistered ? 'firebase' : 'local-sync'
    };

    // Save private user document to Firestore
    try {
      await setDoc(doc(db, 'users', uid), newUser);

      // If manager or seeker, create sanitized public profile (strictly NO email or phone)
      if (targetRole === 'manager' || targetRole === 'seeker') {
        const publicData = {
          id: uid,
          uid: uid,
          name: name.trim(),
          role: targetRole,
          avatar: newUser.avatar,
          companyName: newUser.companyName || '',
          specialties: newUser.specialties || [],
          rating: newUser.rating || 5.0,
          verified: true,
          skills: newUser.skills || [],
          experience: newUser.experience || ''
        };
        await setDoc(doc(db, 'publicProfiles', uid), publicData);
      }

      setFirebaseStatus('connected');
    } catch (firestoreErr) {
      console.warn('Firestore setDoc notice:', firestoreErr.message);
    }

    setCurrentUser(newUser);
    setSelectedRole(targetRole);
    return newUser;
  };

  // Real Firebase User Login with Auto-Role Detection
  const login = async ({ emailOrPhone, password, requiredRole }) => {
    const identifier = emailOrPhone.trim().toLowerCase();
    let targetEmail = identifier;

    // If identifier is a phone number, attempt lookup in Firestore
    if (!identifier.includes('@')) {
      try {
        const q = query(collection(db, 'users'), where('phone', '==', identifier));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          targetEmail = snapshot.docs[0].data().email;
        }
      } catch (err) {
        console.warn('Phone lookup notice:', err.message);
      }
    }

    let authenticatedUser = null;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, targetEmail, password);
      const uid = userCredential.user.uid;

      // Fetch user profile from Firestore to determine genuine role
      try {
        const userDocRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          authenticatedUser = userSnap.data();
        } else {
          authenticatedUser = {
            id: uid,
            uid: uid,
            email: targetEmail,
            name: userCredential.user.displayName || 'EVEX Member',
            role: requiredRole || selectedRole || 'customer',
            verified: true
          };
        }
      } catch (err) {
        console.warn('Firestore read on login notice:', err.message);
      }
    } catch (authError) {
      console.warn('Firebase Auth Login:', authError.code, authError.message);
      if (authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please verify your credentials.');
      } else if (authError.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please register first.');
      } else if (authError.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (authError.code === 'auth/configuration-not-found') {
        // Fallback for demo / offline accounts
        const cached = localStorage.getItem('evex_real_current_user');
        if (cached) {
          const user = JSON.parse(cached);
          if (user.email === identifier || user.phone === identifier) {
            authenticatedUser = user;
          }
        }
        if (!authenticatedUser) {
          throw new Error('Firebase Auth is activating. Please check your credentials or register a new profile.');
        }
      } else {
        throw new Error(`Authentication error: ${authError.message}`);
      }
    }

    if (!authenticatedUser) {
      throw new Error('Authentication failed. Please verify your credentials.');
    }

    // Role verification: If user specifically clicked a role-restricted entry, enforce matching role
    if (requiredRole && authenticatedUser.role && authenticatedUser.role !== requiredRole) {
      const roleName =
        authenticatedUser.role === 'customer'
          ? 'Customer Portal'
          : authenticatedUser.role === 'manager'
          ? 'Event Manager Portal'
          : 'Job Seeker Portal';
      throw new Error(`This account is registered for the ${roleName}. Please sign in to that portal.`);
    }

    setCurrentUser(authenticatedUser);
    setSelectedRole(authenticatedUser.role);
    return authenticatedUser;
  };

  // Google Sign-In with auto-profile creation
  const loginWithGoogle = async (targetRole = 'customer') => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      let userProfile = null;
      if (snap.exists()) {
        userProfile = snap.data();
      } else {
        // Create initial Google user profile
        userProfile = {
          id: user.uid,
          uid: user.uid,
          name: user.displayName || 'EVEX Member',
          email: user.email,
          phone: user.phoneNumber || '',
          role: targetRole,
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          createdAt: new Date().toISOString(),
          verified: true
        };
        await setDoc(userRef, userProfile);

        if (targetRole === 'manager' || targetRole === 'seeker') {
          await setDoc(doc(db, 'publicProfiles', user.uid), {
            id: user.uid,
            uid: user.uid,
            name: userProfile.name,
            role: targetRole,
            avatar: userProfile.avatar,
            rating: 5.0,
            verified: true
          });
        }
      }

      setCurrentUser(userProfile);
      setSelectedRole(userProfile.role);
      return userProfile;
    } catch (err) {
      console.warn('Google Sign-In notice:', err.message);
      throw new Error(`Google Sign-In: ${err.message}`);
    }
  };

  // Clean Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase SignOut notice:', err.message);
    }
    setCurrentUser(null);
    setSelectedRole(null);
    localStorage.removeItem('evex_real_current_user');
    localStorage.removeItem('evex_real_selected_role');
  };

  // Update Profile in Firestore
  const updateProfile = async (updatedData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);

    try {
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, updatedData);

      // If manager or seeker, sync public profile with safe fields only
      if (currentUser.role === 'manager' || currentUser.role === 'seeker') {
        const publicUpdates = {};
        const safeKeys = ['name', 'avatar', 'companyName', 'specialties', 'skills', 'experience', 'rating'];
        safeKeys.forEach((k) => {
          if (updatedData[k] !== undefined) publicUpdates[k] = updatedData[k];
        });
        if (Object.keys(publicUpdates).length > 0) {
          await setDoc(doc(db, 'publicProfiles', currentUser.id), publicUpdates, { merge: true });
        }
      }
    } catch (err) {
      console.warn('Firestore updateProfile notice:', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        selectedRole,
        selectRole,
        register,
        login,
        loginWithGoogle,
        logout,
        updateProfile,
        authLoading,
        firebaseStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
