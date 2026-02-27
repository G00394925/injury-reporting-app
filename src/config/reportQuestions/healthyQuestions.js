import RpeSlider from "../../components/RPESlider";
import MultiChoice from "../../components/MultiChoice";
import BodyMap from "../../components/BodyMap";
import { View, Text, TextInput, StyleSheet } from "react-native";

export const getHealthyQuestions = (updateAnswer, answers, setInjured, setIll, setConsulted, setTimeLoss, setTrained) => [
    // List of Questions for report
    {
        index: 0,
        component: (
            <View style={styles.compactContainer}>
                <View>
                    <Text style={styles.compactQuestionText}>
                        Did you train today?
                    </Text>
                    <MultiChoice
                        options={["Yes", "No"]}
                        value={answers.trained}
                        compact={true}
                        onValueChange={(value) => {
                            updateAnswer("trained", value);
                            setTrained(value === "Yes");
                        }}
                    />
                </View>
                {answers.trained === "Yes" && (
                    <View>
                        <Text style={styles.compactQuestionText}>
                            Did you get injured today?
                        </Text>
                        <MultiChoice
                            options={["Yes", "No"]}
                            value={answers.injured}
                            compact={true}
                            onValueChange={(value) => {
                                updateAnswer("injured", value);
                                setInjured(value === "Yes");
                            }}
                        />
                    </View>
                )}
                {answers.injured === "Yes" && (
                    <View>
                        <Text style={styles.compactQuestionText}>
                            Is this a new or recurring injury?
                        </Text>
                        <MultiChoice
                            options={["New", "Recurring"]}
                            value={answers.injury_type}
                            compact={true}
                            onValueChange={(value) =>
                                updateAnswer("injury_type", value)
                            }
                        />
                    </View>
                )}
                {(answers.injured === "No" || answers.trained === "No") && (
                    <View>
                        <Text style={styles.compactQuestionText}>
                            Do you feel ill?
                        </Text>
                        <MultiChoice
                            options={["Yes", "No"]}
                            value={answers.ill}
                            compact={true}
                            onValueChange={(value) => {
                                updateAnswer("ill", value);
                                setIll(value === "Yes");
                            }}
                        />
                    </View>
                )}
            </View>
        ),
        validate: (answers, state) => {
            if (answers.trained === null) return false;
            if (answers.trained === "Yes") {
                if (answers.injured === null) return false;
                if (answers.injured === "Yes" && answers.injury_type === null)
                    return false;
            }
            if (
                (answers.trained === "No" || answers.injured === "No") &&
                answers.ill === null
            )
                return false;
            return true;
        }
    },
    {
        index: 1,
        text: "Describe the injury onset",
        showButton: true,
        component: (
            <MultiChoice
                options={[
                    "Acute",
                    "Repetitive Sudden Onset",
                    "Repetitive Gradual Onset",
                    "Other"
                ]}
                value={answers.injury_onset}
                onValueChange={(value) => updateAnswer("injury_onset", value)}
            />
        ),
        validate: (answers) => answers.injury_onset !== null,
        condition: () => answers.injured === "Yes"
    },
    {
        index: 2,
        text: "Where did you get injured?",
        subtext: "Tap the area on the body map.",
        component: (
            <BodyMap
                value={answers.injury_location}
                onValueChange={(value) =>
                    updateAnswer("injury_location", value)
                }
            />
        ),
        validate: (answers) => answers.injury_location !== null,
        condition: () => answers.injured === "Yes"
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
        ),
        validate: () => true
    },
    {
        index: 4,
        component: (
            <View style={styles.compactContainer}>
                <View>
                    <Text style={styles.compactQuestionText}>
                        Have you seen a healthcare professional?
                    </Text>
                    <MultiChoice
                        options={["Yes", "No"]}
                        value={answers.consulted}
                        compact={true}
                        onValueChange={(value) => {
                            updateAnswer("consulted", value);
                            setConsulted(value === "Yes");
                        }}
                    />
                </View>
                {answers.consulted === "Yes" && (
                    <View>
                        <Text style={styles.compactQuestionText}>
                            Was timeloss suggested?
                        </Text>
                        <MultiChoice
                            options={["Yes", "No"]}
                            value={answers.timeloss}
                            compact={true}
                            onValueChange={(value) => {
                                updateAnswer("timeloss", value);
                                setTimeLoss(value === "Yes");
                            }}
                        />
                    </View>
                )}

                {answers.consulted === "Yes" && answers.timeloss === "Yes" && (
                    <View>
                        <Text style={styles.compactQuestionText}>
                            What activities were you advised to avoid?
                        </Text>
                        <MultiChoice
                            options={["Competing Only", "Training & Competing"]}
                            value={answers.missed_activity}
                            compact={true}
                            onValueChange={(value) =>
                                updateAnswer("missed_activity", value)
                            }
                        />
                    </View>
                )}
            </View>
        ),
        validate: (answers) => {
            if (answers.consulted === null) return false;
            if (answers.consulted === "Yes" && answers.timeloss === null)
                return false;
            if (
                answers.consulted === "Yes" &&
                answers.timeloss === "Yes" &&
                answers.missed_activity === null
            )
                return false;
            return true;
        },
        condition: () => answers.injured === "Yes" || answers.ill === "Yes"
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
        validate: (answers) => answers.timeloss !== null,
        condition: () => (answers.injured === "Yes" || answers.ill === "Yes") && answers.consulted !== "Yes"
    },
    {
        index: 6,
        text: "What activities will you be avoiding?",
        component: (
            <MultiChoice
                options={["Competing Only", "Training & Competing"]}
                value={answers.missed_activity}
                onValueChange={(value) =>
                    updateAnswer("missed_activity", value)
                }
            />
        ),
        validate: (answers) => answers.missed_activity !== null,
        condition: () =>
            (answers.injured === "Yes" || answers.ill === "Yes") && answers.consulted !== "Yes" && answers.timeloss === "Yes"
    },
    {
        index: 7,
        text: "For how long do you expect to be out?",
        component: (
            <MultiChoice
                options={[
                    "3 days",
                    "5 days",
                    "7 days",
                    "14 days",
                    "21 days",
                    "30+ days"
                ]}
                value={answers.expected_outage}
                onValueChange={(value) =>
                    updateAnswer("expected_outage", value)
                }
            />
        ),
        validate: (answers) => answers.expected_outage !== null,
        condition: () => (answers.injured === "Yes" || answers.ill === "Yes") && answers.timeloss === "Yes"
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
                    maxLength={255}
                    onChangeText={(text) => updateAnswer("comments", text)}
                    textAlignVertical="top"
                />
            </View>
        ),
        validate: () => true
    }
];

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: "row",
        width: "100%",
        marginBottom: 50
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
        fontFamily: "Rubik"
    },
    commentBoxContainer: {
        width: "100%",
        paddingHorizontal: 20,
        marginHorizontal: 10
    },
    commentBox: {
        width: "100%",
        borderRadius: 15,
        height: 250,
        borderWidth: 1,
        borderColor: "#cccccc",
        padding: 15,
        backgroundColor: "#eeeeee"
    }
})