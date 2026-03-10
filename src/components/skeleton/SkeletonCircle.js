import React, { memo } from "react";
import { Skeleton } from "moti/skeleton";

const SkeletonCircle = ({ size = 50 }) => {
  return (
    <Skeleton 
      colorMode="light" 
      width={size} 
      height={size} 
      radius="round" 
    />
  )
}

export default SkeletonCircle;