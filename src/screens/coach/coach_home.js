import { Card } from "@rneui/base";
import { View, Text, StyleSheet } from "react-native";

export default function CoachDashScreen() {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.greetings_text}>Hello Macdarach</Text>
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
        paddingTop: 20,
        margin: 15,
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
        marginTop: 20,
        marginHorizontal: 10,
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
        margin: 10
    },
    overview_text: {
        fontSize: 20,
        fontFamily: "Rubik",
    }
});