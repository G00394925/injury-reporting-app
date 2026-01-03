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

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/coach-teams/${uuid}`);
                const teams = response.data.teams.map((team) => {
                    return (
                        <View style={styles.teamSlot}>
                            <Text style={styles.teamText}>{team.team_name}</Text>
                        </View>
                    )
                })
            
                setTeamItems(teams);
            
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };
        
        fetchTeams();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.header_text}>Team Manager</Text>
            </View>
            <View style={styles.contentContainer}>

                {teamItems}

                <TouchableOpacity style={styles.newTeamButton} onPress={() => {navigation.navigate("TeamCreator")}}>
                    <Text>Create new team</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
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
    teamSlot: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#1d3adfff",
        borderRadius: 10,
        marginBottom: 15
    },
    teamText: {
        fontSize: 18,
        fontFamily: "Rubik",
        padding: 5
    },
    newTeamButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#969696ff",
        borderStyle: "dashed",
        borderRadius: 10
    }
})

