import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api_config";


export default function TeamViewerScreen({ route }) {
    const { team } = route.params;
    const navigation = useNavigation();
    const {uuid} = useAuth();
    const [athleteItems, setAthleteItems] = useState([]);

    useEffect(() => {
        const fetchAthletes = async () => {
            try {
                console.log("Fetching athletes for team:", team.team_id);
                const response = await axios.get(`${API_BASE_URL}/api/team/get-athletes/${team.team_id}`);
                console.log("Response data:", response.data);
                
                const athletes = response.data.athletes.map((athlete) => {
                    return (
                        <View
                            key={athlete.athlete_id}
                            style={[
                                styles.athlete_slot, 
                                {borderColor: 
                                    athlete.health_status === "Injured" ? "#ff4d4d" : 
                                    athlete.health_status === "Recovering" ? "#ffb84d" : 
                                    "#66cc66"
                                }
                            ]} 
                        >
                            <Text style={styles.athlete_name_text}>{athlete.name}</Text>
                            {athlete.health_status === "Injured" && (
                                <Image
                                    style={styles.light}
                                    source={require("../../../assets/RedLightOn.png")}
                                />
                            )}
                            {athlete.health_status === "Recovering" && (
                                <Image
                                    style={styles.light}
                                    source={require("../../../assets/AmberLightOn.png")}
                                />
                            )}
                            {athlete.health_status === "Healthy" && (
                                <Image
                                    style={styles.light}
                                    source={require("../../../assets/GreenLightOn.png")}
                                />
                            )}
                        </View>
                    )
                })
                setAthleteItems(athletes);
            } catch (error) {
                console.error("Error fetching athletes:", error);
            }
        }
        fetchAthletes();
    }, [team.team_id]);

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.header_text}>{team.team_name}</Text>
            </View>
            <View style={styles.content_container}>
                {athleteItems}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#001a79",
    },
    content_container: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        padding: 20,
        marginTop: -8,
        marginBottom: -10
    },
    athlete_slot: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15, 
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: "#ebebebff"
    },
    athlete_name_text: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Rubik",
    },
    athlete_status_text: {
        fontSize: 14,
        fontFamily: "Rubik",
        marginTop: 5,
        color: "#555",
    },
    light: {
        width: 40,
        height: 40
    }
})