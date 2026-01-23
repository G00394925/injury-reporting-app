import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { API_BASE_URL } from "../../config/api_config";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
 

export default function TeamManagerScreen() {
    const navigation = useNavigation();
    const {uuid, userData} = useAuth();
    const [teamItems, setTeamItems] = useState([]);
    const [numInjured, setNumInjured] = useState(0);
    const [numHealthy, setNumHealthy] = useState(0);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/coach-teams/${uuid}`);
                const teamsData = response.data.teams;
                
                if (teamsData.length > 0) {
                    getAthleteCount(teamsData[0].team_id);
                }
                
                const teams = teamsData.map((team) => {
                    return (
                        <TouchableOpacity 
                            key={team.team_id}
                            style={styles.teamSlot}
                            onPress={() => {navigation.navigate("TeamViewer", {team: team})}}
                        >
                            <View style={styles.teamHeader}>
                                <Text style={styles.teamText}>{team.team_name}</Text>
                                <Text style={styles.sportText}>{team.sport}</Text>
                            </View>
                            <Text style={styles.playerCountText}>{team.players} Players</Text>
                            <Text style={styles.injuryStatusText}>{numInjured} Injured</Text>
                        </TouchableOpacity>
                    )
                });
            
                setTeamItems(teams);
            
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };
        
        fetchTeams();
    }, []);

    const getAthleteCount = async (team_id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/team/get-athletes/${team_id}`);
            setNumHealthy(response.data.healthy_athletes);
            setNumInjured(response.data.injured_athletes);
        
        } catch (error) {
            console.error("Error fetching athlete count:", error);
        }
    }

    return (
        <SafeAreaView style={globalStyles.container} edges={["top"]}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerText}>Team Manager</Text>
            </View>
            <View style={globalStyles.contentContainer}>

                {teamItems}

                <TouchableOpacity style={styles.newTeamButton} onPress={() => {navigation.navigate("TeamCreator")}}>
                    <Text>Create new team</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    teamSlot: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#1d3adfff",
        borderRadius: 10,
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
    playerCountText: {
        fontSize: 14,
        marginTop: 15,
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
    injuryStatusText: {
        fontSize: 12,
        fontFamily: "Rubik",
        color: "#666",
        marginTop: 5
    },
    newTeamButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#969696ff",
        borderStyle: "dashed",
        borderRadius: 10
    }
})

