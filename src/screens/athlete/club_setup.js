import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api_config";
import axios from "axios";
import { Button } from "@rneui/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";

export default function ClubSetup() {
    const [selection, setSelection] = useState(null);
    const { uuid } = useAuth();
    const [teams, setTeams] = useState([]);
    const navigation = useNavigation();

    // Acquire list of coaches from database
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/athlete/teams`);
                setTeams(response.data.teams);
            } catch (error) {
                console.error("Error fetching coaches:", error);
            }
        };
        fetchTeams();
    }, []);

    const handleSave = async (team_id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/athlete/join-team`, {
                athlete_id: uuid,
                team_id: team_id,
            });
            console.log("Team joined successfully:", response.data);

            navigation.goBack();
        } catch (error) {
            console.error("Error joining team:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.header_text}>Choose Team</Text>
            </View>
            <View style={styles.contentContainer}>
                {teams.map((team) => (
                    <TouchableOpacity
                        key={team.team_id}
                        style={[styles.team_slot_inactive, selection === team.team_id && styles.team_slot_active]}
                        onPress={() => setSelection(team.team_id)}
                    >
                        <View style={styles.team_header}>
                            <Text style={styles.team_text}>{team.team_name}</Text>
                            <Text style={styles.sport_text}>{team.sport}</Text>
                        </View>
                        <Text style={styles.coach_text}>Coach: {team.coach_name}</Text>
                    </TouchableOpacity>
                ))}
                <View style={styles.controls}>
                    <Button title="Save Selection" onPress={() => handleSave(selection)} />

                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#001a79",
    },
    contentContainer: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        padding: 20,
        marginTop: -8
    },
    team_slot_inactive: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#888888ff",
        borderRadius: 5,
        marginBottom: 15,
        justifyContent: "flex-start"
    },
    team_slot_active: {
        padding: 15,
        borderWidth: 2,
        borderColor: "#001a79",
        borderRadius: 5,
        marginBottom: 15,
        justifyContent: "flex-start"
    },
    team_text: {
        fontSize: 18,
        fontFamily: "Rubik",
        alignSelf: "flex-start",
        verticalAlign: "top",
        fontWeight: "500"
    },
    coach_text: {
        fontSize: 14,
        marginTop: 10,
        fontFamily: "Rubik",
        alignSelf: "flex-start",
        verticalAlign: "bottom"
    },
    team_header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    sport_text: {
        fontSize: 14,
        fontFamily: "Rubik",
        color: "#1d3adfff",
        fontWeight: "500"
    },
})
