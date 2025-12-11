import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { Card } from "@rneui/base";


export default function AthleteTeamScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.header_text}>Team</Text>
            </View>
            <Card containerStyle={styles.contentContainer}>
                <Text>Your team:</Text>
            </Card>
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
    contentContainer: {
        marginTop: 20,
        width: "100%",
        alignItems: "flex-start",
    }
});