import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { API_BASE_URL } from "../../config/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import ReportCard from "../../components/ReportCard";

export default function AdminReportHistoryScreen() {
  const [reportData, setReportData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  const getReports = async () => {
    try {
      const reportsResponse = await axios.get(
        `${API_BASE_URL}/api/admin/all_reports/?days=30`
      );
      const followupResponse = await axios.get(
        `${API_BASE_URL}/api/admin/all_followup_reports/?days=30`
      );

      if (reportsResponse && followupResponse) {
        const normalReports = reportsResponse.data.reports || [];
        const followupReports = followupResponse.data.followups || [];

        // Add type flag for filtering
        const reportsWithType = normalReports.map((r) => ({
          ...r,
          report_type: "normal"
        }));
        const followupsWithType = followupReports.map((r) => ({
          ...r,
          report_type: "followup"
        }));

        const allReports = [...reportsWithType, ...followupsWithType];

        allReports.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setReportData(allReports);
        setFilteredReports(allReports);
      }
    } catch (error) {
      console.error("Error fetching report data: ", error);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [activeFilter]);

  const applyFilter = () => {
    if (activeFilter === "") {
      setFilteredReports(reportData);
    } else {
      let filtered = reportData;

      // Filter by health status
      if (["Healthy", "At Risk", "Injured"].includes(activeFilter)) {
        if (activeFilter === "Healthy") {
          filtered = filtered.filter((r) => 
            r.new_availability === "Healthy" || 
            r.new_availability === "Fully available");
        } else {
          const statusMap = {
            "At Risk": "No competing",
            "Injured": "No training or competing"
          };
          const targetStatus = statusMap[activeFilter];
          filtered = filtered.filter((r) => r.new_availability === targetStatus);
        }
      }

      // Filter by report type
      if (activeFilter === "Initial") {
        filtered = filtered.filter((r) => r.report_type === "normal");
      } else if (activeFilter === "Follow Up") {
        filtered = filtered.filter((r) => r.report_type === "followup");
      }

      setFilteredReports(filtered);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Reports</Text>
      </View>
      <View style={globalStyles.contentContainer}>
        <ScrollView
          style={styles.filtersContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingRight: 20
          }}
        >
          <TouchableOpacity
            style={styles.clearFilterButton}
            onPress={() => setActiveFilter("")}
          >
            <Ionicons name="close" size={20} color={"#6b7280"} />
          </TouchableOpacity>

          <Text style={styles.filterCategoryText}>Outcome</Text>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Healthy" && styles.filterButtonActive,
              { marginLeft: 15 }
            ]}
            onPress={() => setActiveFilter("Healthy")}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === "Healthy" && styles.filterButtonTextActive
              ]}
            >
              Healthy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "At Risk" && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter("At Risk")}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === "At Risk" && styles.filterButtonTextActive
              ]}
            >
              At Risk
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Injured" && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter("Injured")}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === "Injured" && styles.filterButtonTextActive
              ]}
            >
              Injured
            </Text>
          </TouchableOpacity>

          <Text style={styles.filterCategoryText}>Type</Text>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Initial" && styles.filterButtonActive,
              { marginLeft: 15 }
            ]}
            onPress={() => setActiveFilter("Initial")}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === "Initial" && styles.filterButtonTextActive
              ]}
            >
              Initial
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Follow Up" && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter("Follow Up")}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === "Follow Up" && styles.filterButtonTextActive
              ]}
            >
              Follow Up
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <FlatList
          data={filteredReports}
          renderItem={({ item }) => (
            <ReportCard
              report={item}
              isFollowUp={item.report_type === "followup"}
            />
          )}
          keyExtractor={(item, index) => `${item.athlete_id}-${index}`}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reports found</Text>
            </View>
          }
          style={{
            marginTop: 10,
            borderTopWidth: 1,
            borderColor: "#e5e7eb"
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flex: 0,
    maxHeight: 43,
    paddingBottom: 5
  },
  filterCategoryText: {
    fontFamily: "Rubik",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    color: "#6b7280",
    borderRightWidth: 1,
    marginLeft: 15,
    paddingRight: 10,
    borderColor: "#e5e7eb"
  },
  clearFilterButton: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 30,
    marginRight: 8,
    borderColor: "#c2c2c2",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    maxHeight: 38
  },
  filterButton: {
    paddingHorizontal: 10,
    borderWidth: 1,
    marginHorizontal: 5,
    borderRadius: 25,
    borderColor: "#c2c2c2",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    maxHeight: 38
  },
  filterButtonActive: {
    paddingHorizontal: 10,
    borderWidth: 1,
    marginHorizontal: 5,
    borderRadius: 25,
    borderColor: "#ffffff",
    backgroundColor: "#001a79",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    maxHeight: 38
  },
  filterButtonText: {
    textAlign: "center",
    fontFamily: "Rubik",
    fontWeight: "bold",
    color: "#6b7280"
  },
  filterButtonTextActive: {
    textAlign: "center",
    fontFamily: "Rubik",
    fontWeight: "bold",
    color: "#fff"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50
  },
  emptyText: {
    fontFamily: "Rubik",
    fontSize: 16,
    color: "#9ca3af"
  }
});
