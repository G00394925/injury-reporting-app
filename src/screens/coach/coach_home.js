import { Card } from "@rneui/base";
import { View, Text, StyleSheet } from "react-native";
import { globalStyles } from "../../styles/globalStyles";

export default function CoachDashScreen() {
    return (
        <View style={styles.container}>
            <View style={[globalStyles.header, {paddingBottom: 100}]}>
                <Text style={[globalStyles.header_text, {alignContent: "flex-start"}]}>Hello Macdarach</Text>
            </View>
            <View style={styles.contentContainer}>
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
                <Card>
                    <Text>TIMETABLE</Text>
                </Card>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    contentContainer: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        padding: 20,
        marginTop: -8
    },
    greetings_text: {
        alignItems: "flex-start",
        fontSize: 20,
        fontWeight: "bold",
        paddingLeft: 10,
        marginBottom: 20,
        fontFamily: "Rubik",
    },
    stats_cards_container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 60,
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
        position: "fixed",
        top: 92,
        alignSelf: "center",
        shadowOffset: { width: 0, height: 5 },
    },
    overview_text: {
        fontSize: 20,
        fontFamily: "Rubik",
    }
});