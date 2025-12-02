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

  function updateProfile(updates) {
    if (!user) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.email !== user.email) return u;
        const next = { ...u };
        if (updates.name) next.name = updates.name;
        if (typeof updates.about === 'string') next.about = updates.about;
        if (typeof updates.phone === 'string') next.phone = updates.phone;
        if (typeof updates.address === 'string') next.address = updates.address;
        if (updates.password) next.password = updates.password;
        return next;
      })
    );
    setUser((prev) => ({
      ...prev,
      name: updates.name || prev?.name,
      about: typeof updates.about === 'string' ? updates.about : prev?.about,
      phone: typeof updates.phone === 'string' ? updates.phone : prev?.phone,
      address: typeof updates.address === 'string' ? updates.address : prev?.address,
      email: user.email,
      role: user.role,
    }));
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
      updateProfile,
      logout,
    }),
    [user, isAdmin, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
