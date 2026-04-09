import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarContainer, CalendarHeader, CalendarBody } from "@howljs/calendar-kit";
import calendarTheme from "../../styles/calendarTheme";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import apiClient from "../../config/apiConfig";
import { useAuth } from "../../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import SkeletonText from "../../components/skeleton/SkeletonText";

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
  const [events, setEvents] = useState([]);
  const [activeTeam, setActiveTeam] = useState(0);
  const [showTeamPicker, setShowTeamPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Acquire coach teams
          const teamResponse = await apiClient.get(
            `/api/teams/coach_teams/${uuid}`
          );
          if (
            teamResponse &&
            teamResponse.data &&
            teamResponse.data.teams.length > 0
          ) {
            const fetchedTeams = teamResponse.data.teams;
            setTeams(fetchedTeams);
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
      // Ensure team exists
      if (!teamsData || teamsData.length === 0 || !teamsData[teamIndex]) {
        console.log("No team data available");
        return;
      }

      const athletesResponse = await apiClient.get(
        `/api/teams/get_athletes/${teamsData[teamIndex].team_id}`
      );
      if (athletesResponse && athletesResponse.data) {
        setHealthy(athletesResponse.data.healthy_athletes);
        setAtRisk(athletesResponse.data.at_risk_athletes);
        setInjured(athletesResponse.data.injured_athletes);
        setAthletesNotReported(athletesResponse.data.reports_due);
        setReportsSubmitted(
          athletesResponse.data.num_athletes - athletesResponse.data.reports_due
        );

        getTeamEvents(teamsData[teamIndex].team_id);
      } else {
        console.log("No athlete data received");
      }
    } catch (error) {
      console.error("Error fetching athlete data for team:", error);
    }
  };

  const getTeamEvents = async (team) => {
    try {
      const eventsResponse = await apiClient.get(
        `/api/events/team_events/${team}`
      );
      if (eventsResponse && eventsResponse.data) {
        const formattedEvents = eventsResponse.data.team_events.map(event => {
          const eventDate = new Date(event.event_date);
          const [startHour, startMinute] = event.start_time.split(":");
          const [endHour, endMinute] = event.end_time.split(":");
          const startDate = new Date(eventDate);
          const endDate = new Date(eventDate);
          startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
          endDate.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

          return {
            id: event.event_id.toString(),
            start: { dateTime: startDate.toISOString() },
            end: { dateTime: endDate.toISOString() },
            color: "#bb000077"
          };
        });

        formattedEvents.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime))

        // Merge overlapping events to show general (un)availability periods
        const mergedEvents = []
        for (const event of formattedEvents) {
          if (mergedEvents.length === 0) {
            mergedEvents.push({ ...event });
            continue;
          }

          const lastEvent = mergedEvents[mergedEvents.length - 1]
          const lastEventEnd = new Date(lastEvent.end.dateTime);
          const currentEventStart = new Date(event.start.dateTime);
          const currentEventEnd = new Date(event.end.dateTime);

          // If the current event overlaps or touches the last merged event
          if (currentEventStart <= lastEventEnd) {
            // Extend the end time if the current event finishes later
            if (currentEventEnd > lastEventEnd) {
              lastEvent.end.dateTime = event.end.dateTime;
            }
          } else {
            // Otherwise it's a new unavailability block
            mergedEvents.push({ ...event, id: `block-${mergedEvents.length}`})
          }
        }

        setEvents(mergedEvents);

      } else {
        console.log("No events data received");
      }
    } catch (error) {
      console.error("Error fetching team events:", error);
    }
  };

  const renderEvent = useCallback((event) => (
    <View style={{
      width: "100%",
      height: "100%",
      padding: 5,
      backgroundColor: event.color,
      borderRadius: 4,
      borderColor: "#d30000",
      borderLeftWidth: 5,
    }}
    >
    </View>
  ), []
  );

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
      <ScrollView style={globalStyles.contentContainer}>
        {loading ? (
          <>
            <SkeletonText height={125} borderRadius={15} />

            <View style={{ marginTop: 45 }}>
              <SkeletonText height={16} />
            </View>
            <View style={[styles.infoCardsContainer, { marginTop: 15 }]}>
              <SkeletonText width={"30%"} height={120} borderRadius={15} />
              <SkeletonText width={"30%"} height={120} borderRadius={15} />
              <SkeletonText width={"30%"} height={120} borderRadius={15} />
            </View>
            <View style={[styles.infoCardsContainer, { marginTop: 25 }]}>
              <SkeletonText width={"48%"} height={150} borderRadius={15} />
              <SkeletonText width={"48%"} height={150} borderRadius={15} />
            </View>
          </>
        ) : (
          <>
            {injured > 0 || atRisk > 0 ? (
              <>
                <TouchableOpacity
                  style={[styles.noticeCard, { backgroundColor: "#fef3de", borderColor: "#e9a803" }]}
                  onPress={() => navigation.navigate("Team")}
                >
                  <View style={styles.noticeIconContainer}>
                    <MaterialIcons
                      name="warning-amber"
                      size={40}
                      color="#e9a803"
                    />
                  </View>
                  <View style={styles.noticeTextContainer}>
                    <Text style={styles.noticeLabel}>Alert</Text>
                    <Text style={styles.noticeTitle}>
                      Athletes require your attention
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.noticeCard, { backgroundColor: "#e4fede", borderColor: "#10b981" }]}
                  onPress={() => navigation.navigate("Team")}
                >
                  <View style={styles.noticeIconContainer}>
                    <MaterialIcons
                      name="check-circle-outline"
                      size={40}
                      color="#10b981"
                    />
                  </View>
                  <View style={styles.noticeTextContainer}>
                    <Text style={styles.noticeLabel}>Team looks good</Text>
                    <Text style={styles.noticeTitle}>All athletes healthy</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
            <View style={styles.overviewHeaderContainer}>
              <Text style={styles.componentTitle}>Overview</Text>
              <View style={styles.line} />
              <TouchableOpacity
                style={styles.changeTeamFocusButton}
                onPress={() => setShowTeamPicker(true)}
              >
                <Text
                  style={styles.changeTeamFocusText}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {teams[activeTeam]?.team_name}
                </Text>
                <Ionicons name="chevron-down" size={11} color={"#fff"} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoCardsContainer}>
              <TouchableOpacity
                style={styles.infoCard}
                onPress={() =>
                  navigation.navigate("TeamViewer", { team: teams[activeTeam] })
                }
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
                onPress={() =>
                  navigation.navigate("TeamViewer", { team: teams[activeTeam] })
                }
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={28}
                  color="#f59e0b"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardValue}>{atRisk}</Text>
                <Text style={styles.cardLabel}>Training Only</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.infoCard}
                onPress={() =>
                  navigation.navigate("TeamViewer", { team: teams[activeTeam] })
                }
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={28}
                  color="#ef4444"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardValue}>{injured}</Text>
                <Text style={styles.cardLabel}>Fully Absent</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoCardsContainer}>
              <TouchableOpacity
                style={styles.infoCard}
                onPress={() =>
                  navigation.navigate("TeamViewer", { team: teams[activeTeam] })
                }
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
                onPress={() =>
                  navigation.navigate("TeamViewer", { team: teams[activeTeam] })
                }
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
                  scrollByDay={false}
                  events={events}
                  overlapType="overlap"
                  overlapEventsSpacing={0}
                  
                >
                  <CalendarHeader />
                  <CalendarBody renderEvent={renderEvent} />
                </CalendarContainer>
              </View>
            </View>
          </>
        )}
      </ScrollView>
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
    backgroundColor: "#001a79",
    borderRadius: 10,
    alignItems: "center"
  },
  changeTeamFocusText: {
    fontFamily: "Rubik",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 11,
    marginRight: 5
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
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 5,
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
    marginRight: 20,
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
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    fontFamily: "Rubik",
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
