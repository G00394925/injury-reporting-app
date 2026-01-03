import { Text, StyleSheet, View, Button } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { Card } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";


export default function AthleteTeamScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.header_text}>Team</Text>
            </View>
            <View style={styles.contentContainer}>
                <View>
                    <Text style={styles.clubTitle}>Club</Text>
                    <Text style={styles.clubText}>ATU FC</Text>
                </View>
                <View style={styles.detailContainer}>
                    <View style={styles.detail}>
                        <Text style={styles.detailTitle}>Name: </Text>
                        <Text style={styles.detailText}>Macdarach Carty Joyce</Text>
                    </View>
                     <View style={styles.detail}>
                        <Text style={styles.detailTitle}>Coach: </Text>
                        <Text style={styles.detailText}>John Coach</Text>
                    </View>
                    <View style={styles.detail}>
                        <Text style={styles.detailTitle}>Sport: </Text>
                        <Text style={styles.detailText}>Soccer</Text>
                    </View>
                </View>
            </View>
            <Button title="Choose team" onPress={() => {navigation.navigate("ClubSetup")}} />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        padding: 20,
        marginTop: -8
    },
    clubTitle: {
        fontWeight: "bold",
        fontFamily: "Rubik",
        fontSize: 22,
    },
    clubText: {
        fontFamily: "Rubik",
        fontSize: 28,
        marginTop: 5
    },
    detailContainer: {
        marginTop: 20,
    },
    detail: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderColor: "#cccccc",
        borderBottomWidth: 1,
        paddingVertical: 20
    },
    detailTitle: {
        fontSize: 16,
        color: "#707070ff",
    },
    detailText: {
        fontSize: 16,
        color: "#292929ff",

    }
});