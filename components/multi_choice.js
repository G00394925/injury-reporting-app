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
          {selectedOption === option ? (
            <MaterialIcons name="check-circle" size={28} color="#ffffff" />
          ) : (
            <View style={styles.placeholder} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 15,
  },
  optionButton: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginVertical: 10,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    borderColor: "#0000006c",
    borderWidth: 2,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: "#333",
  },
  optionTextActive: {
    color: "#ffffffff",
  },
  placeholder: {
    width: 28,
    height: 28,
  },
});
