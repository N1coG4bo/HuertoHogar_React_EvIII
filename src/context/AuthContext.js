import React, { createContext, useEffect, useMemo, useState } from 'react';

const USERS_KEY = 'hh_users';
const SESSION_KEY = 'hh_user';

export const AuthContext = createContext();

const DEFAULT_ADMIN = {
  email: 'admin@huertohogar.com',
  password: 'admin123',
  name: 'Admin',
  role: 'admin',
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(USERS_KEY);
    if (saved) return JSON.parse(saved);
    return [DEFAULT_ADMIN];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const isAdmin = user?.role === 'admin';

  function login(email, password) {
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('Credenciales invalidas');
    setUser({ email: found.email, name: found.name, role: found.role });
  }

  function register({ email, password, name }) {
    if (users.some((u) => u.email === email)) {
      throw new Error('El correo ya esta registrado');
    }
    const newUser = { email, password, name, role: 'user' };
    setUsers((prev) => [...prev, newUser]);
    setUser({ email, name, role: 'user' });
  }

  function logout() {
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      users,
      login,
      register,
      logout,
    }),
    [user, isAdmin, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
