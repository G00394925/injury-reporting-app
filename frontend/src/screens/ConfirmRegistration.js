import { StyleSheet, View, TextInput, Text, TouchableOpacity } from "react-native";
import { Button } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import apiClient from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";

export default function ConfirmRegistrationScreen({ route }) {
  const navigation = useNavigation();
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if code entered is valid
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/verify_otp', {
        email: email,
        token: code
      });
      navigation.navigate("Login");
    } catch (error) {
      setErrors({ general: "Code was invalid. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Send additional One-Time Passcode if requested
  const handleSendOTP = async () => {
    try {
      const response = await apiClient.post('/api/auth/send_otp', {
        email: email
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: "#ffffff" }]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <MaterialIcons
              name="mail-outline"
              size={80}
              color={"#001a79"}
              style={{ marginHorizontal: 10 }}
            />
            <View style={styles.line} />
          </View>
          <Text style={styles.largeText}>Check your Email</Text>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructions}>Enter the code sent to your email to create your account</Text>
          </View>

          <View style={styles.inputContainer}>
            {errors.general && (
              <Text style={styles.errorText}>{errors.general}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="XXXXX"
              placeholderTextColor="#999"
              value={code}
              onChangeText={setCode}
              inputMode="numeric"
              maxLength={6}
            />
          </View>
          <TouchableOpacity
            title={loading ? "Please wait..." : "Confirm"}
            style={styles.button}
            onPress={handleConfirm}
            disabled={loading}
          >
            <Text style={{ color: "#fff", fontFamily: "Rubik", fontSize: 20 }}>Confirm</Text>
          </TouchableOpacity>

          <Button
            title="Not there? Send another code"
            type="clear"
            onPress={handleSendOTP}
            containerStyle={{ marginTop: 15 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 100
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "80%"
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#001a79"
  },
  largeText: {
    fontFamily: "Rubik",
    fontSize: 32,
    fontWeight: "bold",
    marginHorizontal: 10,
    marginBottom: 10,
    color: "#001a79",
    textAlign: "center"
  },
  instructionsContainer: {
    marginHorizontal: 20
  },
  instructions: {
    fontSize: 16,
    fontFamily: "Rubik",
    marginTop: 15,
    textAlign: "center"
  },
  inputContainer: {
    width: "60%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 35,
    paddingHorizontal: 20,
    flexDirection: "row"
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#e7e7e7",
    borderWidth: 0.5,
    borderColor: "#999",
    fontSize: 28,
    marginHorizontal: 5,
    color: "#000000",
    fontFamily: "Rubik",
    textAlign: "center"
  },
  button: {
    padding: 15,
    paddingHorizontal: 25,
    backgroundColor: "#001a79",
    borderRadius: 30,
    marginTop: 25
  },
  inputError: {
    borderColor: "#ff0000",
    borderWidth: 2
  },
  errorText: {
    fontFamily: "Rubik",
    color: "#ff0000",
    fontSize: 12,
    width: "90%",
    marginBottom: 15,
    marginTop: 2,
    paddingLeft: 15
  }
});