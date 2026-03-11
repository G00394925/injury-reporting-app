import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { API_BASE_URL } from "../../config/api_config";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import SkeletonText from "../../components/skeleton/SkeletonText";
import { Ionicons } from "@expo/vector-icons";

export default function TeamManagerScreen() {
  const navigation = useNavigation();
  const { uuid, userData } = useAuth();
  const [teamItems, setTeamItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/teams/coach_teams/${uuid}`
        );
        const teamsData = response.data.teams;

        // Fetch athlete counts for each team
        const teamsWithCounts = await Promise.all(
          teamsData.map(async (team) => {
            try {
              const athleteResponse = await axios.get(
                `${API_BASE_URL}/api/teams/get_athletes/${team.team_id}`
              );
              return {
                ...team,
                injured: athleteResponse.data.injured_athletes,
                healthy: athleteResponse.data.healthy_athletes
              };
            } catch (error) {
              console.error(
                `Error fetching athletes for team ${team.team_id}:`,
                error
              );
              return {
                ...team,
                injured: 0,
                healthy: 0
              };
            }
          })
        );

        const teams = teamsWithCounts.map((team) => {
          return (
            <TouchableOpacity
              key={team.team_id}
              style={styles.teamSlot}
              onPress={() => {
                navigation.navigate("TeamViewer", { team: team });
              }}
            >
              <View style={styles.teamHeader}>
                <Text style={styles.teamText}>{team.team_name}<Ionicons style={styles.chevronContainer} name="chevron-forward" size={20} /></Text>
                <Text style={styles.sportText}>{team.sport}</Text>
              </View>
              <Text style={styles.playerCountText}>{team.players} Players</Text>
              <Text style={styles.injuryStatusText}>
                {team.injured} Injured
              </Text>
            </TouchableOpacity>
          );
        });

        setTeamItems(teams);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Team Manager</Text>
      </View>
      <View style={globalStyles.contentContainer}>
        {loading ? (
          <>
            <View style={{marginBottom: 15}}><SkeletonText width={"100%"} height={125} borderRadius={25} /></View>
            <View style={{marginBottom: 15}}><SkeletonText width={"100%"} height={125} borderRadius={25} /></View>
            <View style={{marginBottom: 15}}><SkeletonText width={"100%"} height={125} borderRadius={25} /></View>
            <View style={{marginBottom: 15}}><SkeletonText width={"100%"} height={125} borderRadius={25} /></View>
          </>
        ) : (
          <>
            {teamItems}

            <TouchableOpacity
              style={styles.newTeamButton}
              onPress={() => {
                navigation.navigate("TeamCreator");
              }}
              >
              <Text>Create new team</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  teamSlot: {
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#1d3adfff",
    borderRadius: 25,
    marginBottom: 15,
    backgroundColor: "#d8f4ff",
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
  },
  chevronContainer: {
    justifyContent: "center",
    alignItems: "center",
    color: "#a1a1a1"
  }
});
