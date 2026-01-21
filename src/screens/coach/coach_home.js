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
                <Text style={[globalStyles.header_text, {alignContent: "flex-start"}]}>Hello Macdarach</Text>
            </View>
            <ScrollView style={globalStyles.content_container}>
                <Card containerStyle={styles.overview_card}>
                    <Card.Title style={styles.stats_card_title}>Team Overview</Card.Title>
                    <Text style={styles.overview_text}>Athletes require your attention</Text>
                </Card>
                <View style={styles.stats_cards_container}>
                    <Card containerStyle={styles.stats_card}>
                        <Card.Title style={styles.stats_card_title}>Healthy</Card.Title>
                        <Text style={styles.stats_text}>5</Text>
                    </Card>
                    <Card containerStyle={styles.stats_card}>
                        <Card.Title style={styles.stats_card_title}>Injured</Card.Title>
                        <Text style={styles.stats_text}>3</Text>
                    </Card>
                    <Card containerStyle={styles.stats_card}>
                        <Card.Title style={styles.stats_card_title}>Not Reported</Card.Title>
                        <Text style={styles.stats_text}>12</Text>
                    </Card>
                    <Card containerStyle={styles.stats_card}>
                        <Card.Title style={styles.stats_card_title}>Total</Card.Title>
                        <Text style={styles.stats_text}>20</Text>
                    </Card>
                </View>
                <View style={styles.schedule_container}>
                    <Text style={{fontFamily: "Rubik", fontSize: 18, fontWeight: "bold"}}>
                        Team Schedule
                    </Text>
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
    stats_cards_container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 15,
        marginHorizontal: 0,
    },
    stats_card: {
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 0,
        width: "48%",
    },
    stats_card_title: {
        color: "#464646ff",
        fontSize: 14,
        fontFamily: "Rubik",
        alignSelf: "flex-start"
    },
    stats_text: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "Rubik",

    },
    overview_card: {
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
    overview_text: {
        fontSize: 20,
        fontFamily: "Rubik",
    },
    schedule_container: {
        flex: 1,
        marginTop: 30
    },
    calendar_view: {
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