import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api_config";
import { useAuth } from "../../context/AuthContext";
import RpeSlider from "../../components/rpe_slider";
import MultiChoice from "../../components/multi_choice";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportScreen() {
    const navigation = useNavigation();
    const { uuid } = useAuth();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [answers, setAnswers] = useState({
        rpe: 1,
        injured: null,
        ill: null,
        injuryLocation: null
    });

    const updateAnswer = (key, value) => {
        setAnswers((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    // List of Questions for report
    const questions = [
        {
            index: 0,
            text: "How was training?",
            subtext: null,
            component: (
                <RpeSlider
                    value={answers.rpe}
                    onValueChange={(value) => updateAnswer("rpe", value)}
                />
            )
        },
        {
            index: 1,
            text: null,
            subtext: null,
            component: (
                <View style={styles.compactContainer}>
                    <View>
                        <Text style={styles.compactQuestionText}>Did you get injured today?</Text>
                        <MultiChoice
                            options={["Yes", "No"]}
                            value={answers.injured}
                            compact={true}
                            onValueChange={(value) => updateAnswer("injured", value)}
                        />
                    </View>
                    <View>
                        <Text style={styles.compactQuestionText}>Do you feel sick?</Text>
                        <MultiChoice
                            options={["Yes", "No"]}
                            value={answers.ill}
                            compact={true}
                            onValueChange={(value) => updateAnswer("ill", value)}
                        />
                    </View>
                </View>
            )
        },
        {
            index: 2,
            text: "Where did you get injured?",
            subtext: "Select the aproximate location of your injury.",
            component: (
                <MultiChoice
                    options={[
                        "Head",
                        "Shoulder",
                        "Chest",
                        "Arm",
                        "Hand",
                        "Foot",
                        "Leg",
                        "Back",
                        "Other"
                    ]}
                    value={answers.injuryLocation}
                    onValueChange={(value) => updateAnswer("injuryLocation", value)}
                />
            )
        }
    ];

    // Submit health report to database
    const handleReportSubmission = async (answers) => {
        try {
            console.log("Submitting health report for user:", uuid);

            if (!uuid) {
                console.error("No UUID exists for user");
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/api/health-report`, {
                user_id: uuid,
                answers_list: answers
            });

            console.log("Health Report Response:", response.data);

            // Reset form after submission
            setCurrentQuestionIndex(0);
            setAnswers({
                rpe: 1,
                injured: null,
                ill: null,
                injuryLocation: null
            });

            navigation.navigate("Dashboard");
        } catch (error) {
            console.error("Error submitting health report:", error);
        }
    };

    // Check if last question in order to change button text from "Next" to "Submit"
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <SafeAreaView style={styles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerText}>Daily Health Report</Text>
            </View>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>{questions[currentQuestionIndex].text}</Text>
                    <Text style={styles.questionSubtext}>
                        {questions[currentQuestionIndex].subtext}
                    </Text>
                </View>
                <View style={styles.componentContainer}>
                    {questions[currentQuestionIndex].component}
                </View>
            </ScrollView>
            <View style={styles.navigationButtons}>
                <TouchableOpacity
                    onPress={() => currentQuestionIndex === 0 ? navigation.navigate("Dashboard") : setCurrentQuestionIndex(currentQuestionIndex - 1)}
                >
                    <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        isLastQuestion ? handleReportSubmission(answers) : setCurrentQuestionIndex(currentQuestionIndex + 1)}
                >
                    <Text style={styles.navButtonText}>{isLastQuestion ? "Submit" : "Next"}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#001a79",
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#ffffffff",
        borderRadius: 10,
        marginTop: -8,
        marginBottom: -10
    },
    content: {
        flexGrow: 1,
        paddingVertical: 30,
    },
    questionContainer: {
        paddingHorizontal: 20,
        marginBottom: 20
    },
    componentContainer: {
        width: "100%",
        alignItems: "center"
    },
    questionText: {
        fontSize: 28,
        marginBottom: 10,
        fontWeight: "bold",
        fontFamily: "Rubik",
    },
    questionSubtext: {
        fontSize: 16,
        fontFamily: "Rubik"
    },
    buttonsContainer: {
        flexDirection: "row",
        width: "100%",
        marginBottom: 50
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
        maxHeight: 200
    },
    choiceButtonText: {
        fontSize: 16,
        marginTop: 10,
        alignSelf: "center",
        fontFamily: "Rubik",
        fontWeight: "bold"
    },
    choiceImage: {
        width: 100,
        height: 100
    },
    choiceActive: {
        backgroundColor: "#1d65ecff"
    },
    choiceTextActive: {
        color: "#ffffffff",
        fontWeight: "bold"
    },
    compactContainer: {
        gap: 40,
        width: "100%"
    },
    compactQuestionText: {
        fontSize: 22,
        marginHorizontal: 20,
        marginBottom: 20,
        fontWeight: "bold",
        fontFamily: "Rubik",
    }
});
