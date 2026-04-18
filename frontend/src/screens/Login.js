import { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import apiClient from "../config/apiConfig";

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
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setErrors({});

    try {
      const url = '/api/auth/login';
      const payload = {
        email: email,
        password: password
      };
      const response = await apiClient.post(url, payload);

      if (!response.data.verified) {
        navigation.navigate("ConfirmRegistration", { email });
      } else {
        // Save user data to context
        const { uuid, user, session_id, access_token, refresh_token } = response.data;
        login(uuid, user, session_id, access_token, refresh_token);
      }

    } catch (error) {
      console.error("Error logging in:", error);
      setErrors({ general: `${error.message}` });
    } finally {
      setLoading(false);
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
      {errors.email && (
        <Text style={styles.errorText}>{errors.email}</Text>
      )}

      <TextInput
        style={[styles.input, errors.password && styles.textBoxError]}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
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
        buttonStyle={{
          ...styles.button,
          backgroundColor: "#001a79",
        }}
        onPress={() => navigation.navigate("Register")}
        containerStyle={{ width: "90%", marginTop: 20 }}
      />

      {/* TODO: Forgot Password functionality */}
      <Button
        title="Forgot password?"
        type="clear"
        containerStyle={{ width: "80%", marginTop: 20 }}
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
    marginBottom: 40,
    fontFamily: "Rubik"
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
    color: "#000000",
    fontFamily: "Rubik"
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
