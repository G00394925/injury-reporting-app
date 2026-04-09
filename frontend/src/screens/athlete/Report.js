import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { useState } from "react";
import apiClient from "../../config/apiConfig";
import { useAuth } from "../../context/AuthContext";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getQuestions } from "../../config/reportQuestions/index";

export default function ReportScreen({ route }) {
  const navigation = useNavigation();
  const { uuid, userData, session } = useAuth();
  const healthStatus = route.params?.healthStatus || "Healthy";
  const recoveryDate = route.params?.recoveryDate || null;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [injured, setInjured] = useState(false);
  const [ill, setIll] = useState(false);
  const [timeloss, setTimeLoss] = useState(false);
  const [consulted, setConsulted] = useState(false);
  const [trained, setTrained] = useState(false);

  const [answers, setAnswers] = useState({
    rpe: 1,
    trained: null,
    injured: null,
    ill: null,
    injury_type: null,
    timeloss: null,
    injury_onset: null,
    injury_location: null,
    consulted: null,
    missed_activity: null,
    expected_outage: null,
    comments: "",
    // Followup question answers
    recovery_progress: null,
    practitioner_contact: null,
    availability: null,
    expected_return: null
  });

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const questions = getQuestions(
    healthStatus,
    updateAnswer,
    answers,
    setInjured,
    setIll,
    setConsulted,
    setTimeLoss,
    setTrained,
    recoveryDate
  );

  const availableQuestions = questions.filter(
    (q) => !q.condition || q.condition()
  );

  const isQuestionAnswered = (question) => {
    if (question.validate) {
      return question.validate(answers);
    }
    return true;
  };

  // Submit health report to database
  const handleReportSubmission = async (answers) => {
    setIsLoading(true);

    // Format to boolean values for backend
    const formattedAnswers = {
      ...answers,
      trained: answers.trained === "Yes",
      injured: answers.injured === "Yes",
      ill: answers.ill === "Yes",
      consulted: answers.consulted === "Yes",
      timeloss: answers.timeloss === "Yes",
      followup: healthStatus !== "Healthy"
    };

    try {
      console.log("Submitting health report for user:", uuid);

      if (!uuid) {
        console.error("No UUID exists for user");
        return;
      }

      if(healthStatus === "Healthy") {
        // Submit normal report
        const response = await apiClient.post('/api/health/report', {
          user_id: uuid,
          user_data: userData,
          session: session,
          answers_list: formattedAnswers
        });
        console.log("Health Report Response:", response.data);

      } else {
        // Submit follow-up report
        const response = await apiClient.post('/api/health/followup_report', {
          user_id: uuid,
          user_data: userData,
          session: session,
          answers_list: formattedAnswers
        })
        console.log("Health Report Response:", response.data);
      }

      // Reset form after submission
      setCurrentQuestionIndex(0);
      setAnswers({
        rpe: 1,
        trained: null,
        injured: null,
        ill: null,
        injury_type: null,
        timeloss: null,
        injury_onset: null,
        injury_location: null,
        consulted: null,
        missed_activity: null,
        expected_outage: null,
        comments: "",
        // Followup question answers
        recovery_progress: null,
        practitioner_contact: null,
        availability: null,
        expected_return: null
      });
    } catch (error) {
      console.error("Error submitting health report:", error);
    } finally {
      setIsLoading(false);
      navigation.navigate("ReportFinish", {
        restriction: answers.missed_activity,
        expected_outage: answers.expected_outage,
        consulted: answers.consulted,
        followup: healthStatus !== "Healthy",
        availability: answers.availability
      });
    }
  };

  // Check if last question in order to change button text
  const isLastQuestion = currentQuestionIndex === availableQuestions.length - 1;
  const currentQuestion = availableQuestions[currentQuestionIndex];

  return (
    <SafeAreaView
      style={[globalStyles.container, { backgroundColor: "#ffffff" }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
          {currentQuestion.showButton && (
            <TouchableOpacity
              style={styles.questionButton}
              onPress={() => setShowHelpModal(true)}
            >
              <Text style={styles.questionButtonText}>?</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.questionSubtext}>{currentQuestion.subtext}</Text>
        </View>
        <View style={styles.componentContainer}>
          {currentQuestion.component}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showHelpModal}
        onRequestClose={() => setShowHelpModal(false)}
        statusBarTranslucent={true}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            <View style={globalStyles.modalHeader}>
              <Text style={globalStyles.modalTitle}>Onset types</Text>
              <TouchableOpacity onPress={() => setShowHelpModal(false)}>
                <Ionicons name="close-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={globalStyles.modalBody}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Rubik",
                  marginBottom: 15
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Acute: </Text>
                An acute injury occurs suddenly due to a specific traumatic
                event, such as a fall, collision, or lifting something heavy.
                Examples include sprains, fractures, and dislocations.
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Rubik",
                  marginBottom: 15
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  Repetitive Sudden Onset:{" "}
                </Text>
                An injury that is caused by repeated stress and motion that
                occurs with a single event. Some examples include carpal tunnel
                syndrome, trigger finger, and back strain.
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Rubik",
                  marginBottom: 15
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  Repetitive Gradual Onset:{" "}
                </Text>
                An injury that develops over time with no identifiable singular
                cause or event. Example: a gradual increase in knee pain over
                weeks or months.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          onPress={() =>
            currentQuestionIndex === 0
              ? navigation.navigate("MainApp")
              : setCurrentQuestionIndex(currentQuestionIndex - 1)
          }
        >
          <Text style={styles.navButtonText}>
            {" "}
            {currentQuestionIndex === 0 ? "Cancel" : "Previous"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!isQuestionAnswered(currentQuestion) || isLoading}
          onPress={() => {
            isLastQuestion
              ? handleReportSubmission(answers)
              : setCurrentQuestionIndex(currentQuestionIndex + 1);
          }}
        >
          <Text
            style={[
              styles.navButtonText,
              (!isQuestionAnswered(currentQuestion) || isLoading) && styles.navButtonDisabled
            ]}
          >
            {isLastQuestion ? "Submit" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    marginBottom: -10
  },
  content: {
    flexGrow: 1,
    paddingVertical: 5,
    paddingBottom: 50
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  questionButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1d65ecff",
    justifyContent: "center"
  },
  questionButtonText: {
    color: "#ffffffff",
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "Rubik"
  },
  componentContainer: {
    width: "100%",
    alignItems: "center"
  },
  questionText: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    fontFamily: "Rubik"
  },
  questionSubtext: {
    fontSize: 16,
    fontFamily: "Rubik"
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#00000020",
    backgroundColor: "#ffffff"
  },
  navButtonText: {
    color: "#3b3b3bff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Rubik"
  },
  navButtonDisabled: {
    color: "#d4d4d49d"
  }
});
