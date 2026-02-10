import { StyleSheet, Text, View } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ReportFinish({ route }) {
    const {restriction, expected_outage, consulted} = route.params;
    const navigation = useNavigation();

    return (
        <SafeAreaView style={[globalStyles.container, {backgroundColor:"#ffffff"}]}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.thankYouText}>Report submitted!</Text>
                    <View style={styles.dividerContainer}>
                        <View style={styles.line} />
                        <MaterialCommunityIcons name="checkbox-marked-circle-auto-outline" size={102} color={"#001a79"} style={{ marginBottom: 20, marginHorizontal: 10 }}/>
                        <View style={styles.line} />
                    </View>
                    <Text style={[styles.thankYouText, {fontSize: 18}]}>Thank you for your submission</Text>
                    <View style={styles.advisoryContainer}>
                        {restriction === "Training & Competing" ? (
                            <>
                                <Text style={styles.advisoryText}>Based on your responses, it is recommended you refrain from any physical activity for the next </Text>
                                <Text style={[styles.advisoryText, {color: "red", fontWeight: "bold", fontSize: 22}]}>{expected_outage}.</Text>
                                <Text style={styles.advisoryText}>Please take care to rest as much as possible.
                                    {consulted === "No" && 
                                        <Text style={styles.advisoryText}> You should visit a healthcare professional to acquire a proper estimation of recovery time.</Text>
                                    } You will be asked to check-in your health status on the expected recovery date.</Text>
                            </>
                        ) : restriction === "Competing Only" ? (
                            <>
                                <Text style={styles.advisoryText}>Based on your responses, you are cleared to continue training, but you should consider avoiding competition for at least</Text>
                                <Text style={[styles.advisoryText, {color: "#e7ae04", fontWeight: "bold", fontSize: 22}]}>{expected_outage}.</Text>
                                <Text style={styles.advisoryText}>Please take care to not overexert yourself during training, and keep an eye on your injuries so as to avoid worsening them.</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.advisoryText}>Based on your responses, you are cleared to resume your training and competing as normal!</Text>
                                <Text style={styles.advisoryText}>Do continue to remain vigilant, you will be notified to submit another report after your next event.</Text>
                                <Text style={[styles.advisoryText, {color: "#1dd545", fontWeight: "bold", fontSize: 22}]}>Good luck!</Text>
                            </>
                        )}
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button                         
                        title="Return to Dashboard"
                        titleStyle={{ fontFamily: "Rubik", color: "#ffffffff" }}
                        buttonStyle={styles.dashboardButton}
                        containerStyle={{ width: "90%" }}
                        onPress={() => navigation.navigate("AthleteMain")} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        paddingBottom: 30,
        paddingTop: 20
    },
    thankYouText: {
        fontFamily: "Rubik",
        fontSize: 32,
        fontWeight: "bold",
        marginHorizontal: 10,
        marginBottom: 10,
        color: "#001a79",
        textAlign: "center"
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        width: "80%"
    },
    line: {
        flex: 1,
        height: 2,
        backgroundColor: '#001a79'
    },
    advisoryContainer: {
        marginHorizontal: 20,
    },
    advisoryText: {
        fontSize: 16,
        fontFamily: "Rubik",
        marginTop: 15,
        textAlign: "center"
    },
    dashboardButton: {
        padding: 15,
        backgroundColor: "#001a79",
        borderRadius: 30,
    }
})