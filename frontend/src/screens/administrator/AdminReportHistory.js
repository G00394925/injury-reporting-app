import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { API_BASE_URL } from "../../config/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export default function AdminReportHistoryScreen() {
  const [reportData, setReportData] = useState({})
  const [activeFilter, setActiveFilter] = useState("")

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Reports</Text>
      </View>
      <ScrollView style={globalStyles.contentContainer} contentContainerStyle={{ paddingBottom: 100}}>
        <ScrollView style={styles.filtersContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Healthy" && styles.filterButtonActive
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

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "New" && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter("New")}
          >
            <Text 
              style={[
                styles.filterButtonText,
                activeFilter === "New" && styles.filterButtonTextActive
              ]}
            >
              New
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
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  filterButton: {
    padding: 10,
    borderWidth: 1,
    marginHorizontal: 5,
    borderRadius: 25,
    borderColor: '#c2c2c2',
    alignItems: "center"
  },
  filterButtonActive: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#001a79'
  },
  filterButtonText: {
    textAlign: "center",
    fontFamily: "Rubik",
    fontWeight: "bold",
    color: '#6b7280'
  },
  filterButtonTextActive: {
    textAlign: "center",
    fontFamily: "Rubik",
    fontWeight: "bold",
    color: "#fff"
  },
  reportCard: {
    backgroundColor: '#fcfcfc'
  },
})