import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { Button, Card } from "@rneui/themed";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../../config/api_config";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../styles/globalStyles";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

export default function AthleteDashScreen() {
    const { uuid, userData } = useAuth();
    const [healthStatus, setHealthStatus] = useState(null);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [numReports, setNumReports] = useState(0);
    const [consecutiveReports, setConsecutiveReports] = useState(0);
    const [injuryDate, setInjuryDate] = useState(null);
    const [estimatedRecoveryDate, setEstimatedRecoveryDate] = useState(null);
    const [hasRecentEvent, setHasRecentEvent] = useState(false);
    const [futureEvents, setFutureEvents] = useState(0);
    const [nextEventTitle, setNextEventTitle] = useState("No Upcoming Events");
    const [nextEventDate, setNextEventDate] = useState(null);
    const [nextEventTime, setNextEventTime] = useState(null);
    const [reportDue, setReportDue] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                if (!uuid) return;

                try {
                    // Fetch health status
                    const statusResponse = await axios.get(
                        `${API_BASE_URL}/api/health/status/${uuid}`
                    );
                    if (statusResponse) {
                        setHealthStatus(statusResponse.data.health_status);
                        setInjuryDate(statusResponse.data.injury_date);
                        setEstimatedRecoveryDate(
                            statusResponse.data.estimated_recovery_date
                        );
                        setConsecutiveReports(
                            statusResponse.data.report_streak
                        );
                        setNumReports(statusResponse.data.reports_count);
                        console.log("Fetched injury data successfully.");
                    }

                    // Fetch events and check if any have passed
                    const eventsResponse = await axios.get(
                        `${API_BASE_URL}/api/events/get/${uuid}`
                    );
                    if (eventsResponse.data && eventsResponse.data.length > 0) {
                        const now = new Date();
                        const hasPastEvent = eventsResponse.data.some(
                            (event) => {
                                const eventDateTime = new Date(
                                    `${event.event_date}T${event.end_time}`
                                );
                                return eventDateTime < now;
                            }
                        );
                        setHasRecentEvent(hasPastEvent);
                    }

                    const nextEventResponse = await axios.get(
                        `${API_BASE_URL}/api/events/get_next/${uuid}`
                    );
                    if (nextEventResponse.data) {
                        setFutureEvents(
                            nextEventResponse.data["total_future_events"]
                        );
                        setNextEventTitle(nextEventResponse.data["title"]);
                        setNextEventDate(nextEventResponse.data["date"]);
                        setNextEventTime(nextEventResponse.data["time"]);
                    } else {
                        console.log(`No upcoming events for user ${uuid}`);
                    }

                    // Check if a new report is due, thereby enabling the report button if true.
                    try {
                        console.log("Checking if report is due...");
                        const reportDueResponse = await axios.get(
                            `${API_BASE_URL}/api/health/check_due/${uuid}`
                        );
                        console.log("Report due:", reportDueResponse.data);
                        setReportDue(reportDueResponse.data);
                    } catch (reportError) {
                        console.error(
                            "Error fetching report due status:",
                            reportError
                        );
                        setReportDue(false); // Default to false if request fails
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
                <ActivityIndicator size="large" color="#ffffff" />
            ) : (
                <>
                    <View style={globalStyles.header}>
                        <Text style={globalStyles.headerText}>
                            Hello {userData?.name}
                        </Text>
                    </View>
                    <ScrollView
                        style={globalStyles.contentContainer}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >
                        {/* Traffic light status indicators */}
                        <Card containerStyle={styles.lightsCard}>
                            <View style={styles.lightsContainer}>
                                <Image
                                    style={styles.light}
                                    source={
                                        healthStatus ===
                                        "No training or competing"
                                            ? require("../../../assets/RedLightOn.png")
                                            : require("../../../assets/RedLightOff.png")
                                    }
                                />
                                <Image
                                    style={styles.light}
                                    source={
                                        healthStatus === "No competing"
                                            ? require("../../../assets/AmberLightOn.png")
                                            : require("../../../assets/AmberLightOff.png")
                                    }
                                />
                                <Image
                                    style={styles.light}
                                    source={
                                        healthStatus === "Healthy"
                                            ? require("../../../assets/GreenLightOn.png")
                                            : require("../../../assets/GreenLightOff.png")
                                    }
                                />
                            </View>
                        </Card>

                        {/* Report Submission button */}
                        {reportDue && (
                            <TouchableOpacity
                                style={styles.reportCard}
                                onPress={() => {
                                    navigation.navigate("Report", {
                                        healthStatus: healthStatus,
                                        recoveryDate: estimatedRecoveryDate
                                    });
                                }}
                            >
                                <View style={styles.noticeIconContainer}>
                                    <MaterialIcons
                                        name="warning-amber"
                                        size={40}
                                        color="#000"
                                    />
                                </View>
                                <View style={styles.noticeTextContainer}>
                                    <Text style={styles.noticeTitle}>
                                        Your daily report is due!
                                    </Text>
                                    <Text style={styles.noticeSubtext}>
                                        Tap to submit your report
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={24}
                                    color="#0000006c"
                                />
                            </TouchableOpacity>
                        )}

                        {/* Notice card */}
                        <View
                            style={[
                                styles.noticeCard,
                                healthStatus === "Healthy"
                                    ? styles.noticeCardGreen
                                    : healthStatus === "No competing"
                                      ? styles.noticeCardAmber
                                      : styles.noticeCardRed
                            ]}
                        >
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
                                <Text style={styles.noticeTitle}>
                                    {healthStatus === "No training or competing"
                                        ? "No training or competing"
                                        : healthStatus === "No competing"
                                          ? "Training only"
                                          : "Ready to play"}
                                </Text>
                                <Text style={styles.noticeSubtext}>
                                    {healthStatus === "No training or competing"
                                        ? "Rest and recovery needed"
                                        : healthStatus === "No competing"
                                          ? "Cleared for training activities"
                                          : "Fully cleared for all activities"}
                                </Text>
                            </View>
                        </View>

                        {/* Information/Status cards */}
                        <View style={styles.infoCardsContainer}>
                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons
                                    name="file-document-multiple"
                                    size={32}
                                    color="#6366f1"
                                    style={styles.cardIcon}
                                />
                                <Text style={styles.cardValue}>
                                    {numReports}
                                </Text>
                                <Text style={styles.cardLabel}>
                                    Total Reports
                                </Text>
                            </View>

                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons
                                    name="calendar-check"
                                    size={32}
                                    color="#10b981"
                                    style={styles.cardIcon}
                                />
                                <Text style={styles.cardValue}>
                                    {futureEvents}
                                </Text>
                                <Text style={styles.cardLabel}>
                                    Planned Events
                                </Text>
                            </View>

                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons
                                    name="fire"
                                    size={32}
                                    color="#f59e0b"
                                    style={styles.cardIcon}
                                />
                                <Text style={styles.cardValue}>
                                    {consecutiveReports}
                                </Text>
                                <Text style={styles.cardLabel}>
                                    Consecutive Submitted Reports
                                </Text>
                            </View>
                        </View>

                        {/* Next Event Card */}
                        <TouchableOpacity
                            style={styles.eventCard}
                            onPress={() => {
                                navigation.navigate("Schedule");
                            }}
                        >
                            <View style={styles.noticeIconContainer}>
                                <MaterialIcons
                                    name="sports-soccer"
                                    size={40}
                                    color="#1963ca"
                                />
                            </View>
                            <View style={styles.noticeTextContainer}>
                                <Text style={styles.noticeLabel}>
                                    Next Event
                                </Text>
                                <Text style={styles.noticeTitle}>
                                    {nextEventTitle}
                                </Text>
                                {nextEventDate && nextEventTime && (
                                    <Text style={styles.noticeSubtext}>
                                        {nextEventDate} - {nextEventTime}
                                    </Text>
                                )}
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={24}
                                color="#0000006c"
                            />
                        </TouchableOpacity>

                        {/* DEBUG */}
                        <Button
                            onPress={() => {
                                navigation.navigate("Report", {
                                    healthStatus: healthStatus,
                                    recoveryDate: estimatedRecoveryDate
                                });
                            }}
                        />
                    </ScrollView>
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
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 5
    },
    noticeCardGreen: {
        borderLeftColor: "#10b981",
        backgroundColor: "#f0fdf4"
    },
    noticeCardAmber: {
        borderLeftColor: "#f59e0b",
        backgroundColor: "#fffbeb"
    },
    noticeCardRed: {
        borderLeftColor: "#ef4444",
        backgroundColor: "#fef2f2"
    },
    noticeIconContainer: {
        marginRight: 15,
        alignItems: "center",
        justifyContent: "center"
    },
    noticeTextContainer: {
        flex: 1
    },
    noticeLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        fontFamily: "Rubik",
        marginBottom: 4
    },
    noticeTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
        fontFamily: "Rubik",
        marginBottom: 4
    },
    noticeSubtext: {
        fontSize: 14,
        color: "#6b7280",
        fontFamily: "Rubik"
    },
    eventCard: {
        padding: 20,
        backgroundColor: "#d8e5ff",
        borderRadius: 15,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
    },
    reportCard: {
        padding: 20,
        backgroundColor: "#ffffff",
        borderRadius: 15,
        borderWidth: 3,
        borderColor: "#c5c5c5",
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
    },
    lightsCard: {
        padding: 5,
        backgroundColor: "rgb(59, 59, 59)",
        borderRadius: 90,
        margin: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
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
        gap: 12
    },
    infoCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 15,
        padding: 14,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f3f4f6"
    },
    cardIcon: {
        marginBottom: 8
    },
    cardValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1f2937",
        fontFamily: "Rubik",
        marginBottom: 4
    },
    cardLabel: {
        fontSize: 12,
        color: "#6b7280",
        fontFamily: "Rubik",
        textAlign: "center",
        lineHeight: 16
    },
    reportButtonContainer: {
        marginTop: 25,
        width: "100%"
    },
    reportButton: {
        backgroundColor: "#6366f1",
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: "#6366f1",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6
    },
    reportButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "Rubik"
    }
});
