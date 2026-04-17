import { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { CalendarContainer, CalendarBody, CalendarHeader } from "@howljs/calendar-kit";
import calendarTheme from "../../styles/calendarTheme";
import { globalStyles } from "../../styles/globalStyles";
import apiClient from "../../config/apiConfig";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AthleteViewerScreen({ route }) {
  const { athlete } = route.params;
  const [loading, setLoading] = useState(true);
  const [athleteEvents, setAthleteEvents] = useState([]);
  const navigation = useNavigation();

  const fetchAthleteEvents = async () => {
    try {
      const response = await apiClient.get(`/api/events/get/${athlete.athlete_id}`);

      if (response.data) {
        const formattedEvents = response.data.map(event => {
          const eventDate = new Date(event.event_date);
          const [startHour, startMinute] = event.start_time.split(":");
          const [endHour, endMinute] = event.end_time.split(":");

          const startDate = new Date(eventDate);
          startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

          const endDate = new Date(eventDate);
          endDate.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

          return {
            id: event.event_id.toString(),
            title: event.title,
            sport: event.sport,
            start: { dateTime: startDate.toISOString() },
            end: { dateTime: endDate.toISOString() },
            color: event.type === "Training" ? "#2038be7f" : "#28a74679",
            borderColor: event.type === "Training" ? "#223392" : "#308a45"
          };
        });
        setAthleteEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error fetching events: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAthleteEvents();
  }, [athlete.athleteId]);

  const renderEvent = useCallback((event) => (
    <View style={{
      width: "100%",
      height: "100%",
      padding: 5,
      backgroundColor: event.color,
      borderLeftColor: event.borderColor,
      borderLeftWidth: 5,
      borderRadius: 4
    }}
    >
      <Text style={{
        color: "#ffffff",
        fontSize: 13,
        fontWeight: "bold",
        fontFamily: "Rubik"
      }}
      >
        {event.title}
      </Text>
      <Text style={{
        color: "#fff",
        fontSize: 12,
        fontFamily: "Rubik"
      }}
      >
        {event.sport}
      </Text>
    </View>
  ), []
  );

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>{athlete.name.split(" ")[0]}'s Schedule</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.calendarView}>
          <CalendarContainer
            theme={calendarTheme}
            numberOfDays={4}
            hourWidth={50}
            timeInterval={60}
            start={480}
            end={1380}
            initialTimeIntervalHeight={60}
            allowPinchToZoom={true}
            scrollByDay
            scrollToNow={true}
            events={athleteEvents}
          >
            <CalendarHeader />
            <CalendarBody renderEvent={renderEvent} />
          </CalendarContainer>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calendarView: {
    height: 630,
    marginTop: 0,
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccccccff",
    borderRadius: 10,
  },
  backButton: {
    marginRight: 10,
    padding: 5
  },
  contentContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    padding: 5,
    marginTop: -8,
    marginBottom: -10
  }
});