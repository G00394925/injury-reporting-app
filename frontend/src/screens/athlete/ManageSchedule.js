import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CalendarContainer, CalendarHeader, CalendarBody } from "@howljs/calendar-kit";
import calendarTheme from "../../styles/calendarTheme";
import { globalStyles } from "../../styles/globalStyles";
import { useState, useEffect, useCallback } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { API_BASE_URL } from "../../config/apiConfig";
import axios from "axios";

export default function ManageScheduleScreen() {
  const { uuid, session } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [eventType, setEventType] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventStartTime, setEventStartTime] = useState(new Date());
  const [eventEndTime, setEventEndTime] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [loading, setLoading] = useState(true);
  const toggleSwitch = () => setIsTraining(!isTraining);


  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  // Modal handlers for event creation
  const openModal = () => {
    setEventType(isTraining ? "Training" : "Match");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEventTitle("");
    setEventDate(new Date());
    setEventStartTime(new Date());
    setEventEndTime(new Date());
  };

  // Date and Time picker modals
  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    setEventDate(date);
    hideDatePicker();
  };

  const showStartTimePicker = () => {
    setIsStartTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    setIsStartTimePickerVisible(false);
  };

  const handleStartTimeConfirm = (time) => {
    setEventStartTime(time);
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setIsEndTimePickerVisible(true);
  };

  const hideEndTimePicker = () => {
    setIsEndTimePickerVisible(false);
  };

  const handleEndTimeConfirm = (time) => {
    setEventEndTime(time);
    hideEndTimePicker();
  };

  // Handle new event submission
  const handleSubmit = async () => {
    try {
      // Format dates and times for database
      const formattedDate = eventDate.toISOString().split("T")[0]; // YYYY-MM-DD
      const formattedStartTime = formatTime(eventStartTime);
      const formattedEndTime = formatTime(eventEndTime);

      console.log("Submitting event:", {
        athlete_id: uuid,
        title: eventTitle,
        event_date: formattedDate,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        type: eventType
      });

      const response = await axios.post(`${API_BASE_URL}/api/events/new`, {
        athlete_id: uuid,
        title: eventTitle,
        event_date: formattedDate,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        type: eventType,
        session: session
      });

      console.log("Event created successfully: ", response.data);
      closeModal();
      fetchEvents(); // Refresh the calendar
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error ||
        "Failed to create event. Please try again."
      );
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/events/get/${uuid}`
      );

      if (response.data) {
        console.log("Fetched events: ", response.data);

        // Change events to use calendar format
        const formattedEvents = response.data.map((event) => {
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
            start: { dateTime: startDate.toISOString() },
            end: { dateTime: endDate.toISOString() },
            color: event.type === "Training" ? "#2038be7f" : "#28a74679",
            borderColor: event.type === "Training" ? "#223392" : "#308a45"

          };
        });

        console.log("Formatted events for calendar:", formattedEvents);
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [uuid]);

  const renderEvent = useCallback(
    (event) => (
      <View
        style={{
          width: "100%",
          height: "100%",
          padding: 5,
          backgroundColor: event.color,
          borderRadius: 4,
          borderLeftWidth: 5,
          borderColor: event.borderColor
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 12,
            fontWeight: "bold",
            fontFamily: "Rubik"
          }}
        >
          {event.title}
        </Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Schedule</Text>
      </View>
      <View style={styles.contentContainer}>
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
            scrollToNow={false}
            events={events}
          >
            <CalendarHeader
              LeftAreaComponent={
                <TouchableOpacity
                  onPress={() => openModal()}
                  style={styles.addButton}
                >
                  <MaterialIcons name="add-circle" size={37} color={'#4d4d4d'} />
                </TouchableOpacity>}
            />
            <CalendarBody renderEvent={renderEvent} />
          </CalendarContainer>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            <View style={globalStyles.modalHeader}>
              <Text style={globalStyles.modalTitle}>
                Add Event
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={globalStyles.modalBody}>
              <View style={styles.switchContainer}>
                <Text style={[globalStyles.modalInputLabel, { fontWeight: "bold" }]}>Is this a training session?</Text>
                <Switch
                  onValueChange={toggleSwitch}
                  value={isTraining}
                  trackColor={{ false: '#c6c6c6', true: '#6279fc' }}
                  thumbColor={isTraining ? '#2038be' : '#676767'}
                  ios_backgroundColor={"#3e3e3e"}
                  style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                />
              </View>

              <Text style={globalStyles.modalInputLabel}>Event Title</Text>
              <TextInput
                style={globalStyles.modalInput}
                placeholder="Enter event name"
                value={eventTitle}
                onChangeText={setEventTitle}
              />

              {/* TODO: Add input to get associated team  */}

              <Text style={globalStyles.modalInputLabel}>Date</Text>
              <TouchableOpacity onPress={showDatePicker} style={globalStyles.modalInput}>
                <Text style={globalStyles.modalInputText}>{formatDate(eventDate)}</Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                date={eventDate}
              />

              <Text style={globalStyles.modalInputLabel}>Event Time</Text>
              <View style={styles.timePickerContainer}>
                <TouchableOpacity
                  onPress={showStartTimePicker}
                  style={[globalStyles.modalInput, styles.timeInput]}
                >
                  <Text style={globalStyles.modalInputText}>
                    {formatTime(eventStartTime)}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.timeSeparator}>-</Text>

                <TouchableOpacity
                  onPress={showEndTimePicker}
                  style={[globalStyles.modalInput, styles.timeInput]}
                >
                  <Text style={globalStyles.modalInputText}>
                    {formatTime(eventEndTime)}
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePickerModal
                isVisible={isStartTimePickerVisible}
                mode="time"
                onConfirm={handleStartTimeConfirm}
                onCancel={hideStartTimePicker}
                date={eventStartTime}
                pickerComponentStyleIOS={{ height: 300 }}
              />

              <DateTimePickerModal
                isVisible={isEndTimePickerVisible}
                mode="time"
                onConfirm={handleEndTimeConfirm}
                onCancel={hideEndTimePicker}
                date={eventEndTime}
                pickerComponentStyleIOS={{ height: 300 }}
              />
            </ScrollView>

            <View style={globalStyles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Add Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginRight: 10,
    padding: 5
  },
  calendarView: {
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 0,
    marginBottom: 10,
    borderColor: "#ccccccff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3
  },
  contentContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    padding: 5,
    marginTop: -8,
    marginBottom: -10
  },
  addButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  switchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: -5
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  timeInput: {
    flex: 1
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
    fontFamily: "Rubik"
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
    alignItems: "center"
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Rubik",
    color: "#666"
  },
  submitButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#1d3adfff",
    alignItems: "center"
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Rubik",
    color: "#ffffff"
  }
});
