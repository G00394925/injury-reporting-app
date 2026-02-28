import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, StyleSheet, View } from "react-native";
import { Button } from "@rneui/base";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../config/api_config";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../styles/globalStyles";

export default function TeamCreatorScreen() {
  const [team_name, setTeamName] = useState(null);
  const [sport, setSport] = useState(null);
  const { uuid, userData } = useAuth();
  const navigation = useNavigation();

  const handleCreateTeam = async () => {
    if (team_name && sport) {
      const response = await axios.post(`${API_BASE_URL}/api/teams/new`, {
        team_name: team_name,
        sport: sport,
        coach_id: uuid
      });

      console.log("Team created:", response.data);
      navigation.navigate("MainApp");
    } else {
      console.log("Please fill in all fields");
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Create New Team</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>Enter team name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Team Name"
          value={team_name}
          onChangeText={setTeamName}
        />

        <Text style={styles.label}>What sport will your team be playing?</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Sport"
          value={sport}
          onChangeText={setSport}
        />

        <Button title="Create Team" onPress={handleCreateTeam} />
        <Button title="Go back" onPress={navigation.goBack} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: "Rubik",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10
  },
  contentContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    padding: 20,
    marginTop: -8
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginVertical: 10,
    borderRadius: 15
  }
});
