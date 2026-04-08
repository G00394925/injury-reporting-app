import { BarChart } from "react-native-gifted-charts";
import { View, Text, StyleSheet, Dimensions } from "react-native";

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
          gradientColor: "#8be6c7",
          label: "Healthy"
        },
        {
          value: outcomes["At Risk"],
          color: "#f59e0b",
          gradientColor: "#fdd794",
          marginBottom: 1,
          label: "At Risk"
        },
        {
          value: outcomes["Injured"],
          color: "#ef4444",
          gradientColor: "#eca1a1",
          marginBottom: 1,
          label: "Injured"
        }
      ],
      label: dayLabel,
      leftShiftForTooltip: 30
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
          marginBottom: 25,
          alignItems: "center",
          gap: 10,
          marginRight: -10
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

  const screenWidth = Dimensions.get("window").width;
  const totalHorizontalPadding = 30;

  const numberOfBars = Math.max(barData.length, 1);
  const calculatedSpacing =
    (screenWidth - totalHorizontalPadding) / numberOfBars;

  return (
    <View
      style={{
        alignItems: "center",
        width: "100%"
      }}
    >
      {renderLegendComponent()}
      <View
        style={{
          paddingVertical: 10,
          paddingRight: 20,
          alignItems: "center"
        }}
      >
        <BarChart
          rotateLabel
          initialSpacing={calculatedSpacing / 3.5}
          xAxisColor={"#6b7280"}
          yAxisColor={"#6b7280"}
          yAxisTextStyle={{ fontFamily: "Rubik", color: "#6b7280" }}
          xAxisLabelTextStyle={{ fontFamily: "Rubik", color: "#6b7280" }}
          labelsDistanceFromXaxis={10}
          stackBorderRadius={0}
          barBorderRadius={0}
          barWidth={20}
          spacing={calculatedSpacing * 0.3}
          height={280}
          xAxisThickness={0}
          showGradient
          yAxisThickness={0}
          stackData={barData}
          renderTooltip={(item, index) => {
            return (
              <View
                style={{
                  marginBottom: 10,
                  backgroundColor: "#e0e0e0",
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                  borderRadius: 4
                }}
              >
                {item.stacks.map((stack, i) => (
                  <Text key={i}>
                    {stack.label}: {stack.value}
                  </Text>
                ))}
              </View>
            );
          }}
          leftShiftForLastIndexTooltip={60}
        />
      </View>
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
  }
});
