import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View, Button } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { Card } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";


export default function AthleteTeamScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.header_text}>Team</Text>
            </View>
            <Card containerStyle={styles.card}>
                <Card.Title style={styles.cardTitle}>Club</Card.Title>
                <Text style={styles.cardText}>ATU FC</Text>
            </Card>
            <Card containerStyle={styles.card}>
                <Card.Title style={styles.cardTitle}>Coach</Card.Title>
                <Text style={styles.cardText}>John Doe</Text>
            </Card>
            <Card containerStyle={styles.card}>
                <Card.Title style={styles.cardTitle}>Sport</Card.Title>
                <Text style={styles.cardText}>Rugby</Text>
            </Card>
            <Button title="Change club details" onPress={() => navigation.navigate('ClubSetup')} />
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        margin: 15,
    },
    card: {
        width: "100%",
        borderRadius: 10,
        padding: 15,
        backgroundColor: "#ffffffff",
    },
    cardTitle: {
        fontSize: 16,
        padding: 5,
        borderRadius: 5,
        color: '#ffffffff',
        fontFamily: "Rubik",
        backgroundColor: '#0ea3d9ff'
    },
    cardText: {
        padding: 5,
        fontSize: 18,
        borderRadius: 5,
        fontFamily: "Rubik",
        alignSelf: "center"
    }
});