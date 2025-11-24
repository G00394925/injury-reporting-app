import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api_config";
import { useAuth } from "../context/AuthContext";

export default function ReportScreen() {
  const navigation = useNavigation();
  const { uuid } = useAuth();

  const handleReportSubmission = async (mood) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/health-report`, {
        athlete_id: uuid,
        mood_response: mood,
      });
      console.log("Health Report Response:", response.data);
    } catch (error) {
      console.error("Error submitting health report:", error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={styles.question_text}>How was your training today?</Text>
      <View style={styles.buttons_container}>
        <Pressable
          style={styles.mood_button}
          onPress={() => {
            handleReportSubmission("Good!");
            navigation.navigate("Dashboard");
          }}
        >
          <Image source={require("../assets/Smile.png")} />
          <Text style={styles.button_text}>Good!</Text>
        </Pressable>
        <Pressable
          style={styles.mood_button}
          onPress={() => {
            handleReportSubmission("Not great");
            navigation.navigate("Dashboard");
          }}
        >
          <Image source={require("../assets/Frown.png")} />
          <Text style={styles.button_text}>Not great</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  question_text: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: "Rubik",
    fontWeight: "bold",
  },
  buttons_container: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 30,
  },
  mood_button: {
    backgroundColor: "#cfcfcfff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 5,
    borderBottomColor: "#a3a3a3",
    borderRightColor: "#a3a3a3",
    borderTopColor: "#e1e1e1",
    borderLeftColor: "#e1e1e1",
  },
  button_text: {
    fontSize: 16,
    marginTop: 10,
    alignSelf: "center",
    fontFamily: "Rubik",
    fontWeight: "bold",
  },
});
