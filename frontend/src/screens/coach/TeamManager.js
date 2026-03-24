import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { API_BASE_URL } from "../../config/apiConfig";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import SkeletonText from "../../components/skeleton/SkeletonText";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";

export default function TeamManagerScreen() {
  const [newTeamName, setNewTeamName] = useState(null);
  const [newSport, setNewSport] = useState(null);
  const navigation = useNavigation();
  const { uuid, session } = useAuth();
  const [teamItems, setTeamItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validSubmit, setValidSubmit] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);

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

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    if (newTeamName && newSport) {
      const response = await axios.post(`${API_BASE_URL}/api/teams/new`, {
        team_name: newTeamName,
        sport: newSport,
        coach_id: uuid,
        session: session
      });
      console.log("Team created:", response.data);

      // Reset modal state and close
      setCreateModalVisible(false);
      setNewTeamName(null);
      setNewSport(null);

      // Refresh team list
      setLoading(true);
      fetchTeams();
    } else {
      setValidSubmit(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Team Manager</Text>
      </View>
      <ScrollView style={globalStyles.contentContainer} contentContainerStyle={{ paddingBottom: 75 }}>
        {loading ? (
          <>
            <View style={{ marginBottom: 15 }}><SkeletonText width={"100%"} height={125} borderRadius={25} /></View>
            <View style={{ marginBottom: 15 }}><SkeletonText width={"100%"} height={125} borderRadius={25} /></View>
            <View style={{ marginBottom: 15 }}><SkeletonText width={"100%"} height={125} borderRadius={25} /></View>
            <View style={{ marginBottom: 15 }}><SkeletonText width={"100%"} height={125} borderRadius={25} /></View>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.newTeamButton}
              onPress={() => {
                setCreateModalVisible(true);
              }}
            >
              <Text style={styles.newTeamText}>Create new team</Text>
              <MaterialIcons name="add-circle" size={35} color={'#bab8b8'} />
            </TouchableOpacity>

            {teamItems}
          </>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            <View style={globalStyles.modalHeader}>
              <Text style={globalStyles.modalTitle}>Create New Team</Text>
              <TouchableOpacity onPress={() => { setCreateModalVisible(false); }}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={globalStyles.modalBody}>
              {!validSubmit && (
                <Text style={styles.errorText}>Please fill out ALL fields</Text>
              )}
              <Text style={globalStyles.modalInputLabel}>Team Name</Text>
              <TextInput
                style={globalStyles.modalInput}
                placeholder="Enter team name"
                placeholderTextColor={"#999"}
                value={newTeamName}
                onChangeText={setNewTeamName}
              />

              <Text style={globalStyles.modalInputLabel}>Sport</Text>
              <TextInput
                style={globalStyles.modalInput}
                placeholder="What sport will your team be playing?"
                placeholderTextColor={"#999"}
                value={newSport}
                onChangeText={setNewSport}
              />
            </View>

            <View style={globalStyles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleCreateTeam}
              >
                <Text style={styles.modalConfirmButtonText}>Create Team</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: "row",
    padding: 15,
    borderWidth: 1,
    borderColor: "#969696ff",
    borderStyle: "dashed",
    borderRadius: 25,
    height: 65,
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between"
  },
  newTeamText: {
    fontFamily: "Rubik",
    fontSize: 17
  },
  chevronContainer: {
    justifyContent: "center",
    alignItems: "center",
    color: "#a1a1a1"
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10
  },
  modalCancelButtonText: {
    fontFamily: "Rubik",
    fontSize: 16,
    color: "#666",
    fontWeight: "bold"
  },
  modalConfirmButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#001a79",
    alignItems: "center",
    borderRadius: 10
  },
  modalConfirmButtonText: {
    fontFamily: "Rubik",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff"
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontFamily: "Rubik"
  }
});