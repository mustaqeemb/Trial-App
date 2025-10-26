import { firebaseConfig } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("+923317220554");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithPhone, verifyOTP } = useAuth();

  const recaptchaVerifier = useRef(null);

  const formatPhoneNumber = (text: string) => {
    let cleaned = text.replace(/[^\d+]/g, "");
    if (cleaned.length > 0 && !cleaned.startsWith("+")) {
      cleaned = `+${cleaned}`;
    }
    return cleaned;
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter a phone number");
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (formattedPhone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const verificationId = await signInWithPhone(
        formattedPhone,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      setIsOTPSent(true);
      Alert.alert("Success", "OTP sent to your phone number");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP(verificationId, otp);
      router.replace("/home");
      Alert.alert("Success", "Login successful!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setIsOTPSent(false);
    setOtp("");
    setVerificationId("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed" size={48} color="#fff" />
              </View>
            </View>

            <Text style={styles.title}>
              {isOTPSent ? "Verify OTP" : "Welcome Back"}
            </Text>

            <Text style={styles.subtitle}>
              {isOTPSent
                ? "Enter the 6-digit code sent to your phone"
                : "Enter your phone number to get started"}
            </Text>

            {!isOTPSent ? (
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color="#667eea" />
                  <TextInput
                    style={styles.input}
                    placeholder="+1234567890"
                    placeholderTextColor="#999"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSendOTP}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#667eea" />
                  ) : (
                    <>
                      <Ionicons name="send" size={20} color="#667eea" />
                      <Text style={styles.buttonText}>
                        Send OTP
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <View style={styles.phoneInfo}>
                  <Ionicons name="phone-portrait-outline" size={24} color="#fff" />
                  <Text style={styles.phoneDisplay}>{phoneNumber}</Text>
                </View>

                <View style={styles.inputWrapper}>
                  <Ionicons name="keypad-outline" size={20} color="#667eea" />
                  <TextInput
                    style={styles.input}
                    placeholder="123456"
                    placeholderTextColor="#999"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#667eea" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="#667eea" />
                      <Text style={styles.buttonText}>
                        Verify OTP
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 30,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    marginBottom: 40,
    textAlign: "center",
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 350,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    padding: 18,
    fontSize: 16,
    color: '#000',
  },
  phoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    gap: 10,
  },
  phoneDisplay: {
    fontSize: 16,
    fontWeight: "600",
    color: '#fff',
  },
  button: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "700",
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 6,
  },
  resendText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
