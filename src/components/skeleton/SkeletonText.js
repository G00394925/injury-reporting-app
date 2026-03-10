import React, { memo } from "react";
import { Skeleton } from "moti/skeleton";
import { DimensionValue } from "react-native";

const SkeletonText = ({ width = "100%", height }) => {
  return (
    <Skeleton
      colorMode="light"
      width={width}
      height={height}
    />
  )
}

export default SkeletonText;