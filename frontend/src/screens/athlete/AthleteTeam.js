import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Modal } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useCallback, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import SkeletonText from "../../components/skeleton/SkeletonText";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function AthleteTeamScreen() {
  const navigation = useNavigation();
  const { userData, uuid, session } = useAuth();
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(0);
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showTeamPicker, setShowTeamPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchTeamDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/athletes/team/${uuid}`
          );

          // Athlete is not in a team - redirect to club setup.
          if (response.data == null) {
            navigation.navigate("ClubSetup");
            return;
          } else {
            const fetchedTeams = response.data.teams;
            setTeams(fetchedTeams);
            await loadTeamData(fetchedTeams, activeTeam);
          }
        } catch (error) {
          console.error("Error fetching team details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTeamDetails();
    }, [uuid])
  );

  const loadTeamData = async (teams, teamIndex) => {
    // Acquire details for active team
    try {
      setTeamDetails(teams[teamIndex]);
    } catch (error) {
      console.error("Error loading team data:", error);
    }
  };

  const setTeamFocus = async (teamIndex) => {
    await loadTeamData(teams, teamIndex);
  };

  const handleTeamLeave = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/athletes/leave_team`, {
        athlete_id: uuid,
        team_id: teamDetails.team_id,
        session: session
      }
      );

      if (response && response.data) {
        console.log("Athlete left team", response.data);
      } else {
        console.log("No response from server when leaving team");
      }
    } catch (error) {
      console.error("Error leaving team: ", error);
    } finally {
      setShowConfirmation(false);
      { teams.length > 1 ? setTeamFocus(0) : navigation.navigate("ClubSetup"); }
    }
  };

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Team</Text>
      </View>
      <View style={[globalStyles.contentContainer, { flex: 1 }]}>
        <View style={{ flex: 1 }}>
          <View>
            {loading ? (
              <SkeletonText width={"75%"} height={32} />
            ) : (
              <TouchableOpacity
                style={styles.teamHeader}
                onPress={() => setShowTeamPicker(true)}
              >
                <Text style={styles.clubText}>{teamDetails?.team_name}</Text>
                <Ionicons name="chevron-down" size={24} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.detailContainer}>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Name: </Text>
              {loading ? (
                <SkeletonText width={"35%"} height={32} borderRadius={25} />
              ) : (
                <Text style={styles.detailText}>{userData?.name}</Text>
              )}
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Coach: </Text>
              {loading ? (
                <SkeletonText width={"35%"} height={32} borderRadius={25} />
              ) : (
                <Text style={styles.detailText}>{teamDetails?.coach}</Text>
              )}
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Sport: </Text>
              {loading ? (
                <SkeletonText width={"35%"} height={32} borderRadius={25} />
              ) : (
                <Text style={styles.detailText}>{teamDetails?.sport}</Text>
              )}
            </View>
          </View>
        </View>
        {!loading && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.joinTeamsButton}
              onPress={() => navigation.navigate("ClubSetup")}
            >
              <Text style={styles.joinTeamsButtonText}>Join Another Team</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.leaveTeamButton}
              onPress={() => setShowConfirmation(true)}
            >
              <MaterialIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal
        visible={showConfirmation}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowConfirmation(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Are you sure you want to leave this team?
              </Text>
            </View>
            <View style={styles.modalBody}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleTeamLeave}
              >
                <Text style={styles.modalButtonText}>Yes, leave</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTeamPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowTeamPicker(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            <View style={globalStyles.modalHeader}>
              <Text style={globalStyles.modalTitle}>Select Team</Text>
              <TouchableOpacity onPress={() => setShowTeamPicker(false)}>
                <MaterialIcons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 15 }}>
              {teams.map((team, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={() => {
                    setActiveTeam(index);
                    setTeamFocus(index);
                    setShowTeamPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>{team.team_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  teamHeader: {
    flexDirection: "row",
    alignItems: "center"
  },
  clubText: {
    fontFamily: "Rubik",
    fontSize: 28,
    marginTop: 5,
    marginRight: 5
  },
  detailContainer: {
    marginTop: 20
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
    fontFamily: "Rubik"
  },
  detailText: {
    fontSize: 16,
    color: "#f7f7f7",
    backgroundColor: "#001a79",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: "bold",
    fontFamily: "Rubik"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  joinTeamsButton: {
    backgroundColor: "#001a79",
    padding: 15,
    width: "78%",
    borderRadius: 45
  },
  joinTeamsButtonText: {
    color: "#ffffff",
    fontFamily: "Rubik",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  },
  leaveTeamButton: {
    backgroundColor: "#fc0505",
    padding: 15,
    borderRadius: 90,
    alignItems: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Rubik",
    color: "#333"
  },
  modalBody: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  modalConfirmButton: {
    backgroundColor: "#ff8d8d",
    padding: 15,
    borderRadius: 15,
    width: "45%",
    alignItems: "center"
  },
  modalCancelButton: {
    backgroundColor: "#cccccc",
    padding: 15,
    borderRadius: 15,
    width: "45%",
    alignItems: "center"
  },
  modalButtonText: {
    fontFamily: "Rubik",
    fontWeight: "bold",
    fontSize: 16
  },
  option: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Rubik",
    color: "#333"
  },
});
