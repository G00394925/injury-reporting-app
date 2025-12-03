import { Icon } from "@rneui/base";
import { Slider } from "@rneui/themed";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

export default function RpeSlider() {
  const [value, setValue] = useState(0);

  const getColor = () => {
    const interpolate = (start, end) => {
      let k = value / 10;
      return Math.ceil((1 - k) * start + k * end) % 256;
    };
    let r = interpolate(0, 255);
    let g = interpolate(255, 0);
    let b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getIcon = () => {
    if (value <= 2) {
      return "sentiment-very-satisfied";
    }
    if (value <= 4) {
      return "sentiment-satisfied";
    }
    if (value <= 6) {
      return "sentiment-neutral";
    }
    if (value <= 8) {
      return "sentiment-dissatisfied";
    }
    return "sentiment-very-dissatisfied";
  };

  return (
    <View style={styles.container}>
      <Slider
        value={value}
        onValueChange={setValue}
        maximumValue={10}
        minimumValue={0}
        step={1}
        allowTouchTrack={true}
        trackStyle={styles.track}
        thumbStyle={[styles.thumb, { backgroundColor: getColor() }]}
        thumbProps={{
          children: (
            <Icon
              style={styles.iconContainer}
              name={getIcon()}
              type="material"
              size={20}
              color="#ffffff"
            />
          ),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    paddingVertical: 10,
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e1e1e1",
  },
  thumb: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
