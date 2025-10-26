import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { firebaseConfig } from "@/config/firebase";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {isOTPSent ? "Verify OTP" : "Phone Login"}
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            {isOTPSent
              ? "Enter the 6-digit code sent to your phone"
              : "Enter your phone number to get started"}
          </ThemedText>

          {!isOTPSent ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="+1234567890"
                placeholderTextColor={Colors.light.icon}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoFocus
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
              >
                <ThemedText style={styles.buttonText}>
                  {loading ? "Sending..." : "Send OTP"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <ThemedText style={styles.phoneDisplay}>{phoneNumber}</ThemedText>

              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor={Colors.light.icon}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                <ThemedText style={styles.buttonText}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendOTP}
              >
                <ThemedText style={styles.resendText}>Resend OTP</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 30,
    textAlign: "center",
    opacity: 0.7,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 300,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
    padding: 10,
  },
  resendText: {
    color: "#0a7ea4",
    fontSize: 14,
  },
  phoneDisplay: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "600",
  },
});
