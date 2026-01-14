import { StyleSheet, Text, View, Image } from "react-native";
import { Button, Card } from "@rneui/themed";
import { useEffect, useState } from "react";
import { CardTitle } from "@rneui/base/dist/Card/Card.Title";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../../config/api_config";

export default function AthleteDashScreen() {
    // Name to appear on welcome text
    const { uuid, userData } = useAuth();
    const [healthStatus, setHealthStatus] = useState(null);
    const navigation = useNavigation();

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
        <View style={styles.container}>
            <Text style={styles.greetings_text}>Hello {userData?.name}</Text>
            <View style={styles.center_view}>
                <Card containerStyle={styles.lights_card}>
                    <CardTitle
                        style={{
                            fontSize: 16,
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
                            { backgroundColor: "#f199f2ff" },
                        ]}
                    >
                        <CardTitle style={{ fontSize: 24, textAlign: "left" }}>6</CardTitle>
                        <Text>Injuries Reported</Text>
                    </Card>
                    <Card
                        containerStyle={[
                            styles.info_card,
                            { backgroundColor: "#f59c9cff" },
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
                            { backgroundColor: "#91ec78ff" },
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
                            { backgroundColor: "#eff086ff" },
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
                    containerStyle={{ width: "75%" }}
                    titleStyle={{ color: "#575757ff", fontWeight: "bold" }}
                    onPress={() => navigation.navigate("Report")}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        margin: 15,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    greetings_text: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        alignSelf: "flex-start",
        fontSize: 20,
        fontWeight: "bold",
        paddingLeft: 10,
        marginBottom: 20,
        fontFamily: "Rubik",
    },
    center_view: {
        flex: 1,
        alignItems: "center",
    },
    lights_card: {
        padding: 15,
        paddingTop: 5,
        backgroundColor: "#424242ff",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    lights_container: {
        flexDirection: "row",
        backgroundColor: "#333333ff",
        borderRadius: 10,
    },
    light: {
        margin: 10,
    },
    info_cards_container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 5,
        margin: 15,
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
        justifyContent: "center",
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
