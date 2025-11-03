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
                <Card containerStyle={styles.card}>
                    <View style={styles.lights_container}>
                        <Image style={styles.light} source={require('../assets/RedLightOff.png')}/>
                        <Image style={styles.light} source={require('../assets/AmberLightOff.png')}/>
                        <Image style={styles.light} source={require('../assets/GreenLightOn.png')}/>
                    </View>
                </Card>
                <View style={styles.info_cards_container}>
                    <Card containerStyle={styles.info_card}>
                        <CardTitle style={{ fontSize: 24, textAlign: 'left' }}>3</CardTitle>
                        <Text>Injuries Reported</Text>
                    </Card>
                    <Card containerStyle={styles.info_card}>
                        <CardTitle style={{ fontSize: 24, textAlign: 'left' }}>3</CardTitle>
                        <Text>Injuries Reported</Text>
                    </Card>
                    <Card containerStyle={styles.info_card}>
                        <CardTitle style={{ fontSize: 24, textAlign: 'left' }}>3</CardTitle>
                        <Text>Injuries Reported</Text>
                    </Card>
                    <Card containerStyle={styles.info_card}>
                        <CardTitle style={{ fontSize: 24, textAlign: 'left' }}>3</CardTitle>
                        <Text>Injuries Reported</Text>
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
        justifyContent: 'center',
    },
    card: {
        padding: 15,
        backgroundColor: '#292929ff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lights_container: {
        flexDirection: 'row'
    },
    light: {
        margin: 10,
    },
    info_cards_container: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 5,
        marginTop: 20
    },
    info_card: {
        padding: 15,
        backgroundColor: '#aceeffff',
        borderRadius: 10,
        margin: 0
    }

});
