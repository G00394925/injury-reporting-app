import { StyleSheet } from "react-native";

// Global styles to be used across most screens defining overall
// app appearance such as container styles, header styles, modal
// views, etc.
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001a79"
  },
  contentContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    padding: 20,
    marginTop: -8,
    marginBottom: -10
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#001a79",
    width: "100%",
    padding: 25,
    paddingTop: 10
  },
  headerText: {
    margin: 5,
    marginLeft: 10,
    fontSize: 24,
    fontFamily: "Rubik",
    fontWeight: "bold",
    color: "#ffffffff"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Rubik",
    color: "#333"
  },
  modalBody: {
    padding: 20
  },
  modalInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Rubik",
    color: "#333",
    marginBottom: 8,
    marginTop: 10
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "Rubik",
    backgroundColor: "#f9f9f9",
    justifyContent: "center"
  },
  modalInputText: {
    fontSize: 16,
    fontFamily: "Rubik",
    color: "#333"
  },
  modalLabel: {
    fontFamily: "Rubik",
    fontSize: 16,
    color: "#333"
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0"
  },
});
