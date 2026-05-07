import { Dimensions } from "react-native";

export const guidelineBaseWidth = 393;
export const guidelineBaseHeight = 852;

const { width, height } = Dimensions.get("window");

export const scale = (size: number) => (width / guidelineBaseWidth) * size;

export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;
