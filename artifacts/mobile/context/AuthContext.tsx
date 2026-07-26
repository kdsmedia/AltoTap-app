import React, { createContext, useContext, useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { storage } from '@/lib/storage';

WebBrowser.maybeCompleteAuthSession();

// Web client ID from google-services.json (oauth_client client_type: 3)
const WEB_CLIENT_ID =
  '327513974065-stp6e2q4ebm41pj3rcaeaab3flbm46l5.apps.googleusercontent.com';
const USER_KEY = '@altotap_user_v1';
const GUEST_KEY = '@altotap_guest_v1';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  authLoading: boolean;
  signingIn: boolean;
  isGuest: boolean;
  signIn: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  authLoading: true,
  signingIn: false,
  isGuest: false,
  signIn: async () => {},
  signInAsGuest: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // Restore persisted session
  useEffect(() => {
    (async () => {
      try {
        const raw = await storage.getItem(USER_KEY);
        if (raw) {
          setUser(JSON.parse(raw));
        } else {
          const guest = await storage.getItem(GUEST_KEY);
          if (guest === 'true') {
            setIsGuest(true);
            setUser({ id: 'guest', name: 'Tamu', email: '', picture: undefined });
          }
        }
      } catch {
        // ignore
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const signIn = async () => {
    setSigningIn(true);
    try {
      const redirectUri = Linking.createURL('/');

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(WEB_CLIENT_ID)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` +
        `scope=${encodeURIComponent('openid email profile')}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type !== 'success') return;

      // Access token lives in the URL hash fragment (#access_token=...)
      const hash = result.url.split('#')[1] ?? '';
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (!accessToken) return;

      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();

      const info: UserInfo = {
        id: data.id ?? '',
        name: data.name ?? '',
        email: data.email ?? '',
        picture: data.picture,
      };
      setUser(info);
      await storage.setItem(USER_KEY, JSON.stringify(info));
    } catch {
      // Sign-in failed silently — user stays on login screen
    } finally {
      setSigningIn(false);
    }
  };

  const signInAsGuest = async () => {
    const guestUser: UserInfo = { id: 'guest', name: 'Tamu', email: '', picture: undefined };
    setIsGuest(true);
    setUser(guestUser);
    await storage.setItem(GUEST_KEY, 'true');
  };

  const signOut = async () => {
    setUser(null);
    setIsGuest(false);
    await storage.removeItem(USER_KEY);
    await storage.removeItem(GUEST_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, signingIn, isGuest, signIn, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
