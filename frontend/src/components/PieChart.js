import { PieChart } from "react-native-gifted-charts";
import { View, Text, StyleSheet } from "react-native";

export default function PieChartComponent({
  values,
  labels,
  colors,
  centerLabel,
  centerValue
}) {
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
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 10,
            marginTop: 15,
            marginLeft: 10,
            alignItems: "center"
          }}
        >
          {values.map((value, index) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
              key={index}
            >
              {renderDot(colors[index])}
              <Text style={styles.legendText}>
                {labels[index]}: {value}%
              </Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  const pieData = values.map((value, index) => ({
    value: value,
    color: colors[index]
  }));

  return (
    <View
      style={{
        alignItems: "center",
        paddingHorizontal: 15,
        marginHorizontal: 15
      }}
    >
      <PieChart
        data={pieData}
        donut
        sectionAutoFocus
        showGradient
        isAnimated
        radius={100}
        innerRadius={55}
        centerLabelComponent={() => {
          return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.focusPercentage}>{centerValue}%</Text>
              <Text style={styles.focusLabel}>{centerLabel}</Text>
            </View>
          );
        }}
      />
      {renderLegendComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  legendText: {
    fontFamily: "Rubik",
    fontSize: 14,
    marginRight: 15
  },
  focusPercentage: {
    fontFamily: "Rubik",
    fontSize: 22,
    fontWeight: "bold"
  },
  focusLabel: {
    fontFamily: "Rubik",
    fontSize: 16
  }
});
