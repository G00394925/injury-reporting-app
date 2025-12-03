import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const SLIDER_WIDTH = screenWidth - 60;

export default function RpeSlider() {
  const [value, setValue] = useState(0);

  const getColor = () => {
    const interpolate = (start, end) => {
      let k = value / 10;
      return Math.ceil((1 - k) * start + k * end) % 256;
    };
    let r = interpolate(0, 255);
    let g = interpolate(200, 0);
    let b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getIcon = () => {
    if (value <= 2) return "sentiment-very-satisfied";
    if (value <= 4) return "sentiment-satisfied";
    if (value <= 6) return "sentiment-neutral";
    if (value <= 8) return "sentiment-dissatisfied";
    return "sentiment-very-dissatisfied";
  };

  const getLabel = () => {
    if (value <= 2) return "Very Little Exertion";
    if (value <= 4) return "Light Activity";
    if (value <= 6) return "Moderate";
    if (value <= 8) return "Intense";
    return "Very Intense";
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={getIcon()} size={70} color={getColor()} />
      </View>
      <Slider
        style={{ width: SLIDER_WIDTH, height: 40 }}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor={"black"}
        maximumTrackTintColor="#afafafff"
        thumbTintColor={getColor()}
      />
      <View style={styles.labelsContainer}>
        <Text style={styles.labelText}>0</Text>
        <Text style={styles.labelText}>5</Text>
        <Text style={styles.labelText}>10</Text>
      </View>
      <Text style={styles.rpe_label}>{getLabel()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  iconContainer: {
    marginBottom: 15,
  },
  valueText: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Rubik",
    marginBottom: 10,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SLIDER_WIDTH,
    paddingHorizontal: 5,
  },
  labelText: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Rubik",
  },
  rpe_label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Rubik",
  },
});
