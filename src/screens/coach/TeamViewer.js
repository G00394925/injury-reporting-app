import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api_config";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function TeamViewerScreen({ route }) {
    const { team } = route.params;
    const navigation = useNavigation();
    const { uuid } = useAuth();
    const [athleteItems, setAthleteItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAthletes = async () => {
            try {
                console.log("Fetching athletes for team:", team.team_id);
                const response = await axios.get(
                    `${API_BASE_URL}/api/teams/get_athletes/${team.team_id}`
                );
                console.log("Response data:", response.data);

                const athletes = response.data.athletes.map((athlete) => {
                    return (
                        <View
                            key={athlete.athlete_id}
                            style={styles.athleteSlot}
                        >
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons
                                    name={
                                        athlete.health_status === "Healthy"
                                            ? "check-circle"
                                            : athlete.health_status === "No competing"
                                            ? "alert-circle"
                                            : "close-circle"
                                    }
                                    size={50}
                                    color={
                                        athlete.health_status === "Healthy"
                                            ? "#10b981"
                                            : athlete.health_status === "No competing"
                                            ? "#f59e0b"
                                            : "#ef4444"
                                    }
                                />
                            </View>
                            <View style={styles.athleteDetailsContainer}>
                                <Text style={styles.athleteNameText}>
                                    {athlete.name}
                                </Text>
                                
                                <Text style={styles.athleteLastReport}>
                                    Last report: 3 days ago
                                </Text>
                            </View>
                        </View>
                    );
                });
                setAthleteItems(athletes);
            } catch (error) {
                console.error("Error fetching athletes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAthletes();
    }, [team.team_id]);

    return (
        <SafeAreaView style={globalStyles.container} edges={["top"]}>
            <View style={globalStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={globalStyles.headerText}>{team.team_name}</Text>
            </View>
            <View style={globalStyles.contentContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#001a79" />
                ) : (
                    <ScrollView>
                        {athleteItems.length > 0 ? (
                            athleteItems
                        ) : (
                            <Text style={styles.noAthletesText}>
                                No athletes in this team yet.
                            </Text>
                        )}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginRight: 10,
        padding: 5
    },
    noAthletesText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        fontFamily: "Rubik",
        color: "#666"
    },
    athleteSlot: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderBottomWidth: 1,
        borderRadius: 0,
        borderColor: "#c4c4c4",
        marginBottom: 0,
        backgroundColor: "#ffffff"
    },
    athleteDetailsContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
    },
    athleteNameText: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Rubik",
        color: "#1f2937"
    },
    athleteStatusText: {
        fontSize: 14,
        fontFamily: "Rubik",
        marginTop: 5,
        color: "#555"
    },
    athleteLastReport: {
        fontSize: 16,
        fontFamily: "Rubik",
        alignSelf: "flex-end",
        color: "#6e6e6e"

    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center"
    }
});
