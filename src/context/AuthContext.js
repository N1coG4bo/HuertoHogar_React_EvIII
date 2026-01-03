// Contexto para autenticación y gestión básica de usuarios.
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getStoredUser, setStoredUser, clearStoredUser, clearTokens } from '../services/authStorage';

export const AuthContext = createContext();

function getErrorMessage(err, fallback) {
  return err?.response?.data?.error || err?.message || fallback;
}

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

function sanitizeUser(userData) {
  if (!userData) return null;
  const { passwordHash, ...safeUser } = userData;
  return safeUser;
}

async function getUserFromFirestore(email) {
  if (!email) return null;
  const snapshot = await getDoc(doc(db, 'users', email));
  if (!snapshot.exists()) return null;
  const data = snapshot.data() || {};
  return {
    email,
    name: data.name || email,
    passwordHash: data.passwordHash || '',
    role: data.role || 'user',
    rut: data.rut || '',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [users, setUsers] = useState([]);
  const [bootstrapped, setBootstrapped] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'root';

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      const stored = getStoredUser();
      if (!stored?.email) {
        if (active) setBootstrapped(true);
        return;
      }
      try {
        const freshUser = await getUserFromFirestore(normalizeEmail(stored.email));
        if (!active) return;
        if (freshUser) {
          const safeUser = sanitizeUser(freshUser);
          setUser(safeUser);
          setStoredUser(safeUser);
        } else {
          clearTokens();
          clearStoredUser();
          setUser(null);
        }
      } catch (err) {
        if (active) setUser(stored);
      } finally {
        if (active) setBootstrapped(true);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadUsers() {
      if (!isAdmin) {
        setUsers([]);
        return;
      }
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        if (!active) return;
        const list = snapshot.docs.map((docItem) => {
          const data = docItem.data() || {};
          return {
            email: docItem.id,
            name: data.name || docItem.id,
            role: data.role || 'user',
            rut: data.rut || '',
          };
        });
        setUsers(list);
      } catch (err) {
        if (active) setUsers([]);
      }
    }
    loadUsers();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const login = useCallback(async (email, password) => {
    const safeEmail = normalizeEmail(email);
    const safePassword = password.trim();
    const isRootLogin = safeEmail === 'root' && safePassword === '19921351-2';
    let existingUser = null;
    let firestoreError = null;
    try {
      existingUser = await getUserFromFirestore(safeEmail);
    } catch (err) {
      firestoreError = err;
    }

    if (!existingUser && safeEmail === 'root') {
      const rootUser = {
        name: 'Super Usuario',
        email: 'root',
        passwordHash: '19921351-2',
        role: 'root',
        rut: '',
      };
      if (!firestoreError) {
        await setDoc(doc(db, 'users', 'root'), rootUser);
      }
      existingUser = rootUser;
    }

    if (isRootLogin) {
      if (existingUser?.email !== 'root') {
        const rootUser = {
          name: 'Super Usuario',
          email: 'root',
          passwordHash: '19921351-2',
          role: 'root',
          rut: '',
        };
        try {
          await setDoc(doc(db, 'users', 'root'), rootUser);
        } catch (err) {
          // Fallback silencioso si no podemos escribir.
        }
        existingUser = rootUser;
      } else if (existingUser?.passwordHash !== '19921351-2') {
        try {
          await setDoc(doc(db, 'users', 'root'), {
            ...existingUser,
            passwordHash: '19921351-2',
          });
          existingUser = { ...existingUser, passwordHash: '19921351-2' };
        } catch (err) {
          // Fallback silencioso si no podemos escribir.
        }
      }
    }

    if (!existingUser || existingUser.passwordHash !== safePassword) {
      throw new Error('Credenciales invalidas');
    }

    const safeUser = sanitizeUser(existingUser);
    setUser(safeUser);
    setStoredUser(safeUser);
    return safeUser;
  }, []);

  const register = useCallback(async ({ email, password, name, rut }) => {
    try {
      const safeEmail = normalizeEmail(email);
      if (safeEmail === 'root') {
        throw new Error('No puedes registrar el usuario root');
      }
      const existingUser = await getUserFromFirestore(safeEmail);
      if (existingUser) {
        throw new Error('El correo ya esta registrado');
      }
      const newUser = {
        name: name?.trim() || 'Usuario',
        email: safeEmail,
        passwordHash: password.trim(),
        role: 'user',
        rut: rut?.trim() || '',
      };
      await setDoc(doc(db, 'users', safeEmail), newUser);
      const safeUser = sanitizeUser(newUser);
      setUser(safeUser);
      setStoredUser(safeUser);
      return safeUser;
    } catch (err) {
      throw new Error(getErrorMessage(err, 'No pudimos crear tu cuenta'));
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user?.email) return;
    const payload = {};
    if (updates.name) payload.name = updates.name;
    if (updates.rut !== undefined) payload.rut = updates.rut;
    if (updates.password) payload.passwordHash = updates.password;
    if (Object.keys(payload).length === 0) return;
    await updateDoc(doc(db, 'users', user.email), payload);
    const updatedUser = sanitizeUser({ ...user, ...payload });
    setUser(updatedUser);
    setStoredUser(updatedUser);
  }, [user]);

  const logout = useCallback(() => {
    clearTokens();
    clearStoredUser();
    setUser(null);
    setUsers([]);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      users,
      bootstrapped,
      login,
      register,
      updateProfile,
      logout,
    }),
    [user, isAdmin, users, bootstrapped, login, register, updateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
