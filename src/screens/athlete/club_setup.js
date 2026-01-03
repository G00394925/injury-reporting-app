import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api_config";
import axios from "axios";
import { Button } from "@rneui/base";

export default function ClubSetup() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const { uuid } = useAuth();
    const [items, setItems] = useState([]);

    // Acquire list of coaches from database
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/athlete/teams`);
                const teamOptions = response.data.teams.map((team) => {
                    return (
                        <TouchableOpacity 
                            key={team.team_id}
                            style={styles.teamSlot}
                            onPress={() => {navigation.navigate("MainApp")}}
                        >
                                <View style={styles.teamHeader}>
                                    <Text style={styles.teamText}>{team.team_name}</Text>
                                    <Text style={styles.sportText}>{team.sport}</Text>
                                    <Text style={styles.coachText}>Coach: {team.coach_name}</Text>
                                </View>
                            </TouchableOpacity>
                    )
                });

                // TODO: Fix mapping to dropdown items
                    
                setItems(teamOptions);
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
        <View>
            <View>
                <Text>Choose team:</Text>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    listMode="SCROLLVIEW"
                    placeholder="Select your team"
                />
                <Button title="Save" onPress={() => handleSave()} />
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
        verticalAlign: "top"
    },
    coachText: {
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
