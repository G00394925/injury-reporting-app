import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api_config";
import axios from "axios";
import { Button } from "@rneui/base";

export default function ClubSetup() {
    const [selection, setSelection] = useState(null);
    const { uuid } = useAuth();
    const [teams, setTeams] = useState([]);

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

    const handleSave = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/assign-coach/`, {
                athlete_uuid: uuid,
                coach_name: value,
            });

            console.log("Coach assigned successfully:", response.data);
        } catch (error) {
            console.error("Error assigning coach:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={{}}>Choose team:</Text>
                {teams.map((team) => (
                    <TouchableOpacity
                        key={team.team_id}
                        style={[styles.teamSlotInactive, selection === team.team_id && styles.teamSlotActive]}
                        onPress={() => setSelection(team.team_id)}
                    >
                        <View style={styles.teamHeader}>
                            <Text style={styles.teamText}>{team.team_name}</Text>
                            <Text style={styles.sportText}>{team.sport}</Text>
                        </View>
                        <Text style={styles.coachText}>Coach: {team.coach_name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
    },
    contentContainer: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        padding: 20,
        marginTop: -8
    },
    teamSlotInactive: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#888888ff",
        borderRadius: 5,
        marginBottom: 15,
        justifyContent: "flex-start"
    },
    teamSlotActive: {
        padding: 15,
        borderWidth: 2,
        borderColor: "#001a79",
        borderRadius: 5,
        marginBottom: 15,
        justifyContent: "flex-start"
    },
    teamText: {
        fontSize: 18,
        fontFamily: "Rubik",
        alignSelf: "flex-start",
        verticalAlign: "top",
        fontWeight: "500"
    },
    coachText: {
        fontSize: 14,
        marginTop: 10,
        fontFamily: "Rubik",
        alignSelf: "flex-start",
        verticalAlign: "bottom"
    },
    teamHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    sportText: {
        fontSize: 14,
        fontFamily: "Rubik",
        color: "#1d3adfff",
        fontWeight: "500"
    },
})
