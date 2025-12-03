import { Icon } from "@rneui/base";
import { Slider } from "@rneui/themed";
import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

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

  const sliderWidth = screenWidth * 0.85;

  return (
    <View style={styles.container}>
      <View style={[styles.sliderContainer, { width: sliderWidth }]}>
        <Slider
          style={{ width: sliderWidth }}
          value={value}
          onValueChange={setValue}
          maximumValue={10}
          minimumValue={0}
          step={1}
          allowTouchTrack={true}
          minimumTrackTintColor={getColor()}
          maximumTrackTintColor="#e1e1e1"
          trackStyle={styles.track}
          thumbStyle={[styles.thumb, { backgroundColor: getColor() }]}
          thumbProps={{
            children: (
              <Icon
                containerStyle={styles.iconContainer}
                name={getIcon()}
                type="material"
                size={20}
                color="#ffffff"
              />
            ),
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  sliderContainer: {
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
  },
  track: {
    height: 10,
    borderRadius: 5,
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
    height: 30,
    width: 30,
  },
});
