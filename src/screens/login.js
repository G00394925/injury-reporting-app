import { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../config/api_config";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();
  const { login } = useAuth();

  const validateForm = () => {
    const issues = {};

    if (!email) {
      issues.email = "Email is required";
    }

    if (!password) {
      issues.password = "Password is required";
    }

    setErrors(issues);
    return Object.keys(issues).length === 0;
  };

  const handleLogin = async () => {
    console.log("=== LOGIN ATTEMPT START ===");
    console.log("Email:", email);
    console.log("API_BASE_URL:", API_BASE_URL);

    if (!validateForm()) {
      console.log("ERROR: Missing email or password");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const url = `${API_BASE_URL}/api/auth/login`;
      console.log("Making request to:", url);

      const payload = {
        email: email,
        password: password
      };

      const response = await axios.post(url, payload, {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Save user data to context
      const { uuid, user } = response.data;
      login(uuid, user);

      console.log("Login context updated successfully");
      Alert.alert("Success", "Logged in successfully!");
    } catch (error) {
      console.log("=== LOGIN ERROR ===");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);

      if (error.response) {
        // Server responded with error
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);

        if (error.response.data.error == "Invalid login credentials") {
          console.log("ERROR: Invalid login credentials");
          setErrors({ general: "Incorrect email or password" });
        }
      } else if (error.request) {
        // Request made but no response
        console.error("Request made but no response received");
        console.error("Request:", error.request);
      } else {
        // Something else happened
        console.error("Error setting up request:", error.message);
      }

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      console.log("Showing error alert:", errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      console.log("=== LOGIN ATTEMPT END ===");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {errors.general && (
        <Text style={{ color: "red", marginBottom: 10 }}>{errors.general}</Text>
      )}

      <TextInput
        style={[styles.input, errors.email && styles.textBoxError]}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      <TextInput
        style={[styles.input, errors.password && styles.textBoxError]}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
        buttonStyle={styles.button}
        containerStyle={{ width: "90%", marginTop: 20 }}
      />

      <Button
        title="Don't have an account? Register"
        type="clear"
        onPress={() => navigation.navigate("Register")}
        containerStyle={{ marginTop: 15 }}
      />

      {/* DEBUG ZONE */}
      <Button
        title="DEBUG: Sign in Athlete"
        onPress={() => {
          setEmail("nogegi1021@emaxasp.com");
          setPassword("SuperAthlete!1");
          handleLogin();
        }}
      />

      <Button
        title="DEBUG: Sign in Coach"
        onPress={() => {
          setEmail("peyij65076@dubokutv.com");
          setPassword("SuperCoach!1");
          handleLogin();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40
  },
  input: {
    width: "90%",
    padding: 15,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    marginBottom: 15,
    borderWidth: 0.5,
    borderColor: "#1d65ecff",
    fontSize: 16,
    color: "#000000"
  },
  button: {
    padding: 15,
    backgroundColor: "#1d65ecff",
    borderRadius: 30
  },
  textBoxError: {
    borderColor: "#ff0000",
    borderWidth: 2
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    width: "90%",
    marginBottom: 15,
    marginTop: 2,
    paddingLeft: 15
  }
});
