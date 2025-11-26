import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
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

  // Submit health report to database
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
    <SafeAreaView style={[globalStyles.container, { margin: 0 }]}>
      <View style={styles.header}>
        <Text style={styles.header_text}>Daily Health Report</Text>
      </View>
      <View>
        <Text style={styles.question_text}>How was your training today?</Text>
        <View style={styles.buttons_container}>
          <TouchableOpacity style={styles.choice} onPress={() => {}}>
            <Image source={require("../assets/Smile.png")} />
            <Text style={styles.choice_button_text}>Good!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.choice} onPress={() => {}}>
            <Image source={require("../assets/Frown.png")} />
            <Text style={styles.choice_button_text}>Not great</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 10,
    marginBottom: 20,
    width: "100%",
  },
  header_text: {
    margin: 5,
    marginLeft: 10,
    fontSize: 24,
    fontFamily: "Rubik",
    fontWeight: "bold",
  },
  question_text: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: "Rubik",
    fontWeight: "bold",
  },
  buttons_container: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 50,
  },
  choice: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    margin: 10,
    padding: 10,
    borderRadius: 25,
    borderColor: "#1d65ecff",
    borderWidth: 1,
  },
  choice_button_text: {
    fontSize: 16,
    marginTop: 10,
    alignSelf: "center",
    fontFamily: "Rubik",
    fontWeight: "bold",
  },
  choice_active: {
    backgroundColor: "#1d65ecff",
  },
  choice_text_active: {
    color: "#ffffffff",
    fontWeight: "bold",
  },
});
