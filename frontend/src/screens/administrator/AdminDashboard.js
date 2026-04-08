import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../styles/globalStyles";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { API_BASE_URL } from "../../config/apiConfig";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PieChartComponent from "../../components/PieChart";
import BarChartComponent from "../../components/BarChart";
import LineChartComponent from "../../components/LineChart";
import SkeletonText from "../../components/skeleton/SkeletonText";

export default function AdminDashScreen() {
  const [athletes, setAthletes] = useState(0);
  const [coaches, setCoaches] = useState(0);
  const [loading, setLoading] = useState(true);

  // Health status data for pie chart
  const [healthData, setHealthData] = useState({
    healthy: { value: 0, color: "#10b981", label: "Healthy" },
    atRisk: { value: 0, color: "#f59e0b", label: "At Risk" },
    injured: { value: 0, color: "#ef4444", label: "Injured" }
  });

  // Today's submission progress status
  const [submissionData, setSubmissionData] = useState({
    due: { value: 0, color: "#a3a3a3", label: "Due" },
    submitted: { value: 0, color: "#3b82f6", label: "Submitted" }
  });

  const [reportsData, setReportsData] = useState({});
  const [activityData, setActivityData] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      // Get health summary data
      const athletesResponse = await axios.get(
        `${API_BASE_URL}/api/admin/all_athletes`
      );
      if (athletesResponse) {
        setAthletes(athletesResponse.data.num_athletes);
        setHealthData({
          ...healthData,
          healthy: {
            ...healthData.healthy,
            value: athletesResponse.data.healthy
          },
          atRisk: {
            ...healthData.atRisk,
            value: athletesResponse.data.at_risk
          },
          injured: {
            ...healthData.injured,
            value: athletesResponse.data.injured
          }
        });

        // Set submission progress data
        setSubmissionData({
          ...submissionData,
          due: {
            ...submissionData.due,
            value: athletesResponse.data.reports_due
          },
          submitted: {
            ...submissionData.submitted,
            value: athletesResponse.data.reports_submitted
          }
        });
      }

      // Get number of coaches
      const coachesResponse = await axios.get(
        `${API_BASE_URL}/api/admin/all_coaches`
      );
      if (coachesResponse) {
        setCoaches(coachesResponse.data.num_coaches);
      }

      // Get report outcome summary data
      const reportsResponse = await axios.get(
        `${API_BASE_URL}/api/admin/all_reports/?days=7`
      );

      if (reportsResponse) {
        setReportsData(reportsResponse.data.reports_summary);
      }

      const activityResponse = await axios.get(
        `${API_BASE_URL}/api/admin/activity_data`
      );
      if (activityResponse) {
        setActivityData(activityResponse.data.weekly_activity);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (value) => {
    if (athletes === 0) return 0;
    return Math.round((value / athletes) * 100);
  };

  const submittedPercentage = getPercentage(submissionData.submitted.value);

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Admin Dashboard</Text>
      </View>
      <ScrollView
        style={globalStyles.contentContainer}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {loading ? (
          <>
            <SkeletonText height={275} borderRadius={15} />

            <View
              style={{
                flexDirection: "row",
                marginTop: 25,
                alignItems: "center",
                justifyContent: "center",
                gap: 20
              }}
            >
              <SkeletonText height={150} width="45%" borderRadius={15} />
              <SkeletonText height={150} width="45%" borderRadius={15} />
            </View>

            <View style={{ flexdirection: "column", marginTop: 25, gap: 25 }}>
              <SkeletonText height={150} borderRadius={15} />
              <SkeletonText height={350} borderRadius={15} />
              <SkeletonText height={280} borderRadius={15} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.dataContainer}>
              <Text style={styles.dataHeader}>Health Summary</Text>
              <PieChartComponent
                data={healthData}
                centerLabel={"Healthy"}
                centerValue={getPercentage(healthData.healthy.value)}
                numItems={athletes}
              />
            </View>
            <View style={styles.smallDataContainer}>
              <View style={styles.dataContainer}>
                <MaterialCommunityIcons
                  name={"crowd"}
                  size={42}
                  color={"#3ca1ff"}
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.dataValueSmall}>{athletes}</Text>
                <Text style={styles.dataLabelSmall}>Athletes</Text>
              </View>
              <View style={styles.dataContainer}>
                <MaterialCommunityIcons
                  name={"whistle"}
                  size={42}
                  color={"#ff7272"}
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.dataValueSmall}>{coaches}</Text>
                <Text style={styles.dataLabelSmall}>Coaches</Text>
              </View>
            </View>
            <View style={styles.submissionProgressContainer}>
              <Text style={styles.dataHeader}>Today's Submissions</Text>
              <View style={styles.submissionProgressLegend}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: "#3b82f6",
                      marginRight: 5
                    }}
                  />
                  <Text style={styles.dataLabelSmall}>Submitted</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: "#c2c2c2",
                      marginRight: 5
                    }}
                  />
                  <Text style={styles.dataLabelSmall}>Due</Text>
                </View>
              </View>
              <View style={styles.barsContainer}>
                <View
                  style={{
                    width: submittedPercentage + "%",
                    backgroundColor: "#3b82f6",
                    borderRadius: 35,
                    height: 25,
                    overflow: "hidden",
                    marginBottom: 15,
                    position: "absolute",
                    zIndex: 1,
                    justifyContent: "center"
                  }}
                >
                  <Text style={styles.submissionPercentageText}>
                    {submittedPercentage}%
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#c2c2c2",
                    borderRadius: 35,
                    height: 25,
                    overflow: "hidden",
                    marginBottom: 15
                  }}
                />
              </View>
            </View>

            <View style={styles.barChartContainer}>
              <Text style={styles.dataHeader}>Report Outcome Summary</Text>
              <BarChartComponent data={reportsData} />
            </View>

            <View style={styles.dataContainer}>
              <Text style={styles.dataHeader}>Activity</Text>
              <LineChartComponent data={activityData} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dataContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
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
  smallDataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 25,
    gap: 12
  },
  dataHeader: {
    fontFamily: "Rubik",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15
  },
  dataLabelSmall: {
    fontFamily: "Rubik",
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 16
  },
  dataValueSmall: {
    fontFamily: "Rubik",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1f2937"
  },
  submissionProgressContainer: {
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
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
  barsContainer: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    gap: 1
  },
  submissionPercentageText: {
    fontFamily: "Rubik",
    fontSize: 11,
    color: "#fff",
    alignSelf: "flex-end",
    marginRight: 3,
    fontWeight: "bold"
  },
  submissionProgressLegend: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 55,
    alignItems: "center"
  },
  barChartContainer: {
    paddingVertical: 15,
    paddingBottom: 40,
    borderRadius: 15,
    backgroundColor: "#fff",
    marginTop: 25,
    marginBottom: 25,
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
  }
});
