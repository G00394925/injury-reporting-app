import { BarChart } from "react-native-gifted-charts";
import { View, Text, StyleSheet } from "react-native";

export default function BarChartComponent({ data }) {
  const barData = Object.entries(data).map(([date, outcomes]) => {
    const dateObj = new Date(date);
    const dayLabel = dateObj
      .toLocaleDateString("en-US", { weekday: "short" })
      .substring(0, 3);

    return {
      stacks: [
        {
          value: outcomes["Healthy"],
          color: "#10b981",
          borderRadius: 5
        },
        {
          value: outcomes["At Risk"],
          color: "#f59e0b",
          marginBottom: 1,
          borderRadius: 5
        },
        {
          value: outcomes["Injured"],
          color: "#ef4444",
          marginBottom: 1,
          borderRadius: 5
        }
      ],
      label: dayLabel
    };
  });

  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
        height: "100%"
      }}
    >
      <BarChart
        rotateLabel
        initialSpacing={2}
        xAxisColor={"#6b7280"}
        yAxisColor={"#6b7280"}
        hideRules
        labelsDistanceFromXaxis={10}
        width={280}
        height={290}
        xAxisThickness={2}
        disablePress
        stackData={barData}
      />
    </View>
  );
}
