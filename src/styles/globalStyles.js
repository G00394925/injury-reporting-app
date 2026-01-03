import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
        marginBottom: 20,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#ffffffff",
    },
    header: {
        flexDirection: "row",
        backgroundColor: "#001a79",
        width: "100%",   
        padding: 25,
        paddingTop: 35,
    },
    header_text: {
        margin: 5,
        marginLeft: 10,
        fontSize: 24,
        fontFamily: "Rubik",
        fontWeight: "bold",
        color: "#ffffffff",
    },
});
