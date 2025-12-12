import { useState } from "react";
import { Text, TextInput, Alert, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../config/api_config";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const { login } = useAuth();

    const handleLogin = async () => {
        console.log("=== LOGIN ATTEMPT START ===");
        console.log("Email:", email);
        console.log("API_BASE_URL:", API_BASE_URL);

        if (!email || !password) {
            console.log("ERROR: Missing email or password");
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        setLoading(true);

        try {
            const url = `${API_BASE_URL}/api/login`;
            console.log("Making request to:", url);

            const payload = {
                email: email,
                password: password,
            };
            console.log("Payload:", payload);

            const response = await axios.post(url, payload, {
                timeout: 10000,
                headers: {
                    "Content-Type": "application/json",
                },
            });


            // Check if response has expected data
            if (!response.data.uuid) {
                console.error("ERROR: No UUID in response");
                Alert.alert("Error", "Invalid response from server");
                return;
            }

            if (!response.data.user) {
                console.error("ERROR: No user data in response");
                Alert.alert("Error", "Invalid response from server");
                return;
            }

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
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 40,
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
    },
    button: {
        padding: 15,
        backgroundColor: "#1d65ecff",
        borderRadius: 30,
    },
});
