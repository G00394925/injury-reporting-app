import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function MultiChoice({ options }) {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <View style={styles.optionContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === option ? styles.optionActive : null,
          ]}
          key={index}
          onPress={() => setSelectedOption(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOption === option ? styles.optionTextActive : null,
            ]}
          >
            {option}
          </Text>
          {selectedOption === option && (
            <MaterialIcons name="check-circle" size={24} color="#ffffff" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    flex: 1,
  },
  optionButton: {
    width: "90%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    borderColor: "#0000006c",
    justifyContent: "space-between",
    flexDirection: "row",
    borderWidth: 1,
  },
  optionActive: {
    borderColor: "#ffffffff",
    borderWidth: 2,
    backgroundColor: "#1d65ecff",
  },
  optionText: {
    fontSize: 18,
    marginLeft: 5,
    fontWeight: "bold",
  },
  optionTextActive: {
    color: "#ffffffff",
  },
});
