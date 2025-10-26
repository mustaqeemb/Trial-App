import { auth, db } from "@/config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  PhoneAuthProvider,
  User,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface UserData {
  id: string;
  phoneNumber: string;
  createdAt: any; // Firestore timestamp
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithPhone: (phoneNumber: string, recaptcha: any) => Promise<string>;
  verifyOTP: (verificationId: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "@auth_user";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Save user data to Firestore
  const saveUserToFirestore = async (user: User) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          id: user.uid,
          phoneNumber: user.phoneNumber || "",
          createdAt: serverTimestamp(),
        });

        // Update local userData
        setUserData({
          id: user.uid,
          phoneNumber: user.phoneNumber || "",
          createdAt: new Date(),
        });
      } else {
        // Load existing user data
        const data = userSnap.data() as UserData;
        setUserData(data);
      }
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
    }
  };

  const signInWithPhone = async (
    phoneNumber: string,
    recaptcha: any
  ): Promise<string> => {
    try {
      if (!phoneNumber.startsWith("+")) {
        throw new Error("Phone number must start with +");
      }

      if (phoneNumber.length < 10) {
        throw new Error("Please enter a valid phone number");
      }

      // const confirmation = await signInWithPhoneNumber(auth, phoneNumber);

      const phoneProvider = new PhoneAuthProvider(auth);

      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptcha
      );

      return verificationId;

      // return confirmation.verificationId;
    } catch (error: any) {
      if (error.code === "auth/invalid-phone-number") {
        throw new Error("Invalid phone number format. Please use +1234567890");
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Too many requests. Please try again later");
      } else if (error.code === "auth/quota-exceeded") {
        throw new Error("SMS quota exceeded. Please use test phone numbers");
      } else {
        throw new Error(error.message || "Failed to send OTP");
      }
    }
  };

  // Verify OTP
  const verifyOTP = async (
    verificationId: string,
    otp: string
  ): Promise<void> => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const result = await signInWithCredential(auth, credential);

      // Save user to Firestore
      await saveUserToFirestore(result.user);

      // Save to AsyncStorage for persistence
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          uid: result.user.uid,
          phoneNumber: result.user.phoneNumber,
        })
      );
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Load persisted auth state
  const loadPersistedAuth = async () => {
    try {
      const persistedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (persistedUser) {
        const userData = JSON.parse(persistedUser);
        // The auth state will be handled by onAuthStateChanged
      }
    } catch (error) {
      console.error("Error loading persisted auth:", error);
    }
  };

  useEffect(() => {
    loadPersistedAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Load user data from Firestore
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserData;
            setUserData(data);
          } else {
            // If user doesn't exist in Firestore, create them
            await saveUserToFirestore(user);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signInWithPhone,
    verifyOTP,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
