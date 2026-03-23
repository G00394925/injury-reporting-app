import RpeSlider from "../../components/RPESlider";
import MultiChoice from "../../components/MultiChoice";
import BodyMap from "../../components/BodyMap";
import DaysPicker from "../../components/DaysPicker";
import { View, Text, TextInput, StyleSheet } from "react-native";

export const getHealthyQuestions = ( updateAnswer, answers, setInjured, setIll, setConsulted, setTimeLoss, setTrained ) => [
  // List of Questions for report
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

        {(answers.injured === "No" || answers.trained === "No") && (
          <View>
            <Text style={styles.compactQuestionText}>Do you feel ill?</Text>
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

    // Assert that all required questions have been answered before enabling 'Next' button 
    validate: (answers, state) => {
      if (answers.trained === null) return false;
      if (answers.trained === "Yes") {
        if (answers.injured === null) return false;
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

    // Only show this question if the following condition is met
    condition: () => answers.injured === "Yes"
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
    validate: (answers) => answers.injury_location !== null,
    condition: () => answers.injured === "Yes"
  },
  {
    index: 3,
    text: "Can you describe the type of injury?",
    component: (
        <MultiChoice
          options={[
            "Muscle Injury",
            "Nerve Injury",
            "Fracture",
            "Joint Sprain",
            "Abrasion",
            "Laceration",
            "Unknown"
          ]}
          value = {answers.injury_type}
          onValueChange={(value) => {updateAnswer("injury_type", value)}}
        />
    ),
    validate: (answers) => answers.injury_type !== null,
    condition: () => answers.injured === "Yes"
  },
  {
    index: 4,
    text: "Rate your discomfort.",
    subtext: null,
    component: 
    answers.injured === "Yes" ? (
      <RpeSlider
        value={answers.rpe}
        onValueChange={(value) => updateAnswer("rpe", value)}
        title="Rate your current pain level"
        labels={["Very Light / None", "Light", "Moderate", "Intense", "Very Intense"]}
      />
    ) : (
      <RpeSlider
        value={answers.rpe}
        onValueChange={(value) => updateAnswer("rpe", value)}
        title="Describe your illness"
        labels={["Light illness", "Manageable", "Moderate", "Quite ill", "Very ill"]}
      />
    ),
    validate: () => true
  },
  {
    index: 5,
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
              Were you advised to avoid training or competition?
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

        {answers.consulted === "No" && (
            <View>
            <Text style={styles.compactQuestionText}>
                Do you expect to miss any activities?
            </Text>
            <MultiChoice
                compact={true}
                options={["Yes", "No"]}
                value={answers.timeloss}
                onValueChange={(value) => {
                    updateAnswer("timeloss", value);
                    setTimeLoss(value === "Yes");
                }}
            />
            </View>
        )}

        {answers.timeloss === "Yes" && (
          <View>
            <Text style={styles.compactQuestionText}>
              What activities will you be avoiding?
            </Text>
            <MultiChoice
              options={["Competing Only", "Training & Competing"]}
              value={answers.missed_activity}
              compact={true}
              onValueChange={(value) => updateAnswer("missed_activity", value)}
            />
          </View>
        )}
        {answers.timeloss === "Yes" && (
          <View>
            <Text style={styles.compactQuestionText}>
              How long do you expect to be out?
            </Text>
            <DaysPicker
              value={answers.expected_outage}
              onValueChange={(value) => updateAnswer("expected_outage", value)}
            />
          </View>
        )}
      </View>
    ),
    validate: (answers) => {
      if (answers.consulted === null) return false;
      if (answers.consulted && answers.timeloss === null)
        return false;
      if (
        answers.consulted &&
        answers.timeloss === "Yes" &&
        answers.missed_activity === null
      )
        return false;
      if (
        answers.consulted &&
        answers.timeloss === "Yes" &&
        answers.expected_outage === null
      ) 
        return false;  
      return true;
    },
    condition: () => answers.injured === "Yes" || answers.ill === "Yes"
  },
  {
    index: 6,
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
    fontSize: 20,
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
});
