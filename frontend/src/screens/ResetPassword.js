import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "@rneui/themed"

export default function ResetPasswordScreen() {
  const { uuid, userData } = useAuth();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();

  const validateForm = () => {
    const issues = {};

    if (!oldPass) {
      issues.oldPass = "Please enter your current password";
    }

    if (!newPass) {
      issues.newPass = "Please enter a new password";
    }

    if (newPass != confirmPass) {
      issues.confirmPass = "Passwords do not match";
    }

    setErrors(issues);
    return Object.keys(issues).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) {
      console.log("ERROR: Inputs are invalid")
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const url = `${API_BASE_URL}/api/auth/change_password`;
      
      const payload = {
        email: userData.email,
        old_password: oldPass,
        new_password: newPass
      }

      const response = await axios.post(url, payload, {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Password changed successfully")
      navigation.navigate("MainApp");
      
    } catch (error) {
      console.error("Error changing password:", error);
      setErrors({ general: "Failed to change password" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {errors.general && (
        <Text style={{ color: "red", marginBottom: 10 }}>{errors.general}</Text>
      )}

      <TextInput
        style={[styles.input, errors.oldPass && styles.textBoxError]}
        placeholder="Current Password"
        placeholderTextColor="#999"
        value={oldPass}
        onChangeText={setOldPass}
        secureTextEntry
      />
      {errors.oldPass && (
        <Text autoCapitalize="none" style={styles.errorText}>{errors.oldPass}</Text>
      )}
      {errors.confirmPass && (
        <Text style={styles.errorText}>{errors.confirmPass}</Text>
      )}

      <TextInput
        style={[styles.input, errors.newPass && styles.textBoxError]}
        placeholder="New Password"
        placeholderTextColor="#999"
        value={newPass}
        onChangeText={setNewPass}
        secureTextEntry
      />
      {errors.newPass && (
        <Text style={styles.errorText}>{errors.newPass}</Text>
      )}

      <TextInput
        style={[styles.input, errors.confirmPass && styles.textBoxError]}
        placeholder="Confirm New Password"
        placeholderTextColor="#999"
        value={confirmPass}
        onChangeText={setConfirmPass}
        secureTextEntry
      />
      {errors.confirmPass && (
        <Text style={styles.errorText}>{errors.confirmPass}</Text>
      )}

      <Button
        title={loading ? "Loading..." : "Confirm Changes"}
        onPress={handleConfirm}
        disabled={loading}
        buttonStyle={styles.button}
        containerStyle={{ width: "90%", marginTop: 20 }}
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
})