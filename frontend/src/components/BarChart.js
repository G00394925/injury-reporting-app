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
        },
        {
          value: outcomes["At Risk"],
          color: "#f59e0b",
          marginBottom: 1,
        },
        {
          value: outcomes["Injured"],
          color: "#ef4444",
          marginBottom: 1,
        }
      ],
      label: dayLabel
    };
  });

  const renderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 5
        }}
      />
    );
  };

  const renderLegendComponent = () => {
    const stackLabels = [
      { label: "Healthy", color: "#10b981" },
      { label: "At Risk", color: "#f59e0b" },
      { label: "Injured", color: "#ef4444" }
    ];

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 50,
          alignItems: "center",
          gap: 20
        }}
      >
        {stackLabels.map((item, index) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
            key={index}
          >
            {renderDot(item.color)}
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    );
  };

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
		yAxisTextStyle={{ fontFamily: "Rubik", color: "#6b7280" }}
		xAxisTextStyle={{ fontFamily: "Rubik", color: "#6b7280" }}
		hideRules
        labelsDistanceFromXaxis={10}
		stackBorderRadius={5}
		barBorderRadius={5}
		barWidth={40}
        width={280}
        height={290}
        xAxisThickness={2}
        disablePress
        stackData={barData}
      />
	  {renderLegendComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
	legendText: {
	  fontFamily: "Rubik",
	  fontSize: 14,
	  color: "#6b7280",
	  lineHeight: 16,
	  marginRight: 15
	},
})