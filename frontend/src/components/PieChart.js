import { PieChart } from "react-native-gifted-charts";
import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";

export default function PieChartComponent({
  data,
  centerLabel,
  centerValue,
  numItems
}) {
  const [activeItem, setActiveItem] = useState({
    label: centerLabel,
    value: centerValue
  });

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
        <View>
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
    color: obj.color,
    label: obj.label,
    focused: activeItem.label === obj.label
  }));

  const handleItemPress = (item, index) => {
    setActiveItem({
      label: item.label,
      value: item.value
    });
  };

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
        isAnimated
        focusOnPress
        sectionAutoFocus
        onPress={handleItemPress}
        radius={100}
        innerRadius={55}
        centerLabelComponent={() => {
          return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.focusPercentage}>{activeItem.value}%</Text>
              <Text style={styles.focusLabel}>{activeItem.label}</Text>
            </View>
          );
        }}
      />
      <View style={{ alignSelf: "flex-start", marginLeft: -20 }}>
        {renderLegendComponent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legendText: {
    fontFamily: "Rubik",
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
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
