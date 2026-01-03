import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

function getChatId(email1, email2) {
  return email1 < email2 ? `${email1}_${email2}` : `${email2}_${email1}`;
}

function createMessageId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

async function sendFirebaseMessage({ sender, receiverEmail, content, type }) {
  const msgId = createMessageId();
  const chatId = getChatId(sender.email, receiverEmail);
  const timestamp = Date.now();
  const messageData = {
    id: msgId,
    chatId,
    senderEmail: sender.email,
    senderName: sender.name || sender.email,
    receiverEmail,
    content,
    timestamp,
    type,
    participants: [sender.email, receiverEmail],
    read: false,
  };

  const batch = writeBatch(db);
  const historyRef = doc(collection(db, 'chats_history', chatId, 'mensajes'), msgId);
  const summaryRef = doc(db, 'chats_history', chatId);
  const inboxRef = doc(db, 'messages', msgId);

  batch.set(historyRef, messageData);
  batch.set(
    summaryRef,
    {
      lastMessage: content,
      lastMessageTimestamp: timestamp,
      participants: [sender.email, receiverEmail],
      lastSender: sender.email,
    },
    { merge: true }
  );
  batch.set(inboxRef, messageData);

  await batch.commit();

  return messageData;
}

export { getChatId, sendFirebaseMessage };
