import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        margin: 15,
        marginBottom: 20,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#00000063",
        paddingBottom: 10,
        width: "100%"
    },
    header_text: {
        margin: 5,
        marginLeft: 10,
        fontSize: 24,
        fontFamily: "Rubik",
        fontWeight: "bold"
    },
});
