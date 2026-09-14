'use client';

import { createContext, useContext } from 'react';
import { User } from '@/features/auth/types';

type UserContextValue = {
  user: User | null;
};

const UserContext = createContext<UserContextValue | null>(null);

type UserProviderProps = {
  user: User | null;
  children: React.ReactNode;
};

export function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }

  return context;
}
