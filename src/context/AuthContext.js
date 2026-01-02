// Contexto para autenticación y gestión básica de usuarios.
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import {
  getAccessToken,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  setTokens,
  clearTokens,
} from '../services/authStorage';

export const AuthContext = createContext();

function getErrorMessage(err, fallback) {
  return err?.response?.data?.error || err?.message || fallback;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [users, setUsers] = useState([]);
  const [bootstrapped, setBootstrapped] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'root';

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      const token = getAccessToken();
      if (!token) {
        if (active) setBootstrapped(true);
        return;
      }
      try {
        const { data } = await authService.getProfile();
        if (!active) return;
        setUser(data.user);
        setStoredUser(data.user);
      } catch (err) {
        if (!active) return;
        clearTokens();
        clearStoredUser();
        setUser(null);
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
        const { data } = await authService.listUsers();
        if (active) setUsers(data.users || []);
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
    try {
      const { data } = await authService.login(email, password);
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setUser(data.user);
      setStoredUser(data.user);
      return data.user;
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Credenciales invalidas'));
    }
  }, []);

  const register = useCallback(async ({ email, password, name, rut }) => {
    try {
      const { data } = await authService.register({ email, password, name, rut });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setUser(data.user);
      setStoredUser(data.user);
      return data.user;
    } catch (err) {
      throw new Error(getErrorMessage(err, 'No pudimos crear tu cuenta'));
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    const payload = {};
    if (updates.name) payload.name = updates.name;
    if (updates.rut) payload.rut = updates.rut;
    if (Object.keys(payload).length > 0) {
      await authService.updateUser(user.email, payload);
    }
    if (updates.password) {
      await authService.resetPassword(user.email, updates.password);
    }
    const updatedUser = { ...user, ...payload };
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
