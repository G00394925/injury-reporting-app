import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import { Button, Card } from "@rneui/themed";
import { useCallback, useState } from "react";
import { CardTitle } from "@rneui/base/dist/Card/Card.Title";
import { useAuth } from "../../context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../../config/api_config";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../styles/globalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AthleteDashScreen() {
    const { uuid, userData } = useAuth();
    const [healthStatus, setHealthStatus] = useState(null);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [numReports, setNumReports] = useState(0);
    const [injuryDate, setInjuryDate] = useState(null);
    const [estimatedRecoveryDate, setEstimatedRecoveryDate] = useState(null);
    const [hasRecentEvent, setHasRecentEvent] = useState(false);
    const [daysSinceInjury, setDaysSinceInjury] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                if (!uuid) return;

                try {
                    // Fetch health status
                    const dataResponse = await axios.get(`${API_BASE_URL}/api/health/status/${uuid}`);
                    setHealthStatus(dataResponse.data.health_status);
                    setNumReports(dataResponse.data.num_reports);
                    setInjuryDate(dataResponse.data.injury_date);
                    setEstimatedRecoveryDate(dataResponse.data.estimated_recovery_date);

                    // Fetch events and check if any have passed
                    const eventsResponse = await axios.get(`${API_BASE_URL}/api/events/get/${uuid}`);
                    if (eventsResponse.data && eventsResponse.data.length > 0) {
                        const now = new Date();
                        const hasPastEvent = eventsResponse.data.some(event => {
                            const eventDateTime = new Date(`${event.event_date}T${event.end_time}`);
                            return eventDateTime < now;
                        });
                        setHasRecentEvent(hasPastEvent);
                    }

                    // Calculate days since injury
                    if (injuryDate) {
                        const injuryDateObj = new Date(injuryDate);
                        const today = new Date();
                        const diffTime = Math.abs(today - injuryDateObj);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        setDaysSinceInjury(diffDays);
                    }

                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [uuid])
    );

    return (
        <SafeAreaView style={globalStyles.container} edges={["top"]}>
            {loading ? (
                <ActivityIndicator size="large" color="#001a79" />
            ) : (
                <>
                    <View style={globalStyles.header}>
                        <Text style={globalStyles.headerText}>Hello {userData?.name}</Text>
                    </View>
                    <View style={globalStyles.contentContainer}>
                        <Card containerStyle={styles.lightsCard}>

                            <View style={styles.lightsContainer}>
                                <Image
                                    style={styles.light}
                                    source={healthStatus === "No training or competing" ? require("../../../assets/RedLightOn.png") : require("../../../assets/RedLightOff.png")}
                                />
                                <Image
                                    style={styles.light}
                                    source={healthStatus === "No competing" ? require("../../../assets/AmberLightOn.png") : require("../../../assets/AmberLightOff.png")}
                                />
                                <Image
                                    style={styles.light}
                                    source={healthStatus === "Healthy" ? require("../../../assets/GreenLightOn.png") : require("../../../assets/GreenLightOff.png")}
                                />
                            </View>
                        </Card>

                        <View style={[
                            styles.noticeCard,
                            healthStatus === "Healthy" 
                                ? styles.noticeCardGreen 
                                : healthStatus === "No competing" 
                                    ? styles.noticeCardAmber 
                                    : styles.noticeCardRed
                        ]}>
                            <View style={styles.noticeIconContainer}>
                                <MaterialCommunityIcons 
                                    name={
                                        healthStatus === "Healthy" 
                                            ? "check-circle" 
                                            : healthStatus === "No competing" 
                                                ? "alert-circle" 
                                                : "close-circle"
                                    }
                                    size={40}
                                    color={
                                        healthStatus === "Healthy" 
                                            ? "#10b981" 
                                            : healthStatus === "No competing" 
                                                ? "#f59e0b" 
                                                : "#ef4444"
                                    }
                                />
                            </View>
                            <View style={styles.noticeTextContainer}>
                                <Text style={styles.noticeLabel}>Status</Text>
                                <Text style={styles.noticeTitle}>{
                                    healthStatus === "No training or competing" ? "Not training or competing"
                                        : healthStatus === "No competing"
                                            ? "Training only"
                                            : "Ready to play"}
                                </Text>
                                <Text style={styles.noticeSubtext}>{
                                    healthStatus === "No training or competing" ? "Rest and recovery needed"
                                        : healthStatus === "No competing"
                                            ? "Cleared for training activities"
                                            : "Fully cleared for all activities"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoCardsContainer}>
                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons 
                                    name="file-document-multiple" 
                                    size={32} 
                                    color="#6366f1" 
                                    style={styles.cardIcon}
                                />
                                <Text style={styles.cardValue}>{numReports}</Text>
                                <Text style={styles.cardLabel}>Total Reports</Text>
                            </View>

                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons 
                                    name="calendar-check" 
                                    size={32} 
                                    color="#10b981" 
                                    style={styles.cardIcon}
                                />
                                <Text style={styles.cardValue}>{daysSinceInjury}</Text>
                                <Text style={styles.cardLabel}>Days Since Last Injury</Text>
                            </View>

                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons 
                                    name="fire" 
                                    size={32} 
                                    color="#f59e0b" 
                                    style={styles.cardIcon}
                                />
                                <Text style={styles.cardValue}>15</Text>
                                <Text style={styles.cardLabel}>Consecutive Submissions</Text>
                            </View>
                        </View>
                        {hasRecentEvent && (
                            <View style={styles.reportButtonContainer}>
                                <Button
                                    title="Submit Report"
                                    buttonStyle={styles.reportButton}
                                    containerStyle={{ width: "100%" }}
                                    titleStyle={styles.reportButtonText}
                                    onPress={() => navigation.navigate("Report")}
                                    icon={
                                        <MaterialCommunityIcons 
                                            name="clipboard-text" 
                                            size={20} 
                                            color="#ffffff" 
                                            style={{ marginRight: 8 }}
                                        />
                                    }
                                />
                            </View>
                        )}
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    noticeCard: {
        padding: 20,
        backgroundColor: "#ffffff",
        borderRadius: 15,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 5,
    },
    noticeCardGreen: {
        borderLeftColor: "#10b981",
        backgroundColor: "#f0fdf4",
    },
    noticeCardAmber: {
        borderLeftColor: "#f59e0b",
        backgroundColor: "#fffbeb",
    },
    noticeCardRed: {
        borderLeftColor: "#ef4444",
        backgroundColor: "#fef2f2",
    },
    noticeIconContainer: {
        marginRight: 15,
    },
    noticeTextContainer: {
        flex: 1,
    },
    noticeLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        fontFamily: "Rubik",
        marginBottom: 4,
    },
    noticeTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
        fontFamily: "Rubik",
        marginBottom: 4,
    },
    noticeSubtext: {
        fontSize: 14,
        color: "#6b7280",
        fontFamily: "Rubik",
    },
    lightsCard: {
        padding: 5,
        backgroundColor: "rgb(59, 59, 59)",
        borderRadius: 90,
        margin: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    lightsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        borderRadius: 10,
        gap: 25
    },
    light: {
        marginVertical: 10,
        width: 70,
        height: 70
    },
    infoCardsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 25,
        gap: 12,
    },
    infoCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 15,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f3f4f6",
    },
    cardIcon: {
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1f2937",
        fontFamily: "Rubik",
        marginBottom: 4,
    },
    cardLabel: {
        fontSize: 12,
        color: "#6b7280",
        fontFamily: "Rubik",
        textAlign: "center",
        lineHeight: 16,
    },
    reportButtonContainer: {
        marginTop: 25,
        width: "100%",
    },
    reportButton: {
        backgroundColor: "#6366f1",
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: "#6366f1",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    reportButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "Rubik",
    },
});
