import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../config/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import SkeletonText from "../../components/skeleton/SkeletonText";

export default function ClubSetup() {
  const [selection, setSelection] = useState(null);
  const { uuid, session } = useAuth();
  const [teams, setTeams] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Acquire list of teams from database
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiClient.get('/api/teams/get_teams');
        console.log("Teams data: ", response.data);

        const alreadyJoined = await apiClient.get(`/api/athletes/team/${uuid}`);
        console.log("Already joined team data: ", alreadyJoined.data);

        // Get IDs of teams athlete is already in
        const joinedTeamIds = alreadyJoined.data.teams.map(t => t.team_id);
        // Filter out those teams from the available list
        const filteredTeamsList = response.data.teams.filter(
          team => !joinedTeamIds.includes(team.team_id)
        );
        setTeams(filteredTeamsList);
        setFilteredTeams(filteredTeamsList);

      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // Filter teams based on search query
  const handleSearch = (query) => {
    setQuery(query);
    if (query === "") {
      setFilteredTeams(teams);
    } else {
      const filtered = teams.filter((team) => {
        return team.team_name.toLowerCase().includes(query.toLowerCase());
      });
      setFilteredTeams(filtered);
    }
  };

  const handleSave = async (team_id) => {
    try {
      const response = await apiClient.post('/api/athletes/join_team', {
        athlete_id: uuid,
        team_id: team_id,
        session: session
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
      <View
        style={[globalStyles.contentContainer, { flex: 1, paddingBottom: 55 }]}
      >
        <TextInput
          placeholder="Search by team name..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
        {loading ? (
          <>
            <View style={{ marginBottom: 15 }}><SkeletonText height={125} borderRadius={15} /></View>
            <View style={{ marginBottom: 15 }}><SkeletonText height={125} borderRadius={15} /></View>
            <View style={{ marginBottom: 15 }}><SkeletonText height={125} borderRadius={15} /></View>
            <View style={{ marginBottom: 15 }}><SkeletonText height={125} borderRadius={15} /></View>
            <View style={{ marginBottom: 15 }}><SkeletonText height={125} borderRadius={15} /></View>
          </>
        ) : (
          <>
            <ScrollView
              style={{
                flex: 1,
                borderTopWidth: 1,
                borderColor: "#cccccc",
                paddingTop: 15
              }}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {filteredTeams.map((team) => (
                <TouchableOpacity
                  key={team.team_id}
                  style={[
                    styles.teamSlotInactive,
                    selection === team.team_id && styles.teamSlotActive
                  ]}
                  onPress={() => setSelection(team.team_id)}
                >
                  <View style={styles.teamHeader}>
                    <Text style={styles.teamText}>{team.team_name}</Text>
                    <Text style={styles.sportText}>{team.sport}</Text>
                  </View>
                  <Text style={styles.coachText}>Coach: {team.coach_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={
                selection
                  ? styles.saveSelectionButton
                  : styles.saveSelectionButtonDisabled
              }
              onPress={() => handleSave(selection)}
              disabled={!selection}
            >
              <Text
                style={
                  selection
                    ? styles.saveSelectionButtonText
                    : styles.saveSelectionButtonTextDisabled
                }
              >
                Save Selection
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  teamSlotInactive: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#888888ff",
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: "flex-start"
  },
  teamSlotActive: {
    padding: 15,
    borderWidth: 4,
    borderColor: "#001a79",
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: "flex-start"
  },
  searchInput: {
    fontFamily: "Rubik",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 15,
    marginBottom: 15
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
    borderColor: "#6897ff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 3
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
    borderWidth: 2
  },
  saveSelectionButtonTextDisabled: {
    color: "#666666",
    fontFamily: "Rubik",
    fontWeight: "bold",
    fontSize: 18
  }
});
