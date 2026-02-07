import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api_config";
import { useAuth } from "../../context/AuthContext";
import RpeSlider from "../../components/RPESlider";
import MultiChoice from "../../components/MultiChoice";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ReportScreen() {
    const navigation = useNavigation();
    const { uuid } = useAuth();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [injured, setInjured] = useState(false);

    const [answers, setAnswers] = useState({
        rpe: 1,
        injured: null,
        recurring: null,
        injuryLocation: null
    });

    const updateAnswer = (key, value) => {
        setAnswers((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const [showHelpModal, setShowHelpModal] = useState(false);


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
                            onValueChange={(value) => { updateAnswer("injured", value); setInjured(value === "Yes"); }}
                        />
                    </View>
                    { injured && (
                        <View>
                            <Text style={styles.compactQuestionText}>Is this a new or recurring injury?</Text>
                            <MultiChoice
                                options={["New", "Recurring"]}
                                value={answers.recurring}
                                compact={true}
                                onValueChange={(value) => updateAnswer("recurring", value)}
                            />
                        </View>
                    )}                    
                </View>
            )
        },
        {
            index: 2,
            text: "Describe the injury onset",
            subtext: null,
            showButton: true,
            component: (
                <MultiChoice
                    options={["Acute", "Repetitive Sudden Onset", "Repetitive Gradual Onset", "Other"]}
                    value={answers.injuryOnset}
                    onValueChange={(value) => updateAnswer("injuryOnset", value)}
                />
            ),
            condition: () => injured
        },
        {
            index: 3,
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
            ),
            condition: () => injured
        }
    ];

    const availableQuestions = questions.filter(q =>
        !q.condition || q.condition()
    )

    // Submit health report to database
    const handleReportSubmission = async (answers) => {
        try {
            console.log("Submitting health report for user:", uuid);

            if (!uuid) {
                console.error("No UUID exists for user");
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/api/health/report`, {
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

    // Check if last question in order to change button text 
    const isLastQuestion = currentQuestionIndex === availableQuestions.length - 1;
    const currentQuestion = availableQuestions[currentQuestionIndex];

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerText}>Daily Health Report</Text>
            </View>
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
                    <Text style={styles.questionSubtext}>
                        {currentQuestion.subtext}
                    </Text>
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
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Onset types</Text>
                            <TouchableOpacity onPress={() => setShowHelpModal(false)}>
                                <Ionicons name="close-outline" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <Text style={{fontSize: 16, fontFamily: "Rubik", marginBottom: 15}}>
                                <Text style={{fontWeight: "bold"}}>Acute: </Text> 
                                    An acute injury occurs suddenly due to a specific traumatic 
                                    event, such as a fall, collision, or lifting something heavy.
                                    Examples include sprains, fractures, and dislocations.
                            </Text>

                            <Text style={{fontSize: 16, fontFamily: "Rubik", marginBottom: 15}}>
                                <Text style={{fontWeight: "bold"}}>Repetitive Sudden Onset: </Text> 
                                    An injury that is caused by repeated stress and motion that occurs
                                    with a single event. Some examples include carpal tunnel syndrome,
                                    trigger finger, and back strain. 
                            </Text>

                            <Text style={{fontSize: 16, fontFamily: "Rubik", marginBottom: 15}}>
                                <Text style={{fontWeight: "bold"}}>Repetitive Gradual Onset: </Text> 
                                    An injury that develops over time with no identifiable singular cause
                                    or event. Example: a gradual increase in knee pain over weeks or months.
                            </Text>

                        </ScrollView>
                    </View>
                </View>

            </Modal>

            <View style={styles.navigationButtons}>
                <TouchableOpacity
                    onPress={() => currentQuestionIndex === 0 ? navigation.navigate("Dashboard") : setCurrentQuestionIndex(currentQuestionIndex - 1)}
                >
                    <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        isLastQuestion ? handleReportSubmission(answers)
                        : setCurrentQuestionIndex(currentQuestionIndex + 1)
                    }}
                >
                    <Text style={styles.navButtonText}>{isLastQuestion ? "Submit" : "Next"}</Text>
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
    questionButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#1d65ecff",
        justifyContent: "center",
    },
    questionButtonText: {
        color: "#ffffffff",
        fontSize: 12,
        fontWeight: "bold",
        alignSelf: "center",
        fontFamily: "Rubik",
    },
    componentContainer: {
        width: "100%",
        alignItems: "center"
    },
    questionText: {
        fontSize: 20,
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
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        width: '90%',
        maxHeight: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Rubik',
        color: '#333',
    },
    modalBody: {
        padding: 20,
    },
});
