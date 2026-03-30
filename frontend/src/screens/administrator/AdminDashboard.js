import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../styles/globalStyles";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { API_BASE_URL } from "../../config/apiConfig";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function AdminDashScreen() {
  const [reports, setReports] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [teams, setTeams] = useState([]);

  const getData = async () => {
    try {
      const reportsResponse = await axios.get(`${API_BASE_URL}/api/reports/`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Admin Dashboard</Text>
      </View>
      <View style={globalStyles.contentContainer}>
        <Text>Admin functionalities will be implemented here.</Text>
      </View>
    </SafeAreaView>
  );
}