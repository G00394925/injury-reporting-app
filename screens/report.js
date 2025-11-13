import { StyleSheet, Text, View } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

export default function ReportScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>This is the Report Screen!</Text>
      <Button
        title="(dev) Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
