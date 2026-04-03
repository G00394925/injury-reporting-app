import { LineChart } from "react-native-gifted-charts";
import { View, Text, StyleSheet, Dimensions } from "react-native";

export default function LineChartComponent({ data }) {
  const lineData = Object.entries(data).map(([label, value]) => {
    const dateObj = new Date(label);
    const dayLabel = dateObj
      .toLocaleDateString("en-US", { weekday: "short" })
      .substring(0, 3);

    return {
      value: value,
      label: dayLabel
    };
  });

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        flex: 1
      }}
    >
      <LineChart
        data={lineData}
        xAxisColor={"#6b7280"}
        yAxisColor={"#6b7280"}
		width={Dimensions.get("window").width - 150}
		color={'#4174ff'}
		dataPointsColor={'#4174ff'}
      />
    </View>
  );
}
