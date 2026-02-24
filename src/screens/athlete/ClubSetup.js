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

    // Acquire list of teams from database
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/teams/get_teams`);
                setTeams(response.data.teams);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };
        fetchTeams();
    }, []);

    const handleSave = async (team_id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/athletes/join_team`, {
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
        <SafeAreaView style={globalStyles.container} edges={["top"]}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerText}>Choose Team</Text>
            </View>
            <View style={[globalStyles.contentContainer, {flex: 1}]}>
                <View style={{flex: 1}}>
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
                <TouchableOpacity 
                    style={
                        selection ? styles.saveSelectionButton : styles.saveSelectionButtonDisabled} 
                    onPress={() => handleSave(selection)}
                    disabled={!selection}
                >
                    <Text style={
                        selection ? styles.saveSelectionButtonText : styles.saveSelectionButtonTextDisabled}
                    >
                        Save Selection
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        fontWeight: "bold"
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
    saveSelectionButton: {
        backgroundColor: "#a2d5ff",
        borderColor: "#99b9ff",
        padding: 15, 
        borderRadius: 15,
        marginBottom: 10,
        alignItems: "center",
        borderWidth: 2,
    },
    saveSelectionButtonText: {
        fontFamily: "Rubik",
        fontWeight: "bold",
        fontSize: 18
    },
    saveSelectionButtonDisabled: {
        backgroundColor: "#cccccc",
        borderColor: "#cccccc",
        padding: 15, 
        borderRadius: 15,
        marginBottom: 10,
        alignItems: "center",
        borderWidth: 2,
    },
    saveSelectionButtonTextDisabled: {
        color: "#666666",
        fontFamily: "Rubik",
        fontWeight: "bold",
        fontSize: 18
    }
})
