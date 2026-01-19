import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CalendarContainer, CalendarHeader, CalendarBody } from "@howljs/calendar-kit";
import calendarTheme from "../../styles/calendar_theme";
import { globalStyles } from "../../styles/globalStyles";


export default function ManageScheduleScreen() {
    const navigation = useNavigation();
    const { uuid } = useAuth();

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={globalStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={globalStyles.header_text}>Manage Schedule</Text>
            </View>
            <ScrollView style={globalStyles.content_container}>
                <View style={styles.calendar_view}>
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
                    <TouchableOpacity style={styles.actionButton} onPress={() => { /* Add training session */ }}>
                        <MaterialIcons name="fitness-center" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Add Training Session</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={() => { /* Add match */ }}>
                        <MaterialIcons name="sports-soccer" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Add Match/Game</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#001a79",
    },
    backButton: {
        marginRight: 10,
        padding: 5,
    },
    contentContainer: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        padding: 20,
        marginTop: -8,
    },
    calendar_view: {
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
})