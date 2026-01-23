import { Card } from "@rneui/base";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarContainer, CalendarHeader, CalendarBody } from "@howljs/calendar-kit";
import calendarTheme from "../../styles/calendar_theme";

export default function CoachDashScreen() {
    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={globalStyles.header}>
                <Text style={[globalStyles.headerText, {alignContent: "flex-start"}]}>Hello Macdarach</Text>
            </View>
            <ScrollView style={globalStyles.contentContainer}>
                <Card containerStyle={styles.overviewCard}>
                    <Card.Title style={styles.statsCardTitle}>Team Overview</Card.Title>
                    <Text style={styles.overviewText}>Athletes require your attention</Text>
                </Card>
                <View style={styles.statsCardContainer}>
                    <Card containerStyle={styles.statsCard}>
                        <Card.Title style={styles.statsCardTitle}>Healthy</Card.Title>
                        <Text style={styles.statsText}>5</Text>
                    </Card>
                    <Card containerStyle={styles.statsCard}>
                        <Card.Title style={styles.statsCardTitle}>Injured</Card.Title>
                        <Text style={styles.statsText}>3</Text>
                    </Card>
                    <Card containerStyle={styles.statsCard}>
                        <Card.Title style={styles.statsCardTitle}>Not Reported</Card.Title>
                        <Text style={styles.statsText}>12</Text>
                    </Card>
                    <Card containerStyle={styles.statsCard}>
                        <Card.Title style={styles.statsCardTitle}>Total</Card.Title>
                        <Text style={styles.statsText}>20</Text>
                    </Card>
                </View>
                <View style={styles.scheduleContainer}>
                    <Text style={{fontFamily: "Rubik", fontSize: 18, fontWeight: "bold"}}>
                        Team Schedule
                    </Text>
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
                            scrollByDay
                            >
                            <CalendarHeader />
                            <CalendarBody />
                        </CalendarContainer>    
                    </View>    
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
    statsCardContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 15,
        marginHorizontal: 0,
    },
    statsCard: {
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 0,
        width: "48%",
    },
    statsCardTitle: {
        color: "#464646ff",
        fontSize: 14,
        fontFamily: "Rubik",
        alignSelf: "flex-start"
    },
    statsText: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "Rubik",

    },
    overviewCard: {
        padding: 20,
        backgroundColor: "#ffffffff",
        borderRadius: 10,
        margin: 10,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    overviewText: {
        fontSize: 20,
        fontFamily: "Rubik",
    },
    scheduleContainer: {
        flex: 1,
        marginTop: 30
    },
    calendarView: {
        height: 300,
        marginTop: 10,
        justifyContent: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ccccccff",
        borderRadius: 10,
        marginBottom: 50
    }
});