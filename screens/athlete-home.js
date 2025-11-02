import {StyleSheet, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AthleteDashScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.greetings_text}>Hello Macdarach</Text>
            <View style={styles.center_view}>
                <Text>This will be the Athlete's dashboard</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 20,
        paddingLeft: 20
    },
    greetings_text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    center_view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
