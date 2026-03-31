import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../styles/globalStyles";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { PieChart } from "react-native-gifted-charts"
import { API_BASE_URL } from "../../config/apiConfig";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdminDashScreen() {
  const [reports, setReports] = useState([]);
  const [athletes, setAthletes] = useState(0);
  const [healthy, setHealthy] = useState(0);
  const [atRisk, setAtRisk] = useState(0);
  const [injured, setInjured] = useState(0);
  const [coaches, setCoaches] = useState(0);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getData();

  }, [])
  
  const getData = async () => {
    try {
      const athletesResponse = await axios.get(`${API_BASE_URL}/api/admin/all_athletes`);
      if (athletesResponse) {
        setAthletes(athletesResponse.data.num_athletes)
        setHealthy(athletesResponse.data.healthy)
        setAtRisk(athletesResponse.data.at_risk)
        setInjured(athletesResponse.data.injured)
      }

      const coachesResponse = await axios.get(`${API_BASE_URL}/api/admin/all_coaches`);
      if (coachesResponse) {
        setCoaches(coachesResponse.data.num_coaches);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const getPercentage = (value) => {
    return Math.round((value / athletes) * 100)
  }
  
  const pieData = [
    {value: getPercentage(healthy), color: '#10b981'}, 
    {value: getPercentage(atRisk), color: '#f59e0b'},
    {value: getPercentage(injured), color: '#ef4444'}
  ]

  const renderDot = color => {
    return (
      <View 
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
          marginLeft: 15   
        }}
      />
    )
  }

  const renderLegendComponent = () => {
    return (
      <>
        <View 
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
            marginTop: 15
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              marginRight: 20,
              alignItems: 'center',
            }}>
              {renderDot('#10b981')}
              <Text style={styles.legendText}>Healthy: {getPercentage(healthy)}%</Text>
              {renderDot('#f59e0b')}
              <Text style={styles.legendText}>At Risk: {getPercentage(atRisk)}%</Text>
              {renderDot('#ef4444')}
              <Text style={styles.legendText}>Injured: {getPercentage(injured)}%</Text>
            </View>
        </View>
      </>
    )
  }
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Admin Dashboard</Text>
      </View>
      <ScrollView style={globalStyles.contentContainer} contentContainerStyle={{paddingBottom: 75}}>
        <View style={styles.dataContainer}>
          <Text style={styles.dataHeader}>Health Summary</Text>
          <PieChart
            data={pieData}
            donut
            sectionAutoFocus
            showGradient
            isAnimated
            radius={100}
            innerRadius={55}
            centerLabelComponent={() => {
              return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.focusPercentage}>{getPercentage(healthy)}%</Text>
                  <Text style={styles.focusLabel}>Healthy</Text>
                </View>
              )}}
            />
        {renderLegendComponent()}
        </View>
        <View style={styles.smallDataContainer}>
          <View style={styles.dataContainer}>
            <MaterialCommunityIcons name={"crowd"} size={42} color={'#3ca1ff'} style={{marginBottom: 8}} />
            <Text style={styles.dataValueSmall}>{athletes}</Text>
            <Text style={styles.dataLabelSmall}>Athletes</Text>
          </View>
          <View style={styles.dataContainer}>
            <MaterialCommunityIcons name={"whistle"} size={42} color={'#ff7272'} style={{marginBottom: 8}} />
            <Text style={styles.dataValueSmall}>{coaches}</Text>
            <Text style={styles.dataLabelSmall}>Coaches</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dataContainer: {
    flex: 1,
    padding: 15,
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
    gap: 12,
  },
  dataHeader: {
    fontFamily: "Rubik",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 15
  },
  legendText: {
    fontFamily: 'Rubik',
    fontSize: 14,
  },
  focusPercentage: {
    fontFamily: "Rubik",
    fontSize: 22,
    fontWeight: "bold"
  },
  focusLabel: {
    fontFamily: "Rubik",
    fontSize: 16
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
  }
})