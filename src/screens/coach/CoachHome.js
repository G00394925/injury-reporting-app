import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarContainer, CalendarHeader, CalendarBody } from "@howljs/calendar-kit";
import calendarTheme from "../../styles/calendar_theme";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../config/api_config";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function CoachDashScreen() {
  const { uuid, userData } = useAuth();
  const navigation = useNavigation();
  const [healthy, setHealthy] = useState(0);
  const [atRisk, setAtRisk] = useState(0);
  const [injured, setInjured] = useState(0);
  const [reportsSubmitted, setReportsSubmitted] = useState(0);
  const [athletesNotReported, setAthletesNotReported] = useState(0);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(0);
  const [showTeamPicker, setShowTeamPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Acquire team id
          const teamResponse = await axios.get(
            `${API_BASE_URL}/api/teams/coach_teams/${uuid}`
          );
          if (teamResponse && teamResponse.data && teamResponse.data.teams.length > 0) {
            console.log("TEAM DATA: ", teamResponse.data.teams)
            const fetchedTeams = teamResponse.data.teams;
            setTeams(fetchedTeams);
            // Use the fetched data directly instead of waiting for state update
            await loadTeamData(fetchedTeams, activeTeam);
          }
        } catch (error) {
          console.error("Error fetching team data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [uuid])
  );

  const loadTeamData = async (teamsData, teamIndex) => {
    // Acquire athlete data for team.
    try {
      // Safety check to ensure team exists
      if (!teamsData || teamsData.length === 0 || !teamsData[teamIndex]) {
        console.log("No team data available");
        return;
      }
      
      console.log("TEAMS : ", teamsData)
      const athletesResponse = await axios.get(
        `${API_BASE_URL}/api/teams/get_athletes/${teamsData[teamIndex].team_id}`
      );
      if (athletesResponse && athletesResponse.data) {
        setHealthy(athletesResponse.data.healthy_athletes);
        setAtRisk(athletesResponse.data.at_risk_athletes);
        setInjured(athletesResponse.data.injured_athletes);
        setAthletesNotReported(athletesResponse.data.reports_due);
        setReportsSubmitted(
          athletesResponse.data.num_athletes -
          athletesResponse.data.reports_due
        );
      } else {
        console.log("No athlete data received");
      }
    } catch (error) {
      console.error("Error fetching athlete data for team:", error);
    }
  };

  const setTeamFocus = async (teamIndex) => {
    await loadTeamData(teams, teamIndex);
  };

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <Text style={[globalStyles.headerText, { alignContent: "flex-start" }]}>
          Hello Macdarach
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          <ScrollView style={globalStyles.contentContainer}>
            <TouchableOpacity style={styles.noticeCard} onPress={() => navigation.navigate("Team")}>
              <View style={styles.noticeIconContainer}>
                <MaterialIcons name="warning-amber" size={40} color="#e9a803" />
              </View>
              <View style={styles.noticeTextContainer}>
                <Text style={styles.noticeLabel}>Alert</Text>
                <Text style={styles.noticeTitle}>
                  Athletes require your attention
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.overviewHeaderContainer}>
              <Text style={styles.componentTitle}>
                Overview
              </Text>
              <View style={styles.line} />
              <TouchableOpacity style={styles.changeTeamFocusButton} onPress={() => setShowTeamPicker(true)}>
                <Text 
                  style={styles.changeTeamFocusText}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {teams[activeTeam]?.team_name}
                </Text>
                <Ionicons name="chevron-down" size={11} />
              </TouchableOpacity>

            </View>
            <View style={styles.infoCardsContainer}>
              <TouchableOpacity 
                style={styles.infoCard} 
                onPress={() => navigation.navigate("TeamViewer", { team: teams[activeTeam] })}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={28}
                  color="#10b981"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardValue}>{healthy}</Text>
                <Text style={styles.cardLabel}>Healthy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.infoCard} 
                onPress={() => navigation.navigate("TeamViewer", { team: teams[activeTeam] })}
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={28}
                  color="#f59e0b"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardValue}>{atRisk}</Text>
                <Text style={styles.cardLabel}>At Risk</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.infoCard} 
                onPress={() => navigation.navigate("TeamViewer", { team : teams[activeTeam] })}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={28}
                  color="#ef4444"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardValue}>{injured}</Text>
                <Text style={styles.cardLabel}>Injured</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoCardsContainer}>
              <TouchableOpacity 
                style={styles.infoCard} 
                onPress={() => navigation.navigate("TeamViewer", { team : teams[activeTeam] })}
              >
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={28}
                  color="#3b82f6"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardValue}>{reportsSubmitted}</Text>
                <Text style={styles.cardLabel}>Reports Submitted Today</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.infoCard} 
                onPress={() => navigation.navigate("TeamViewer", { team : teams[activeTeam] })}
              >
                <MaterialCommunityIcons
                  name="information-outline"
                  size={28}
                  color="#8b5cf6"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardValue}>{athletesNotReported}</Text>
                <Text style={styles.cardLabel}>
                  Athletes Not Reported Today
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.scheduleContainer}>
              <Text style={styles.componentTitle}>Team Schedule</Text>
              <View style={styles.calendarView}>
                <CalendarContainer
                  theme={calendarTheme}
                  numberOfDays={3}
                  hourWidth={50}
                  timeInterval={30}
                  start={540}
                  end={1320}
                  initialTimeIntervalHeight={60}
                  allowPinchToZoom={true}
                  scrollByDay
                >
                  <CalendarHeader />
                  <CalendarBody />
                </CalendarContainer>
              </View>
            </View>
          </ScrollView>
        </>
      )}
      <Modal
        visible={showTeamPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowTeamPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Team</Text>
              <TouchableOpacity onPress={() => setShowTeamPicker(false)}>
                <MaterialIcons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollview}>
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
  overviewHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 5
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0"
  },
  changeTeamFocusButton: {
    flexDirection: "row",
    padding: 7,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: "center"
  },
  changeTeamFocusText: {
    fontFamily: "Rubik",
    fontWeight: "bold",
    fontSize: 11,
    marginRight: 5,
  },
  infoCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
    gap: 12
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 14,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f3f4f6"
  },
  cardIcon: {
    marginBottom: 8
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    fontFamily: "Rubik",
    marginBottom: 4
  },
  cardLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "Rubik",
    textAlign: "center",
    lineHeight: 16
  },
  noticeCard: {
    padding: 20,
    backgroundColor: "#fef3de",
    borderRadius: 15,
    borderLeftWidth: 5,
    borderColor: "#e9a803",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  noticeIconContainer: {
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  noticeTextContainer: {
    flex: 1
  },
  noticeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Rubik",
    marginBottom: 4
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    fontFamily: "Rubik",
    marginBottom: 4
  },
  noticeSubtext: {
    fontSize: 14,
    color: "#6b7280",
    fontFamily: "Rubik"
  },
  componentTitle: {
    fontFamily: "Rubik",
    fontSize: 18,
    fontWeight: "bold"
  },
  scheduleContainer: {
    flex: 1,
    marginTop: 5
  },
  calendarView: {
    height: 300,
    marginTop: 10,
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccccccff",
    borderRadius: 10,
    marginBottom: 50
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    borderRadius: 25,
    maxHeight: "70%",
    width: "80%",
    paddingBottom: 20
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee"
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Rubik",
    color: "#333"
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
  scrollview: {
    paddingHorizontal: 20,
    paddingTop: 10
  }
});