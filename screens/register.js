import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Button } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const [userType, setUserType] = useState("athlete");
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 42, fontWeight: "bold" }}>Sign up</Text>
      <View style={styles.text_box_container}>
        <Text style={styles.dob_text}>I am a: </Text>
        <View style={styles.type_container}>
          <TouchableOpacity
            style={[
              styles.type_button,
              userType === "athlete" && styles.type_active,
            ]}
            onPress={() => setUserType("athlete")}
          >
            <Text
              style={[
                styles.type_text,
                userType === "athlete" && styles.type_text_active,
              ]}
            >
              Athlete
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.type_button,
              userType === "coach" && styles.type_active,
            ]}
            onPress={() => setUserType("coach")}
          >
            <Text
              style={[
                styles.type_text,
                userType === "coach" && styles.type_text_active,
              ]}
            >
              Coach
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput style={styles.text_box} placeholder="Full Name" />
        <TextInput style={styles.text_box} placeholder="Email" />
        <TextInput style={styles.text_box} placeholder="Password" />
        <TextInput style={styles.text_box} placeholder="Confirm Password" />

        <Text style={styles.dob_text}>Please enter your date of birth</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          <TextInput
            style={[styles.dob_box, { flex: 1 }]}
            placeholder="DD"
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={[styles.dob_box, { flex: 1 }]}
            placeholder="MM"
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={[styles.dob_box, { flex: 1.5 }]}
            placeholder="YYYY"
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
      </View>

      <Button 
        title="Register" 
        buttonStyle={styles.register_button} 
        containerStyle={{ width: '90%', marginTop: 20 }} 
        onPress={() => {
          navigation.navigate('MainApp')
        }}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 65,
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text_box_container: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 40,
    width: "100%",
    paddingHorizontal: 20,
  },
  text_box: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: "#ffffffff",
    width: "90%",
    marginBottom: 20,
    borderColor: "#1d65ecff",
    borderWidth: 0.5,
    shadowColor: "#0d0d0edd",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.25,
    elevation: 5,
    fontSize: 16,
  },
  dob_box: {
    flex: 1,
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 5,
    backgroundColor: "#ffffffff",
    borderColor: "#1d65ecff",
    borderWidth: 0.5,
    shadowColor: "#0d0d0edd",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.25,
    elevation: 5,
    fontSize: 16,
    textAlign: "center",
  },
  dob_text: {
    width: "90%",
    marginBottom: 10,
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
  },
  type_container: {
    flexDirection: "row",
    width: "90%",
    marginBottom: 20,
    borderRadius: 30,
    borderColor: "#1d65ecff",
    borderWidth: 0.5,
    overflow: "hidden",
  },
  type_button: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    backgroundColor: "#ffffffff",
    justifyContent: "center",
  },
  type_active: {
    backgroundColor: "#1d65ecff",
  },
  type_text: {
    fontSize: 16,
    color: "#1d65ecff",
  },
  type_text_active: {
    color: "#ffffffff",
    fontWeight: "bold",
  },
});
