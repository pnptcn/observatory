import create from "zustand";
import auth0, { Auth0Error, AuthOptions } from "auth0-js";
import { toast } from "sonner";

const auth0Client = new auth0.WebAuth({
  domain: import.meta.env.VITE_AUTH0_DOMAIN as string,
  clientID: import.meta.env.VITE_AUTH0_CLIENT_ID as string,
  redirectUri: `${window.location.origin}/callback`,
  responseType: 'token id_token',
  scope: 'openid profile email'
});

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  error: Auth0Error | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  handleAuthentication: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await new Promise<any>((resolve, reject) => {
        auth0Client.login({
          realm: "Username-Password-Authentication",
          username: email,
          password,
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      set({ isAuthenticated: true, user: result, isLoading: false });
      toast.success("Logged in successfully!");
    } catch (error) {
      set({ error: error as Auth0Error, isAuthenticated: false, user: null, isLoading: false });
      toast.error("Login failed. Please try again.");
    }
  },

  signup: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise<void>((resolve, reject) => {
        auth0Client.signup({
          connection: "Username-Password-Authentication",
          email,
          password,
        }, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      toast.success("Account created successfully! Please log in.");
      // After successful signup, log the user in
      await useAuthStore.getState().login(email, password);
    } catch (error) {
      set({ error: error as Auth0Error, isLoading: false });
      toast.error("Signup failed. Please try again.");
    }
  },

  loginWithGoogle: () => {
    auth0Client.authorize({ connection: 'google-oauth2' });
    toast("Redirecting to Google for login...");
  },

  logout: () => {
    auth0Client.logout({ returnTo: window.location.origin });
    set({ isAuthenticated: false, user: null, error: null });
    toast.success("Logged out successfully!");
  },

  handleAuthentication: async () => {
    return new Promise<void>((resolve, reject) => {
      auth0Client.parseHash((error, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          set({ isAuthenticated: true, user: authResult.idTokenPayload, error: null });
          toast.success("Authentication successful!");
          resolve();
        } else if (error) {
          set({ error: error as Auth0Error, isAuthenticated: false, user: null });
          toast.error("Authentication failed. Please try again.");
          reject(error);
        }
      });
    });
  },
}));

