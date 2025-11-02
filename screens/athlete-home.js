import {StyleSheet, Text, View, Image} from 'react-native';
import { Card } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AthleteDashScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.greetings_text}>Hello Macdarach</Text>
            <View style={styles.center_view}>
                <Card containerStyle={styles.card}>
                    <View style={styles.lights_container}>
                        <Image style={styles.light} source={require('../assets/RedLightOff.png')}/>
                        <Image style={styles.light} source={require('../assets/AmberLightOff.png')}/>
                        <Image style={styles.light} source={require('../assets/GreenLightOn.png')}/>
                    </View>
                </Card>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        margin: 10,
    },
    greetings_text: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 10,
        marginBottom: 20,
    },
    center_view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        padding: 20,
        backgroundColor: '#383838ff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lights_container: {
        flexDirection: 'row'
    },
    light: {
        margin: 10,
    }
});
