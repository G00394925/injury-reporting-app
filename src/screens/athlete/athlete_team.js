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
                <Text style={{ fontWeight: "bold" }}>Club</Text>
                <Text>ATU FC</Text>
            </View>
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
        padding: 15,
        marginTop: -8
    }
});