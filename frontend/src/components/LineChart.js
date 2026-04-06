import { LineChart } from "react-native-gifted-charts";
import { View, Text, StyleSheet, Dimensions } from "react-native";

export default function LineChartComponent({ data }) {
  const lineData = Object.entries(data).map(([label, value]) => {
    const dateObj = new Date(label);
    const dayLabel = dateObj
      .toLocaleDateString("en-US", { weekday: "short" })
      .substring(0, 3);

    return {
      value: Number(value) || 0,
      label: dayLabel
    };
  });

  const screenWidth = Dimensions.get("window").width
  const totalHorizontalPadding = 30;

  const numberOfDataPoints = Math.max(lineData.length, 1)
  const calculatedSpacing = (screenWidth - totalHorizontalPadding) / numberOfDataPoints

  const minValue = lineData.length ? Math.min(...lineData.map((point) => point.value)) : 0;
  const yAxisOffset = minValue < 0 ? minValue : 0;

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      <View style={{
        paddingVertical: 10,
        paddingRight: 20,
        alignItems: "center"
      }}>
        <LineChart
          data={lineData}
          xAxisColor={"#e2e2e2"}
          color={'#4174ff'}
          dataPointsColor={'#4174ff'}
          spacing={calculatedSpacing * 0.8}
          initialSpacing={calculatedSpacing / 4}
          rotateLabel
          xAxisLabelTextStyle={{fontFamily: "Rubik", color: "#6b7280"}}
          yAxisTextStyle={{ fontFamily: "Rubik", color: "#6b7280" }}
          xAxisThickness={1}
          yAxisThickness={0}
          xAxisLabelsVerticalShift={5}
          adjustToWidth
          showValuesAsDataPointsText
          textColor1="#575757"
          textFontSize1={11}
          textShiftY={-5}
          yAxisOffset={yAxisOffset}
        />
      </View>
    </View>
  );
}
