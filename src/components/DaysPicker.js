import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function DaysPicker({ value, onValueChange }) {
  const [modalVisible, setModalVisible] = useState(false);

  const options = [
    ...Array.from({ length: 30 }, (_, i) => ({
      label: `${i + 1} day${i + 1 > 1 ? 's' : ''}`,
      value: String(i + 1)
    })),
    { label: "30+ days", value: "30+" }
  ];

  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
    setModalVisible(false);
  };

  const displayValue = value
    ? options.find(opt => opt.value === value)?.label || "Select days..."
    : "Select days...";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {displayValue}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={28} color="#333" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Days</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: 75}}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    value === option.value && styles.optionActive
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option.value && styles.optionTextActive
                    ]}
                  >
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color="#ffffff"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20
  },
  selector: {
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
  selectorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Rubik"
  },
  placeholder: {
    color: "#999",
    fontWeight: "normal"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: "70%",
    paddingBottom: 20
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee"
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Rubik",
    color: "#333"
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 10,
		paddingBottom: 100
  },
  option: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  optionActive: {
    backgroundColor: "#001a79"
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    fontFamily: "Rubik"
  },
  optionTextActive: {
    color: "#ffffff",
    fontWeight: "bold"
  }
});
