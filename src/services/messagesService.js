// Servicio Firebase para mensajes.
import { collection, doc, getDocs, onSnapshot, orderBy, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { getStoredUser } from './authStorage';
import { getChatId, sendFirebaseMessage } from './firebaseMessaging';

function getCurrentUser() {
  const stored = getStoredUser();
  if (!stored?.email) {
    throw new Error('Debes iniciar sesion para ver los mensajes');
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

export const messagesService = {
  send: async (payload) => {
    const currentUser = getCurrentUser();
    const content = payload?.content?.trim() || '';
    if (!payload?.receiverEmail || !content) {
      throw new Error('Mensaje invalido');
    }
    const data = await sendFirebaseMessage({
      sender: currentUser,
      receiverEmail: payload.receiverEmail.trim().toLowerCase(),
      content,
      type: 'CHAT',
    });
    return { data };
  },
  inbox: async () => {
    const currentUser = getCurrentUser();
    const q = query(
      collection(db, 'chats_history'),
      where('participants', 'array-contains', currentUser.email),
      orderBy('lastMessageTimestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map((docItem) => {
      const data = docItem.data() || {};
      const participants = data.participants || [];
      const senderEmail = participants.find((email) => email !== currentUser.email) || '';
      return {
        id: docItem.id,
        senderEmail,
        content: data.lastMessage || '',
        timestamp: data.lastMessageTimestamp || 0,
      };
    });
    return { data: { messages } };
  },
  thread: async (email) => {
    const currentUser = getCurrentUser();
    const otherEmail = email.trim().toLowerCase();
    const chatId = getChatId(currentUser.email, otherEmail);
    const q = query(
      collection(db, 'chats_history', chatId, 'mensajes'),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));

    const batch = writeBatch(db);
    let hasUpdates = false;
    snapshot.docs.forEach((docItem) => {
      const data = docItem.data();
      if (data.receiverEmail === currentUser.email && data.read === false) {
        batch.update(doc(db, 'chats_history', chatId, 'mensajes', docItem.id), { read: true });
        hasUpdates = true;
      }
    });
    if (hasUpdates) {
      await batch.commit();
    }

    return { data: { messages } };
  },
  listenInbox: (onUpdate) => {
    const currentUser = getCurrentUserSafe();
    if (!currentUser) return () => {};
    const q = query(
      collection(db, 'chats_history'),
      where('participants', 'array-contains', currentUser.email),
      orderBy('lastMessageTimestamp', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((docItem) => {
        const data = docItem.data() || {};
        const participants = data.participants || [];
        const senderEmail = participants.find((email) => email !== currentUser.email) || '';
        return {
          id: docItem.id,
          senderEmail,
          content: data.lastMessage || '',
          timestamp: data.lastMessageTimestamp || 0,
        };
      });
      onUpdate(messages);
    });
  },
  listenThread: (email, onUpdate) => {
    const currentUser = getCurrentUserSafe();
    if (!currentUser) return () => {};
    const otherEmail = email.trim().toLowerCase();
    const chatId = getChatId(currentUser.email, otherEmail);
    const q = query(
      collection(db, 'chats_history', chatId, 'mensajes'),
      orderBy('timestamp', 'asc')
    );
    return onSnapshot(q, async (snapshot) => {
      const messages = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      onUpdate(messages);

      const batch = writeBatch(db);
      let hasUpdates = false;
      snapshot.docs.forEach((docItem) => {
        const data = docItem.data();
        if (data.receiverEmail === currentUser.email && data.read === false) {
          batch.update(doc(db, 'chats_history', chatId, 'mensajes', docItem.id), { read: true });
          hasUpdates = true;
        }
      });
      if (hasUpdates) {
        await batch.commit();
      }
    });
  },
};
