import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#001a79",
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
        paddingTop: 10,
    },
    headerText: {
        margin: 5,
        marginLeft: 10,
        fontSize: 24,
        fontFamily: "Rubik",
        fontWeight: "bold",
        color: "#ffffffff",
    },
});
