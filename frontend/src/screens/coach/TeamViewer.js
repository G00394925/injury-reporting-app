import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import apiClient from "../../config/apiConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import AthleteInfoSkeleton from "../../components/skeleton/AthleteInfoSkeleton";

export default function TeamViewerScreen({ route }) {
  const { team } = route.params;
  const navigation = useNavigation();
  const { uuid } = useAuth();
  const [athleteItems, setAthleteItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await apiClient.get(
          `/api/teams/get_athletes/${team.team_id}`
        );

        // Fetch time since last report for each athlete
        const athleteLastReport = await Promise.all(
          response.data.athletes.map(async (athlete) => {
            try {
              const timeResponse = await apiClient.get(
                `/api/health/get_recent_report/${athlete.athlete_id}`
              );
              return {
                ...athlete,
                timeSinceReport: timeResponse.data || "No report submitted"
              };
            } catch (error) {
              console.error(`Error fetching most recent report for athlete ${athlete.athlete_id}:`, error);
              return {
                ...athlete,
                timeSinceReport: "No report data"
              };
            }
          })
        );

        athleteLastReport.sort((a, b) => {
          const surnameA = a.name.split(' ').pop();
          const surnameB = b.name.split(' ').pop();
          return surnameA.localeCompare(surnameB);
        });

        const athletes = athleteLastReport.map((athlete) => {
          return (
            <View
              key={athlete.athlete_id}
              style={styles.athleteSlot}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={
                    athlete.health_status === "Healthy" ? "check-circle"
                      : athlete.health_status === "No competing" ? "alert-circle"
                        : "close-circle"
                  }
                  size={50}
                  color={
                    athlete.health_status === "Healthy" ? "#10b981"
                      : athlete.health_status === "No competing" ? "#f59e0b"
                        : "#ef4444"
                  }
                />
              </View>
              <TouchableOpacity
                style={styles.athleteDetailsContainer}
                onPress={() => navigation.navigate("AthleteViewer", { athlete: athlete })}>
                <Text style={styles.athleteNameText}>
                  {athlete.name}
                </Text>

                <Text style={styles.athleteLastReport}>
                  Last report: {athlete.timeSinceReport}
                </Text>
              </TouchableOpacity>
            </View>
          );
        });
        setAthleteItems(athletes);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAthletes();
  }, [team.team_id]);

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>{team.team_name}</Text>
      </View>
      <View style={globalStyles.contentContainer}>
        {loading ? (
          <>
            <AthleteInfoSkeleton />
            <AthleteInfoSkeleton />
            <AthleteInfoSkeleton />
            <AthleteInfoSkeleton />
            <AthleteInfoSkeleton />
            <AthleteInfoSkeleton />
            <AthleteInfoSkeleton />
            <AthleteInfoSkeleton />
            <AthleteInfoSkeleton />
          </>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 45 }}>
            {athleteItems.length > 0 ? (
              athleteItems
            ) : (
              <Text style={styles.noAthletesText}>
                No athletes in this team yet.
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginRight: 10,
    padding: 5
  },
  noAthletesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontFamily: "Rubik",
    color: "#666"
  },
  athleteSlot: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#c4c4c4",
    backgroundColor: "#ffffff"
  },
  athleteDetailsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  athleteNameText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Rubik",
    color: "#1f2937"
  },
  athleteLastReport: {
    fontSize: 16,
    fontFamily: "Rubik",
    alignSelf: "flex-end",
    color: "#6e6e6e",
    marginTop: 10
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center"
  }
});
