import { StyleSheet, Text, View } from 'react-native';

export default function ReportScreen() {
    return (
        <View style={styles.container}>
            <Text>This is the Report Screen!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
