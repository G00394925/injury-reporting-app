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

export default function RegisterScreen() {
  const [role, setRole] = useState("athlete");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();

  // Validate registration form
  const validateForm = () => {
    const issues = {};

    // Name validation
    if (!name.trim()) {
      issues.name = "Name is required";
    }

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
    } else if (password.length < 8) {
      issues.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!confirmPassword) {
      issues.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      issues.confirmPassword = "Passwords do not match";
    }

    // Date of birth validation
    if (!dobDay || !dobMonth || !dobYear) {
      issues.dob = "Complete date of birth is required";
    } else {
      const dayNum = parseInt(dobDay);
      const monthNum = parseInt(dobMonth);
      const yearNum = parseInt(dobYear);

      if (dayNum < 1 || dayNum > 31) {
        issues.dob = "Invalid day (1-31)";
      } else if (monthNum < 1 || monthNum > 12) {
        issues.dob = "Invalid month (1-12)";
      } else if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
        issues.dob = "Invalid year";
      }
    }

    setErrors(issues);
    return Object.keys(issues).length === 0;
  };

  // Handle registration and add user to database
  const handleSubmission = async () => {
    if (!validateForm()) {
      Alert.alert("Form Error", "Please correct the errors in the form.");
      return;
    }

    setLoading(true);

    try {
      // Concatenate Date of Birth
      const dob = `${dobYear}-${dobMonth.padStart(2, "0")}-${dobDay.padStart(
        2,
        "0"
      )}`;

      const response = await axios.post(
        "http://localhost:5000/api/register/athlete",
        {
          name: name,
          email: email,
          password: password,
          dob: dob,
          user_type: role,
        }
      );

      console.log("Registration Response:", response.data);
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.replace("MainApp"),
        },
      ]);
    } catch (error) {
      console.error("Registration Error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
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
          <Text style={{ fontSize: 42, fontWeight: "bold" }}>Sign up</Text>
          <View style={styles.text_box_container}>
            <Text style={styles.dob_text}>I am a: </Text>
            <View style={styles.type_container}>
              <TouchableOpacity
                style={[
                  styles.type_button,
                  role === "athlete" && styles.type_active,
                ]}
                onPress={() => setRole("athlete")}
              >
                <Text
                  style={[
                    styles.type_text,
                    role === "athlete" && styles.type_text_active,
                  ]}
                >
                  Athlete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.type_button,
                  role === "coach" && styles.type_active,
                ]}
                onPress={() => setRole("coach")}
              >
                <Text
                  style={[
                    styles.type_text,
                    role === "coach" && styles.type_text_active,
                  ]}
                >
                  Coach
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.text_box, errors.name && styles.text_box_error]}
              placeholder="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
            />
            {errors.name && (
              <Text style={styles.error_text}>{errors.name}</Text>
            )}

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

            <TextInput
              style={[
                styles.text_box,
                errors.confirmPassword && styles.text_box_error,
              ]}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: null });
              }}
              secureTextEntry={true}
            />
            {errors.confirmPassword && (
              <Text style={styles.error_text}>{errors.confirmPassword}</Text>
            )}

            <Text style={styles.dob_text}>Please enter your date of birth</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <TextInput
                style={[
                  styles.dob_box,
                  { flex: 1 },
                  errors.dob && styles.text_box_error,
                ]}
                placeholder="DD"
                value={dobDay}
                keyboardType="numeric"
                maxLength={2}
                onChangeText={(text) => {
                  setDobDay(text.replace(/[^0-9]/g, ""));
                  if (errors.dob) setErrors({ ...errors, dob: null });
                }}
              />
              <TextInput
                style={[
                  styles.dob_box,
                  { flex: 1 },
                  errors.dob && styles.text_box_error,
                ]}
                placeholder="MM"
                value={dobMonth}
                keyboardType="numeric"
                maxLength={2}
                onChangeText={(text) => {
                  setDobMonth(text.replace(/[^0-9]/g, ""));
                  if (errors.dob) setErrors({ ...errors, dob: null });
                }}
              />
              <TextInput
                style={[
                  styles.dob_box,
                  { flex: 1.5 },
                  errors.dob && styles.text_box_error,
                ]}
                placeholder="YYYY"
                value={dobYear}
                keyboardType="numeric"
                maxLength={4}
                onChangeText={(text) => {
                  setDobYear(text.replace(/[^0-9]/g, ""));
                  if (errors.dob) setErrors({ ...errors, dob: null });
                }}
              />
            </View>
            {errors.dob && <Text style={styles.error_text}>{errors.dob}</Text>}
          </View>

          <Button
            title={loading ? "Creating Account..." : "Register"}
            buttonStyle={styles.register_button}
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
  dob_box: {
    flex: 1,
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 5,
    backgroundColor: "#ffffffff",
    borderColor: "#1d65ecff",
    borderWidth: 0.5,
    shadowColor: "#0d0d0edd",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.25,
    elevation: 5,
    fontSize: 16,
    textAlign: "center",
  },
  dob_text: {
    width: "90%",
    marginBottom: 10,
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
  },
  type_container: {
    flexDirection: "row",
    width: "90%",
    marginBottom: 20,
    borderRadius: 30,
    borderColor: "#1d65ecff",
    borderWidth: 0.5,
    overflow: "hidden",
  },
  type_button: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    backgroundColor: "#ffffffff",
    justifyContent: "center",
  },
  type_active: {
    backgroundColor: "#1d65ecff",
  },
  type_text: {
    fontSize: 16,
    color: "#1d65ecff",
  },
  type_text_active: {
    color: "#ffffffff",
    fontWeight: "bold",
  },
  register_button: {
    padding: 15,
    backgroundColor: "#1d65ecff",
    borderRadius: 30,
  },
});
