import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonText from "./SkeletonText";
import SkeletonCircle from "./SkeletonCircle";

const AthleteInfoSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <SkeletonCircle size={50} />
      </View>
      <View style={styles.textContainer}>
        <SkeletonText width={190} height={18} />
        <SkeletonText width={230} height={16} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    paddingVertical: 10,
  },
  circleContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end"
  }
})

export default AthleteInfoSkeleton;