import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function MultiChoice({ options, value, onValueChange, compact = false }) {
  
  return (
    <View style={[styles.optionContainer, compact && styles.optionContainerCompact]}>
      {options.map((option, index) => (
        <TouchableOpacity
          style={[
            styles.optionButton,
            compact && styles.optionButtonCompact,
            value === option && styles.optionActive
          ]}
          key={index}
          onPress={() => onValueChange(option)}
        >
          <Text
            style={[
              styles.optionText,
              compact && styles.optionTextCompact,
              value === option && styles.optionTextActive
            ]}
          >
            {option}
          </Text>
          {!compact &&
            (value === option ? (
              <MaterialIcons name="check-circle" size={28} color="#ffffff" />
            ) : (
              <View style={styles.placeholder} />
            ))}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 15
  },
  optionContainerCompact: {
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  optionButton: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 45,
    backgroundColor: "#ffffff",
    borderColor: "#0000006c",
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  optionButtonCompact: {
    paddingVertical: 25,
    justifyContent: "center",
    borderRadius: 45,
    flex: 1
  },
  optionActive: {
    borderColor: "#ffffffff",
    borderWidth: 2,
    backgroundColor: "#1d65ecff"
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Rubik"
  },
  optionTextCompact: {
    fontSize: 18,
    textAlign: "center"
  },
  optionTextActive: {
    color: "#ffffff"
  },
  placeholder: {
    width: 28,
    height: 28
  }
});
