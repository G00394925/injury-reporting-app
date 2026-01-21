import { StyleSheet, Text, View, Image } from "react-native";
import { Button, Card } from "@rneui/themed";
import { useEffect, useState } from "react";
import { CardTitle } from "@rneui/base/dist/Card/Card.Title";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../../config/api_config";
import { ActivityIndicator } from "react-native-web";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../styles/globalStyles";

export default function AthleteDashScreen() {
    // Name to appear on welcome text
    const { uuid, userData } = useAuth();
    const [healthStatus, setHealthStatus] = useState(null);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealthStatus = async () => {
            // Fetch health status on user uuid change.
            
            if (!uuid) return;

            try {
                const response = await axios.get(`${API_BASE_URL}/api/health-status/${uuid}`);
                setHealthStatus(response.data.health_status);
            } catch (error) {
                console.error("Error fetching health status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHealthStatus();
    }, [uuid]);

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {loading ? (
                <ActivityIndicator size="large" color="#001a79" />
            ) : (
                <>
                    <View style={globalStyles.header}>
                        <Text style={globalStyles.header_text}>Hello {userData?.name}</Text>
                    </View>
                    <View style={globalStyles.content_container}>
                        <Card containerStyle={styles.lights_card}>
                            <CardTitle
                                style={{
                                    fontSize: 18,
                                    textAlign: "left",
                                    color: "#d5d5d5ff",
                                    marginBottom: 5,
                                }}
                            >
                                {healthStatus === "Injured"
                                    ? "Your Status: Injured"
                                    : healthStatus === "Recovering"
                                        ? "Your Status: Recovering"
                                        : "Your Status: Ready to play"}
                            </CardTitle>
                            <View style={styles.lights_container}>
                                <Image
                                    style={styles.light}
                                    source={healthStatus === "Injured" ? require("../../../assets/RedLightOn.png") : require("../../../assets/RedLightOff.png")}
                                />
                                <Image
                                    style={styles.light}
                                    source={healthStatus === "Recovering" ? require("../../../assets/AmberLightOn.png") : require("../../../assets/AmberLightOff.png")}
                                />
                                <Image
                                    style={styles.light}
                                    source={healthStatus === "Healthy" ? require("../../../assets/GreenLightOn.png") : require("../../../assets/GreenLightOff.png")}
                                />
                            </View>
                        </Card>
                        <View style={styles.info_cards_container}>
                            <Card
                                containerStyle={[
                                    styles.info_card,
                                    { backgroundColor: "#6684fd" },
                                ]}
                            >
                                <CardTitle style={{ fontSize: 24, textAlign: "left" }}>6</CardTitle>
                                <Text>Injuries Reported</Text>
                            </Card>
                            <Card
                                containerStyle={[
                                    styles.info_card,
                                    { backgroundColor: "#8bbbff" },
                                ]}
                            >
                                <CardTitle style={{ fontSize: 24, textAlign: "left" }}>
                                    142
                                </CardTitle>
                                <Text>Days since your last injury</Text>
                            </Card>
                            <Card
                                containerStyle={[
                                    styles.info_card,
                                    { backgroundColor: "#8bbbff" },
                                ]}
                            >
                                <CardTitle style={{ fontSize: 24, textAlign: "left" }}>
                                    15
                                </CardTitle>
                                <Text>Consecutive Daily Reports</Text>
                            </Card>
                            <Card
                                containerStyle={[
                                    styles.info_card,
                                    { backgroundColor: "#6684fd" },
                                ]}
                            >
                                <CardTitle style={{ fontSize: 24, textAlign: "left" }}>
                                    95%
                                </CardTitle>
                                <Text>Availability %</Text>
                            </Card>
                        </View>
                        <Button
                            title="Submit Daily Report"
                            buttonStyle={styles.report_button}
                            containerStyle={{ marginTop: 20}}
                            titleStyle={{ color: "#575757ff", fontWeight: "bold" }}
                            onPress={() => navigation.navigate("Report")}
                        />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#001a79",
    },
    lights_card: {
        padding: 15,
        paddingTop: 5,
        backgroundColor: "#424242ff",
        borderRadius: 10,
        margin: 0
    },
    lights_container: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: "#333333ff",
        borderRadius: 10,
    },
    light: {
        marginVertical: 20,
        width: 80,
        height: 80
    },
    info_cards_container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 15,
    },
    info_card: {
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 0,
        width: "48%",
    },
    report_button: {
        marginTop: 20,
        alignContent: "center",
        paddingHorizontal: 40,
        paddingVertical: 20,
        color: "black",
        backgroundColor: "#ffffffff",
        borderRadius: 45,
        borderWidth: 3,
        borderBottomColor: "#00a0ccff",
        borderRightColor: "#00a0ccff",
        borderLeftColor: "#87b5f6ff",
        borderTopColor: "#87c8f6ff",
    },
});
