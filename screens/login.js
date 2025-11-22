import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Button } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { API_BASE_URL } from "../config/api_config";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validate login form
  const validateForm = () => {
    const issues = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      issues.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      issues.email = "Invalid email format";
    }

    // Password validation
    if (!password) {
      issues.password = "Password is required";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%", alignItems: "center" }}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontSize: 42, fontWeight: "bold" }}>Log in</Text>
          <View style={styles.text_box_container}>
            <TextInput
              style={[styles.text_box, errors.email && styles.text_box_error]}
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {errors.email && (
              <Text style={styles.error_text}>{errors.email}</Text>
            )}

            <TextInput
              style={[
                styles.text_box,
                errors.password && styles.text_box_error,
              ]}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              secureTextEntry={true}
            />
            {errors.password && (
              <Text style={styles.error_text}>{errors.password}</Text>
            )}
          </View>
          <Button
            title={loading ? "Logging in..." : "Log in"}
            buttonStyle={styles.login_button}
            containerStyle={{ width: "90%", marginTop: 20 }}
            onPress={handleSubmission}
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 65,
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text_box_container: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 40,
    width: "100%",
    paddingHorizontal: 20,
  },
  text_box: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: "#ffffffff",
    width: "90%",
    marginBottom: 5,
    borderColor: "#1d65ecff",
    borderWidth: 0.5,
    shadowColor: "#0d0d0edd",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.25,
    elevation: 5,
    fontSize: 16,
  },
  text_box_error: {
    borderColor: "#ff0000",
    borderWidth: 2,
  },
  error_text: {
    color: "#ff0000",
    fontSize: 12,
    width: "90%",
    marginBottom: 15,
    marginTop: 2,
    paddingLeft: 15,
  },
  login_button: {
    padding: 15,
    backgroundColor: "#1d65ecff",
    borderRadius: 30,
  },
});
