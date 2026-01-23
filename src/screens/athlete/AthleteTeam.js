import { Text, StyleSheet, View, Button } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { Card } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api_config";

export default function AthleteTeamScreen() {
    const navigation = useNavigation();
    const {userData, uuid} = useAuth();
    const [teamDetails, setTeamDetails] = useState(null);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/athlete/team/${uuid}`);
                setTeamDetails(response.data.team_details);
            } catch (error) {
                console.error("Error fetching team details:", error);
            }
        }
        fetchTeamDetails();
    }, [])

    return (
        <SafeAreaView style={globalStyles.container} edges={["top"]}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerText}>Team</Text>
            </View>
            <View style={globalStyles.contentContainer}>
                <View>
                    <Text style={styles.clubTitle}>Club</Text>
                    <Text style={styles.clubText}>{teamDetails?.team_name}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <View style={styles.detail}>
                        <Text style={styles.detailTitle}>Name: </Text>
                        <Text style={styles.detailText}>{userData?.name}</Text>
                    </View>
                     <View style={styles.detail}>
                        <Text style={styles.detailTitle}>Coach: </Text>
                        <Text style={styles.detailText}>{teamDetails?.coach}</Text>
                    </View>
                    <View style={styles.detail}>
                        <Text style={styles.detailTitle}>Sport: </Text>
                        <Text style={styles.detailText}>{teamDetails?.sport}</Text>
                    </View>
                </View>
            </View>
            <Button title="Choose team" onPress={() => {navigation.navigate("ClubSetup")}} />
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    clubTitle: {
        fontWeight: "bold",
        fontFamily: "Rubik",
        fontSize: 22,
    },
    clubText: {
        fontFamily: "Rubik",
        fontSize: 28,
        marginTop: 5
    },
    detailContainer: {
        marginTop: 20,
    },
    detail: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderColor: "#cccccc",
        borderBottomWidth: 1,
        paddingVertical: 20
    },
    detailTitle: {
        fontSize: 16,
        color: "#707070ff",
    },
    detailText: {
        fontSize: 16,
        color: "#292929ff",

    }
});