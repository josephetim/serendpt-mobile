import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { DocumentSummary } from "../../types/api";
import { moderateScale, scale, verticalScale } from "../../utils/responsive";

interface DocumentProgressCardProps {
  document: DocumentSummary;
  progressPercent: number;
  progressLoading?: boolean;
  onPress: () => void;
}

export const DocumentProgressCard = ({
  document,
  progressPercent,
  progressLoading = false,
  onPress,
}: DocumentProgressCardProps) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        {document.document_title}
      </Text>
      <View style={styles.right}>
        <Text style={styles.percent}>
          {progressLoading ? "..." : `${progressPercent}%`}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Feather name="more-vertical" size={scale(14)} color="#000000" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: verticalScale(60),
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: moderateScale(14),
    backgroundColor: "#FFFFFF",
    paddingHorizontal: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(12),
  },
  title: {
    fontFamily: "EBGaramond_500Medium",
    fontSize: moderateScale(22),
    lineHeight: moderateScale(30),
    color: "#000000",
    maxWidth: "52%",
    flexShrink: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    maxWidth: "46%",
  },
  percent: {
    fontFamily: "BrownStd",
    fontSize: moderateScale(16),
    color: "#000000",
    minWidth: scale(36),
  },
  progressTrack: {
    width: scale(56),
    height: verticalScale(8),
    backgroundColor: "#000000",
    borderRadius: moderateScale(5),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFCC00",
    borderRadius: moderateScale(5),
  },
});
