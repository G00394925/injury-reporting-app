import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';

export default function RegisterScreen() {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const onChange = (event, selectedDate) => {
        setOpen(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontSize: 42, fontWeight: 'bold'}}>Sign up</Text>
            <View style={styles.text_box_container}>
                <TextInput
                    style={styles.text_box}
                    placeholder="Email" 
                />
                <TextInput
                    style={styles.text_box}
                    placeholder="Password"
                />
                <TextInput
                    style={styles.text_box}
                    placeholder="Confirm Password" 
                />
                
                <Button title="Select Date of Birth" onPress={() => setOpen(true)} />
                <Text>Selected: {date.toLocaleDateString()}</Text>

                {open && (
                    <DatePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}                    
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 65,
        marginBottom: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text_box_container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 20,
    },
    text_box: {
        padding: 15,
        borderRadius: 30,
        backgroundColor: '#ffffffff',
        width: '90%',
        marginBottom: 20,
        borderColor: '#1d65ecff',
        borderWidth: 0.5,
        shadowColor: '#0d0d0edd',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 3.25,
        elevation: 5,
    }
});