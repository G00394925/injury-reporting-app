import { StyleSheet, Text, View, Image } from 'react-native';
import { Card } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { CardTitle } from '@rneui/base/dist/Card/Card.Title';

SplashScreen.preventAutoHideAsync();

export default function AthleteDashScreen() {
    const [fontsLoaded] = useFonts({
        'Rubik': require('../fonts/Rubik-VariableFont_wght.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.greetings_text}>Hello Macdarach</Text>
            <View style={styles.center_view}>
                <Card containerStyle={styles.lights_card}>
                    <CardTitle style={{ fontSize: 16, textAlign: 'left', color: '#d5d5d5ff', marginBottom: 5 }}>Your Status: Ready to play</CardTitle>
                    <View style={styles.lights_container}>
                        <Image style={styles.light} source={require('../assets/RedLightOff.png')}/>
                        <Image style={styles.light} source={require('../assets/AmberLightOff.png')}/>
                        <Image style={styles.light} source={require('../assets/GreenLightOn.png')}/>
                    </View>
                </Card>
                <View style={styles.info_cards_container}>
                    <Card containerStyle={[styles.info_card, { backgroundColor: '#f1c7f2ff' }]}>
                        <CardTitle style={{ fontSize: 24, textAlign: 'left' }}>6</CardTitle>
                        <Text>Injuries Reported</Text>
                    </Card>
                    <Card containerStyle={[styles.info_card, { backgroundColor: '#faceceff' }]}>
                        <CardTitle style={{ fontSize: 24, textAlign: 'left' }}>142</CardTitle>
                        <Text>Days since your last injury</Text>
                    </Card>
                    <Card containerStyle={[styles.info_card, { backgroundColor: '#b8f3a8ff' }]}>
                        <CardTitle style={{ fontSize: 24, textAlign: 'left' }}>15</CardTitle>
                        <Text>Consecutive Daily Reports</Text>
                    </Card>
                    <Card containerStyle={[styles.info_card, { backgroundColor: '#f0f1b1ff' }]}>
                        <CardTitle style={{ fontSize: 24, textAlign: 'left' }}>16</CardTitle>
                        <Text>Available Athletes</Text>
                    </Card>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontFamily: 'Rubik'
    },
    center_view: {
        flex: 1,
        alignItems: 'center',
    },
    lights_card: {
        padding: 15,
        paddingTop: 5,
        backgroundColor: '#292929ff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lights_container: {
        flexDirection: 'row',
        backgroundColor: '#3d3d3dff',
        borderRadius: 10,
    },
    light: {
        margin: 10,
    },
    info_cards_container: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 5,
        margin: 15
    },
    info_card: {
        padding: 10,
        borderRadius: 10,
        margin: 0
    }
});
