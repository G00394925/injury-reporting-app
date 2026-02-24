import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api_config";
import { useAuth } from "../../context/AuthContext";
import RpeSlider from "../../components/RPESlider";
import MultiChoice from "../../components/MultiChoice";
import BodyMap from "../../components/BodyMap";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ReportScreen() {
    const navigation = useNavigation();
    const { uuid } = useAuth();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [injured, setInjured] = useState(false);
    const [ill, setIll] = useState(false);
    const [timeloss, setTimeLoss] = useState(false);
    const [consulted, setConsulted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [trained, setTrained] = useState(false);

    // Modal showing definitions of injury onset types
    const [showHelpModal, setShowHelpModal] = useState(false);

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
        comments: ""
    });

    const updateAnswer = (key, value) => {
        setAnswers((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    // Check if all questions have been answered to enable nav button
    const isQuestionAnswered = (question) => {
        switch(question.index) {
            case 0: // Injury question
                if (answers.trained === null) return false;
                if (answers.trained === "Yes") {
                    if (answers.injured === null) return false;
                    if (answers.injured === "Yes" && answers.injury_type === null) return false;
                }
                if ((answers.trained === "No" || answers.injured === "No") && answers.ill === null) return false;
                return true;

            case 1: // Injury onset
                return answers.injury_onset !== null;
            
            case 2: // Injury location
                return answers.injury_location !== null;
            
            case 3: // RPE slider (always has a default value)
                return true;
        
            case 4: // Healthcare professional question
                if (answers.consulted === null) return false;
                if (answers.consulted === "Yes" && answers.timeloss === null) return false;
                if (answers.consulted === "Yes" && answers.timeloss === "Yes" && answers.missed_activity === null) return false;
                return true;
    
            case 5: // Expected timeloss (when not consulted)
                return answers.timeloss !== null;
                
            case 6: // Activities to avoid (when not consulted)
                return answers.missed_activity !== null;
            
            case 7: // Expected outage duration
                return answers.expected_outage !== null;
            
            case 8: // Additional comments (optional)
                return true;
        
            default:
                return true;
        }
    }

    // List of Questions for report
    const questions = [
        {
            index: 0,
            component: (
                <View style={styles.compactContainer}>
                    <View>
                        <Text style={styles.compactQuestionText}>Did you train today?</Text>
                        <MultiChoice
                            options={["Yes", "No"]}
                            value={answers.trained}
                            compact={true}
                            onValueChange={(value) => { updateAnswer("trained", value); setTrained(value === "Yes");}}
                        />
                    </View>
                    { trained && (
                    <View>
                        <Text style={styles.compactQuestionText}>Did you get injured today?</Text>
                        <MultiChoice
                            options={["Yes", "No"]}
                            value={answers.injured}
                            compact={true}
                            onValueChange={(value) => { updateAnswer("injured", value); setInjured(value === "Yes"); }}
                        />
                    </View>
                    )}
                    { injured && (
                        <View>
                            <Text style={styles.compactQuestionText}>Is this a new or recurring injury?</Text>
                            <MultiChoice
                                options={["New", "Recurring"]}
                                value={answers.injury_type}
                                compact={true}
                                onValueChange={(value) => updateAnswer("injury_type", value)}
                            />
                        </View>
                    )}
                    { (answers.injured === "No" || answers.trained === "No") && (
                        <View>
                            <Text style={styles.compactQuestionText}>Do you feel ill?</Text>
                            <MultiChoice
                                options={["Yes", "No"]}
                                value={answers.ill}
                                compact={true}
                                onValueChange={(value) => { updateAnswer("ill", value); setIll(value === "Yes"); }}
                            />
                        </View>
                    )}
                </View>
            )
        },
        {
            index: 1,
            text: "Describe the injury onset",
            showButton: true,
            component: (
                <MultiChoice
                    options={["Acute", "Repetitive Sudden Onset", "Repetitive Gradual Onset", "Other"]}
                    value={answers.injury_onset}
                    onValueChange={(value) => updateAnswer("injury_onset", value)}
                />
            ),
            condition: () => injured  // Filters future questions based on answer
        },
        {
            index: 2,
            text: "Where did you get injured?",
            subtext: "Tap the area on the body map.",
            component: (
                <BodyMap
                    value={answers.injury_location}
                    onValueChange={(value) => updateAnswer("injury_location", value)}
                />
            ),
            condition: () => injured
        },
        {
            index: 3,
            text: "Rate your current pain level.",
            subtext: null,
            component: (
                <RpeSlider
                    value={answers.rpe}
                    onValueChange={(value) => updateAnswer("rpe", value)}
                />
            )
        },
        {
            index: 4,
            component: (
                <View style={styles.compactContainer}>
                    <View>
                        <Text style={styles.compactQuestionText}>Have you seen a healthcare professional?</Text>
                        <MultiChoice
                            options={["Yes", "No"]}
                            value={answers.consulted}
                            compact={true}
                            onValueChange={(value) => { updateAnswer("consulted", value); setConsulted(value === "Yes"); }}
                        />
                    </View>
                    { consulted && (
                        <View>
                            <Text style={styles.compactQuestionText}>Was timeloss suggested?</Text>
                            <MultiChoice
                                options={["Yes", "No"]}
                                value={answers.timeloss}
                                compact={true}
                                onValueChange={(value) => { updateAnswer("timeloss", value); setTimeLoss(value === "Yes"); }}
                            />
                        </View>
                    )}

                    { consulted && timeloss && (
                        <View>
                            <Text style={styles.compactQuestionText}>What activities were you advised to avoid?</Text>
                            <MultiChoice
                                options={["Competing Only", "Training & Competing"]}
                                value={answers.missed_activity}
                                compact={true}
                                onValueChange={(value) => updateAnswer("missed_activity", value)}
                            />
                        </View>
                    )}

                </View>
            ),
            condition: () => injured || ill
        },
        {
            index: 5,
            text: "Do you expect to miss any training or games due to this injury?",
            component: (
                <MultiChoice
                    options={["Yes", "No", "Unsure"]}
                    value={answers.timeloss}
                    onValueChange={(value) => updateAnswer("timeloss", value)}
                />
            ),
            condition: () => (injured || ill) && !consulted
        },
        {
            index: 6,
            text: "What activities will you be avoiding?",
            component: (
                <MultiChoice
                    options={["Competing Only", "Training & Competing"]}
                    value={answers.missed_activity}
                    onValueChange={(value) => updateAnswer("missed_activity", value)}
                />
            ),
            condition: () => (injured || ill) && !consulted && answers.timeloss === "Yes" 
        },
        {
            index: 7,
            text: "For how long do you expect to be out?",
            component: (
                <MultiChoice
                    options={["3 days", "5 days", "7 days", "14 days", "21 days", "30+ days"]}
                    value={answers.expected_outage}
                    onValueChange={(value) => updateAnswer("expected_outage", value)}
                />
            ),
            condition: () => (injured || ill) && answers.timeloss === "Yes"
        },
        {
            index: 8,
            text: "Have you any additional notes or comments?",
            component: (
                <View style={styles.commentBoxContainer}>
                    <TextInput
                        style={styles.commentBox}
                        placeholder="Add any additional details here..."
                        placeholderTextColor="#999"
                        multiline={true}
                        value={answers.comments}
                        onChangeText={(text) => updateAnswer("comments", text)}
                    />
                </View>
            )
        }
    ];

    const availableQuestions = questions.filter(q =>
        !q.condition || q.condition()
    )

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
            timeloss: answers.timeloss === "Yes"
        }

        try {
            console.log("Submitting health report for user:", uuid);

            if (!uuid) {
                console.error("No UUID exists for user");
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/api/health/report`, {
                user_id: uuid,
                answers_list: formattedAnswers
            });

            console.log("Health Report Response:", response.data);

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
                comments: ""
            });

        } catch (error) {
            console.error("Error submitting health report:", error);
        } finally {
            setIsLoading(false);
            navigation.navigate("ReportFinish", {
                restriction: answers.missed_activity,
                expected_outage: answers.expected_outage,
                consulted: answers.consulted
            });
        }
    };

    // Check if last question in order to change button text 
    const isLastQuestion = currentQuestionIndex === availableQuestions.length - 1;
    const currentQuestion = availableQuestions[currentQuestionIndex];

    return (
        <SafeAreaView style={[globalStyles.container, {backgroundColor:"#ffffff"}]}>
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
                    onPress={() => currentQuestionIndex === 0 ? navigation.navigate("AthleteMain") 
                        : setCurrentQuestionIndex(currentQuestionIndex - 1)}
                >
                    <Text style={styles.navButtonText}> {currentQuestionIndex === 0 ? "Cancel" : "Previous"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={!isQuestionAnswered(currentQuestion)}
                    onPress={() => {
                        isLastQuestion ? handleReportSubmission(answers)
                        : setCurrentQuestionIndex(currentQuestionIndex + 1)
                    }}
                >
                    <Text style={[styles.navButtonText, !isQuestionAnswered(currentQuestion) && styles.navButtonDisabled]}>
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
    navButtonDisabled: {
        color: "#d4d4d49d",
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
    commentBoxContainer: {
        width: "100%",
        paddingHorizontal: 20,
        marginHorizontal: 10
    },
    commentBox: {
        width: '100%',
        borderRadius: 15,
        height: 250,
        borderWidth: 1,
        borderColor: "#cccccc",
        padding: 15,
        backgroundColor: "#eeeeee",
    }
});
