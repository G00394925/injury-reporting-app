import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator} from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarContainer, CalendarHeader, CalendarBody } from "@howljs/calendar-kit";
import calendarTheme from "../../styles/calendar_theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../config/api_config";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

export default function CoachDashScreen() {
    const {uuid, userData } = useAuth(); 
    const [healthy, setHealthy] = useState(0);
    const [atRisk, setAtRisk] = useState(0);
    const [injured, setInjured] = useState(0);
    const [reportsSubmitted, setReportsSubmitted] = useState(0);
    const [athletesNotReported, setAthletesNotReported] = useState(0);
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    // Acquire team id
                    const teamResponse = await axios.get(`${API_BASE_URL}/api/teams/coach_teams/${uuid}`)
                    if (teamResponse && teamResponse.data) {

                        // Acquire athlete data for team.
                        try {
                            const athletesResponse = await axios.get(`${API_BASE_URL}/api/teams/get_athletes/${teamResponse.data.teams[0].team_id}`);
                            if (athletesResponse && athletesResponse.data) {
                                setHealthy(athletesResponse.data.healthy_athletes);
                                setAtRisk(athletesResponse.data.at_risk_athletes);
                                setInjured(athletesResponse.data.injured_athletes);
                                setAthletesNotReported(athletesResponse.data.reports_due);
                                setReportsSubmitted(athletesResponse.data.num_athletes - athletesResponse.data.reports_due);
                            } else {
                                console.log("No athlete data received")
                            }
                        } catch (error) {
                            console.error("Error fetching athlete data for team:", error);
                        }
                    }
                }
                catch (error) {
                    console.error("Error fetching team data:", error);
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        }, [uuid])
    )

    return (
        <SafeAreaView style={globalStyles.container} edges={["top"]}>
            <View style={globalStyles.header}>
                <Text style={[globalStyles.headerText, {alignContent: "flex-start"}]}>Hello Macdarach</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <>
                    <ScrollView style={globalStyles.contentContainer}>
                        <TouchableOpacity style={styles.noticeCard}>
                            <View style={styles.noticeIconContainer}>
                                <MaterialIcons name="warning-amber" size={40} color="#e9a803" />
                            </View>
                            <View style={styles.noticeTextContainer}>
                                <Text style={styles.noticeLabel}>Alert</Text>
                                <Text style={styles.noticeTitle}>Athletes require your attention</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.infoCardsContainer}>
                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons name="check-circle" size={28} color="#10b981" style={styles.cardIcon} />
                                <Text style={styles.cardValue}>{healthy}</Text>
                                <Text style={styles.cardLabel}>Healthy</Text>
                            </View>
                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons name="alert-circle" size={28} color="#f59e0b" style={styles.cardIcon} />
                                <Text style={styles.cardValue}>{atRisk}</Text>
                                <Text style={styles.cardLabel}>At Risk</Text>
                            </View>
                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons name="close-circle" size={28} color="#ef4444" style={styles.cardIcon} />
                                <Text style={styles.cardValue}>{injured}</Text>
                                <Text style={styles.cardLabel}>Injured</Text>
                            </View>
                        </View>
                        <View style={styles.infoCardsContainer}>
                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons name="calendar-check" size={28} color="#3b82f6" style={styles.cardIcon} />
                                <Text style={styles.cardValue}>{reportsSubmitted}</Text>
                                <Text style={styles.cardLabel}>Reports Submitted Today</Text>
                            </View>
                            <View style={styles.infoCard}>
                                <MaterialCommunityIcons name="information-outline" size={28} color="#8b5cf6" style={styles.cardIcon} />
                                <Text style={styles.cardValue}>{athletesNotReported}</Text>
                                <Text style={styles.cardLabel}>Athletes Not Reported Today</Text>
                            </View>
                        </View>
                        <View style={styles.scheduleContainer}>
                            <Text style={{fontFamily: "Rubik", fontSize: 18, fontWeight: "bold"}}>
                                Team Schedule
                            </Text>
                            <View style={styles.calendarView}>
                                <CalendarContainer 
                                    theme={calendarTheme}
                                    numberOfDays={3} 
                                    hourWidth={50} 
                                    timeInterval={30} 
                                    start={540} 
                                    end={1320}
                                    initialTimeIntervalHeight={60}
                                    allowPinchToZoom={true}
                                    scrollByDay
                                    >
                                    <CalendarHeader />
                                    <CalendarBody />
                                </CalendarContainer>    
                            </View>    
                        </View>
                    </ScrollView>
                </>   
            )}
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
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
        padding: 14,
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
    noticeCard: {
        padding: 20,
        backgroundColor: "#fef3de",
        borderRadius: 15,
        borderLeftWidth: 5,
        borderColor: "#e9a803",
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
       noticeIconContainer: {
        marginRight: 15,
        alignItems: "center",
        justifyContent: "center",
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
    scheduleContainer: {
        flex: 1,
        marginTop: 30
    },
    calendarView: {
        height: 300,
        marginTop: 10,
        justifyContent: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ccccccff",
        borderRadius: 10,
        marginBottom: 50
    }
});