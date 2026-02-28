import MultiChoice from "../../components/MultiChoice";
import RpeSlider from "../../components/RPESlider";
import { View, Text, TextInput, StyleSheet } from "react-native";

export const getFollowUpQuestions = (
  updateAnswer,
  answers,
  recoveryDate,
  setRecovering,
  setImproving
) => [
  {
    index: 0,
    text: "How is your recovery progressing?",
    component: (
      <MultiChoice
        options={["Improving", "Same", "Worsening"]}
        value={answers.recovery_progress}
        onValueChange={(value) => {
          updateAnswer("recovery_progress", value);
          setImproving && setImproving(value === "Improving");
        }}
      />
    ),
    validate: (answers) => answers.recovery_progress !== null
  },

  {
    index: 1,
    text: "Rate your current pain level.",
    component: (
      <RpeSlider
        value={answers.rpe}
        onValueChange={(value) => updateAnswer("rpe", value)}
      />
    ),
    validate: () => true
  },

  {
    index: 2,
    text: "Have you been in contact with a healthcare professional about your injury?",
    component: (
      <MultiChoice
        options={["Yes", "No, but I plan to", "No"]}
        value={answers.practitioner_contact}
        onValueChange={(value) => updateAnswer("practitioner_contact", value)}
      />
    ),
    validate: (answers) => answers.practitioner_contact !== null
  },

  // Update availability status
  {
    index: 3,
    text: "What is your current availability?",
    component: (
      <MultiChoice
        options={[
          "Fully available",
          "No competing",
          "No training or competing"
        ]}
        value={answers.availability}
        onValueChange={(value) => updateAnswer("availability", value)}
      />
    ),
    validate: (answers) => answers.availability !== null
  },

  // Expected recovery update (if improving)
  {
    index: 4,
    text: "When do you expect to return to full availability? (Skip if no change in estimation)",
    subtext: recoveryDate ? (
      <Text style={{ fontStyle: "italic" }}>
        Previous estimate:{" "}
        <Text style={{ fontWeight: "bold" }}>{recoveryDate}</Text>
      </Text>
    ) : null,
    component: (
      <MultiChoice
        options={[
          "1 day",
          "3 days",
          "7 days",
          "14 days",
          "21 days",
          "30+ days"
        ]}
        value={answers.expected_return}
        onValueChange={(value) => updateAnswer("expected_return", value)}
      />
    ),
    validate: () => true,
    condition: () => answers.availability !== "Fully available"
  },

  // Additional comments
  {
    index: 5,
    text: "Additional comments or updates",
    subtext: "Optional",
    component: (
      <View style={styles.commentBoxContainer}>
        <TextInput
          style={styles.commentBox}
          placeholder="Share any updates about your recovery..."
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
    backgroundColor: "#eeeeee",
    fontFamily: "Rubik"
  }
});
