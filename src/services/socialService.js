// Servicio Firebase para comunidad (solicitudes y amigos).
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getStoredUser } from './authStorage';
import { sendFirebaseMessage } from './firebaseMessaging';

function getCurrentUser() {
  const stored = getStoredUser();
  if (!stored?.email) {
    throw new Error('Debes iniciar sesion para ver la comunidad');
  }
  return stored;
}

function getCurrentUserSafe() {
  try {
    return getCurrentUser();
  } catch (err) {
    return null;
  }
}

async function getUserName(email) {
  const snapshot = await getDoc(doc(db, 'users', email));
  if (!snapshot.exists()) return email;
  const data = snapshot.data() || {};
  return data.name || email;
}

export const socialService = {
  sendRequest: async ({ receiverEmail }) => {
    const currentUser = getCurrentUser();
    const targetEmail = receiverEmail.trim().toLowerCase();
    if (!targetEmail || targetEmail === currentUser.email) {
      throw new Error('Correo invalido');
    }
    await sendFirebaseMessage({
      sender: currentUser,
      receiverEmail: targetEmail,
      content: 'Hola, quiero ser tu amigo',
      type: 'FRIEND_REQUEST',
    });
    return { data: { ok: true } };
  },
  incoming: async () => {
    const currentUser = getCurrentUser();
    const q = query(
      collection(db, 'messages'),
      where('receiverEmail', '==', currentUser.email),
      where('type', '==', 'FRIEND_REQUEST')
    );
    const snapshot = await getDocs(q);
    const requests = await Promise.all(
      snapshot.docs.map(async (docItem) => {
        const data = docItem.data() || {};
        const senderEmail = data.senderEmail || '';
        const senderName = data.senderName || (await getUserName(senderEmail));
        return {
          id: docItem.id,
          senderEmail,
          senderName,
          receiverEmail: currentUser.email,
          status: 'Pendiente',
        };
      })
    );
    return { data: { requests } };
  },
  listenIncoming: (onUpdate) => {
    const currentUser = getCurrentUserSafe();
    if (!currentUser) return () => {};
    const q = query(
      collection(db, 'messages'),
      where('receiverEmail', '==', currentUser.email),
      where('type', '==', 'FRIEND_REQUEST')
    );
    return onSnapshot(q, async (snapshot) => {
      const requests = await Promise.all(
        snapshot.docs.map(async (docItem) => {
          const data = docItem.data() || {};
          const senderEmail = data.senderEmail || '';
          const senderName = data.senderName || (await getUserName(senderEmail));
          return {
            id: docItem.id,
            senderEmail,
            senderName,
            receiverEmail: currentUser.email,
            status: 'Pendiente',
          };
        })
      );
      onUpdate(requests);
    });
  },
  outgoing: async () => {
    const currentUser = getCurrentUser();
    const q = query(
      collection(db, 'messages'),
      where('senderEmail', '==', currentUser.email),
      where('type', '==', 'FRIEND_REQUEST')
    );
    const snapshot = await getDocs(q);
    const requests = snapshot.docs.map((docItem) => {
      const data = docItem.data() || {};
      return {
        id: docItem.id,
        senderEmail: currentUser.email,
        receiverEmail: data.receiverEmail || '',
        status: 'Pendiente',
      };
    });
    return { data: { requests } };
  },
  listenOutgoing: (onUpdate) => {
    const currentUser = getCurrentUserSafe();
    if (!currentUser) return () => {};
    const q = query(
      collection(db, 'messages'),
      where('senderEmail', '==', currentUser.email),
      where('type', '==', 'FRIEND_REQUEST')
    );
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map((docItem) => {
        const data = docItem.data() || {};
        return {
          id: docItem.id,
          senderEmail: currentUser.email,
          receiverEmail: data.receiverEmail || '',
          status: 'Pendiente',
        };
      });
      onUpdate(requests);
    });
  },
  accept: async (id) => {
    const currentUser = getCurrentUser();
    const requestRef = doc(db, 'messages', id);
    const snapshot = await getDoc(requestRef);
    if (!snapshot.exists()) {
      throw new Error('Solicitud no encontrada');
    }
    const data = snapshot.data() || {};
    const senderEmail = data.senderEmail;
    const receiverEmail = data.receiverEmail;
    if (!senderEmail || receiverEmail !== currentUser.email) {
      throw new Error('Solicitud invalida');
    }
    const batch = writeBatch(db);
    const meRef = doc(db, 'users', currentUser.email, 'friends', senderEmail);
    const friendRef = doc(db, 'users', senderEmail, 'friends', currentUser.email);
    batch.set(meRef, { since: Date.now() });
    batch.set(friendRef, { since: Date.now() });
    batch.delete(requestRef);
    await batch.commit();

    await sendFirebaseMessage({
      sender: currentUser,
      receiverEmail: senderEmail,
      content: 'Solicitud aceptada',
      type: 'REQUEST_ACCEPTED',
    });
    return { data: { ok: true } };
  },
  reject: async (id) => {
    const currentUser = getCurrentUser();
    const requestRef = doc(db, 'messages', id);
    const snapshot = await getDoc(requestRef);
    if (!snapshot.exists()) {
      throw new Error('Solicitud no encontrada');
    }
    const data = snapshot.data() || {};
    if (data.receiverEmail !== currentUser.email) {
      throw new Error('Solicitud invalida');
    }
    await deleteDoc(requestRef);
    return { data: { ok: true } };
  },
  friends: async () => {
    const currentUser = getCurrentUser();
    const friendsSnapshot = await getDocs(
      collection(db, 'users', currentUser.email, 'friends')
    );
    const friends = await Promise.all(
      friendsSnapshot.docs.map(async (docItem) => {
        const friendEmail = docItem.id;
        const userSnap = await getDoc(doc(db, 'users', friendEmail));
        const data = userSnap.exists() ? userSnap.data() : {};
        return {
          email: friendEmail,
          name: data?.name || friendEmail,
        };
      })
    );
    return { data: { friends } };
  },
  listenFriends: (onUpdate) => {
    const currentUser = getCurrentUserSafe();
    if (!currentUser) return () => {};
    const q = collection(db, 'users', currentUser.email, 'friends');
    return onSnapshot(q, async (snapshot) => {
      const friends = await Promise.all(
        snapshot.docs.map(async (docItem) => {
          const friendEmail = docItem.id;
          const userSnap = await getDoc(doc(db, 'users', friendEmail));
          const data = userSnap.exists() ? userSnap.data() : {};
          return {
            email: friendEmail,
            name: data?.name || friendEmail,
          };
        })
      );
      onUpdate(friends);
    });
  },
};
