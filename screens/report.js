import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Touchable,
} from "react-native";
import { Slider } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api_config";
import { useAuth } from "../context/AuthContext";
import RpeSlider from "../components/rpe_slider";
import MultiChoice from "../components/multi_choice";

export default function ReportScreen() {
  const navigation = useNavigation();
  const { uuid } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // List of Questions for report
  const questions = [
    {
      index: 0,
      text: "How was training?",
      subtext: "Rate your perceived exertion level below",
      component: <RpeSlider />,
    },
    {
      index: 1,
      text: "Did you get injured today?",
      subtext: null,
      component: <MultiChoice options={["Yes", "No"]} />,
    },
  ];

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
    <SafeAreaView style={[globalStyles.container, { margin: 0, flex: 1 }]}>
      <View style={styles.header}>
        <Text style={styles.header_text}>Daily Health Report</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.question_container}>
          <Text style={styles.question_text}>
            {questions[currentQuestionIndex].text}
          </Text>
          <Text style={styles.question_subtext}>
            {questions[currentQuestionIndex].subtext}
          </Text>
        </View>
        <View style={styles.componentContainer}>
          {questions[currentQuestionIndex].component}
        </View>
      </View>
      <View style={styles.navigation_buttons}>
        <TouchableOpacity
          onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
        >
          <Text style={styles.nav_button_text}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
        >
          <Text style={styles.nav_button_text}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#00000063",
    paddingBottom: 10,
    width: "100%",
  },
  header_text: {
    margin: 5,
    marginLeft: 10,
    fontSize: 24,
    fontFamily: "Rubik",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 50,
  },
  question_container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  componentContainer: {
    width: "100%",
    alignItems: "center",
  },
  question_text: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "bold",
    fontFamily: "Rubik",
    alignSelf: "center",
  },
  question_subtext: {
    fontSize: 16,
    fontFamily: "Rubik",
    alignSelf: "center",
  },
  buttons_container: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 50,
  },
  navigation_buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#00000020",
  },
  nav_button_text: {
    color: "#3b3b3bff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Rubik",
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
    minHeight: 150,
    maxHeight: 200,
  },
  choice_button_text: {
    fontSize: 16,
    marginTop: 10,
    alignSelf: "center",
    fontFamily: "Rubik",
    fontWeight: "bold",
  },
  choice_image: {
    width: 100,
    height: 100,
  },
  choice_active: {
    backgroundColor: "#1d65ecff",
  },
  choice_text_active: {
    color: "#ffffffff",
    fontWeight: "bold",
  },
});
