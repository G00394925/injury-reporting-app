import { Text, StyleSheet, View, ActivityIndicator, TouchableOpacity, Modal } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useCallback, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api_config";

export default function AthleteTeamScreen() {
  const navigation = useNavigation();
  const { userData, uuid } = useAuth();
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchTeamDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/athletes/team/${uuid}`
          );

          // Athlete is not in a team - redirect to club setup.
          if (response.data.team_details == null) {
            navigation.navigate("ClubSetup");
            return;
          } else {
            setTeamDetails(response.data.team_details);
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

  const handleTeamLeave = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/athletes/leave_team/${uuid}`
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
      navigation.navigate("ClubSetup");
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
            <Text style={styles.clubTitle}>Club</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#484848" />
            ) : (
              <Text style={styles.clubText}>{teamDetails?.team_name}</Text>
            )}
          </View>
          <View style={styles.detailContainer}>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Name: </Text>
              {loading ? (
                <ActivityIndicator size="small" color="#484848" />
              ) : (
                <Text style={styles.detailText}>{userData?.name}</Text>
              )}
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Coach: </Text>
              {loading ? (
                <ActivityIndicator size="small" color="#484848" />
              ) : (
                <Text style={styles.detailText}>{teamDetails?.coach}</Text>
              )}
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Sport: </Text>
              {loading ? (
                <ActivityIndicator size="small" color="#484848" />
              ) : (
                <Text style={styles.detailText}>{teamDetails?.sport}</Text>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.leaveTeamButton}
          onPress={() => setShowConfirmation(true)}
        >
          <Text style={styles.leaveTeamButtonText}>Leave team</Text>
        </TouchableOpacity>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  clubTitle: {
    fontWeight: "bold",
    fontFamily: "Rubik",
    fontSize: 22
  },
  clubText: {
    fontFamily: "Rubik",
    fontSize: 28,
    marginTop: 5
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
  leaveTeamButton: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff9999"
  },
  leaveTeamButtonText: {
    color: "#b30000",
    fontFamily: "Rubik",
    fontWeight: "bold",
    fontSize: 18
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
    fontSize: 16
  }
});
