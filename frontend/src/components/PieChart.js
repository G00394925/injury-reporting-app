import { PieChart } from "react-native-gifted-charts";
import { View, Text, StyleSheet } from "react-native";

export default function PieChartComponent({ data, centerLabel, centerValue, numItems }) {
  const getPercentage = (value) => {
    if (numItems === 0) return 0;
    return Math.round((value / numItems) * 100);
  };

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
            alignItems: "center"
          }}
        >
          {Object.values(data).map((obj, index) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
              key={index}
            >
              {renderDot(obj.color)}
              <Text style={styles.legendText}>
                {obj.label}: {getPercentage(obj.value)}%
              </Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  const pieData = Object.values(data).map((obj, index) => ({
    value: getPercentage(obj.value),
    color: obj.color
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
      <View style={{
        marginLeft: 15,
        marginTop: 20,
        marginBottom: 15
      }}>
        {renderLegendComponent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legendText: {
    fontFamily: "Rubik",
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 16,
    marginRight: 15,
    textAlign: "auto"
  },
  focusPercentage: {
    fontFamily: "Rubik",
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937"
  },
  focusLabel: {
    fontFamily: "Rubik",
    fontSize: 16,
    color: "#6b7280"
  }
});
