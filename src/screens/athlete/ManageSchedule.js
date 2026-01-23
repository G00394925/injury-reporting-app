import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CalendarContainer, CalendarHeader, CalendarBody } from "@howljs/calendar-kit";
import calendarTheme from "../../styles/calendar_theme";
import { globalStyles } from "../../styles/globalStyles";
import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { API_BASE_URL } from "../../config/api_config";
import axios from "axios";


export default function ManageScheduleScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { uuid } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [eventType, setEventType] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventStartTime, setEventStartTime] = useState(new Date());
    const [eventEndTime, setEventEndTime] = useState(new Date());
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Modal handlers for event creation
    const openModal = (type) => {
        setEventType(type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEventTitle('');
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
            const formattedDate = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
            const formattedStartTime = formatTime(eventStartTime);
            const formattedEndTime = formatTime(eventEndTime);

            console.log('Submitting event:', { 
                athlete_id: uuid,
                title: eventTitle,
                event_date: formattedDate,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
                type: eventType,
            });

            const response = await axios.post(`${API_BASE_URL}/api/event/create`, {
                athlete_id: uuid,
                title: eventTitle,
                event_date: formattedDate,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
                type: eventType,
            });

            console.log('Event created successfully: ', response.data);
            Alert.alert('Success', 'Event created successfully');
            closeModal();
        } catch (error) {
            console.error('Error creating event:', error);
            Alert.alert(
                'Error', 
                error.response?.data?.error || 'Failed to create event. Please try again.'
            );
        }
    };

    return (
        <SafeAreaView style={globalStyles.container} edges={["top"]}>
            <View style={globalStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={globalStyles.headerText}>Manage Schedule</Text>
            </View>
            <ScrollView style={globalStyles.contentContainer}>
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
                        scrollByDay >
                            
                        <CalendarHeader />
                        <CalendarBody />
                    </CalendarContainer>    
                </View>
                
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => openModal('Training')}>
                        <MaterialIcons name="fitness-center" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Add Training Session</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={() => openModal('Match')}>
                        <MaterialIcons name="sports-soccer" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Add Match/Game</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Add {eventType === 'training' ? 'Training Session' : 'Match/Game'}
                            </Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Ionicons name="close" size={28} color="#333" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Event Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter event name"
                                value={eventTitle}
                                onChangeText={setEventTitle}
                            />
                            
                            <Text style={styles.inputLabel}>Date</Text>
                            <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                                <Text style={styles.inputText}>{formatDate(eventDate)}</Text>
                            </TouchableOpacity>
                            
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleDateConfirm}
                                onCancel={hideDatePicker}
                                date={eventDate}
                            />

                            <Text style={styles.inputLabel}>Event Time</Text>
                            <View style={styles.timePickerContainer}>
                                <TouchableOpacity onPress={showStartTimePicker} style={[styles.input, styles.timeInput]}>
                                    <Text style={styles.inputText}>{formatTime(eventStartTime)}</Text>
                                </TouchableOpacity>

                                <Text style={styles.timeSeparator}>-</Text>

                                <TouchableOpacity onPress={showEndTimePicker} style={[styles.input, styles.timeInput]}>
                                    <Text style={styles.inputText}>{formatTime(eventEndTime)}</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <DateTimePickerModal
                                isVisible={isStartTimePickerVisible}
                                mode="time"
                                onConfirm={handleStartTimeConfirm}
                                onCancel={hideStartTimePicker}
                                date={eventStartTime}
                            />
                            
                            <DateTimePickerModal
                                isVisible={isEndTimePickerVisible}
                                mode="time"
                                onConfirm={handleEndTimeConfirm}
                                onCancel={hideEndTimePicker}
                                date={eventEndTime}
                            />
                        </ScrollView>
                        
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Add Event</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    backButton: {
        marginRight: 10,
        padding: 5,
    },
    calendarView: {
        height: 430,
        marginTop: 10,
        justifyContent: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ccccccff",
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    actionsContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: "#1d3adfff",
        padding: 18,
        borderRadius: 12,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    secondaryButton: {
        backgroundColor: "#28a745",
    },
    actionButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Rubik",
        marginLeft: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        width: '90%',
        maxHeight: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Rubik',
        color: '#333',
    },
    modalBody: {
        padding: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Rubik',
        color: '#333',
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d0d0d0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Rubik',
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
    },
    inputText: {
        fontSize: 16,
        fontFamily: 'Rubik',
        color: '#333',
    },
    timePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeInput: {
        flex: 1,
    },
    timeSeparator: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
        fontFamily: 'Rubik',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Rubik',
        color: '#666',
    },
    submitButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#1d3adfff',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Rubik',
        color: '#ffffff',
    },
})