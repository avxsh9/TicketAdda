// index-auth.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* ---------- Firebase config ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyDSPYXYwrxaVTna2CfFI2EktEysXb7z5iE",
  authDomain: "ticketaddda.firebaseapp.com",
  projectId: "ticketaddda",
  storageBucket: "ticketaddda.firebasestorage.app",
  messagingSenderId: "987839286443",
  appId: "1:987839286443:web:235ed8857cd8cc8477fbee",
  measurementId: "G-EDDVKVVXHS"
};

/* init app safely */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* helpers */
const $ = id => document.getElementById(id);

/* set persistence */
(async function tryDefaultPersistence() {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (err) {
    try { await setPersistence(auth, browserSessionPersistence); } catch(e){}
  }
})();

/* DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  const authActions = $('authActions');
  const userMenu = $('userMenu');
  const userNameElm = $('userNameElm');
  const userAvatar = $('userAvatar');
  const logoutBtn = $('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Logout error:', err);
        alert('Logout failed. Try again.');
      }
    });
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      let displayName = (user.displayName || '').trim();
      if (!displayName) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            const data = snap.data();
            displayName = (data && data.fullName) ? data.fullName : '';
          }
        } catch (err) {
          console.warn('Could not read user doc:', err);
        }
      }
      if (!displayName) displayName = (user.email || 'User').split('@')[0];

      if (authActions) authActions.style.display = 'none';
      if (userMenu) {
        userMenu.style.display = 'flex';
        if (userNameElm) userNameElm.textContent = `Hi, ${displayName}`;
        if (user.photoURL && userAvatar) userAvatar.src = user.photoURL;
      }
    } else {
      if (authActions) authActions.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }
  }, (error) => {
    console.error('onAuthStateChanged error:', error);
  });
});
