import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { truncateText } from "../../utils/format";
import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { AssistantState, ListeningPill } from "./ListeningPill";

interface ReaderHeaderProps {
  title: string;
  assistantState: AssistantState;
  onBack: () => void;
}

export const ReaderHeader = ({
  title,
  assistantState,
  onBack,
}: ReaderHeaderProps) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.leftRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Feather name="chevron-left" size={scale(18)} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>{truncateText(title, 24)}</Text>
      </View>
      <ListeningPill assistantState={assistantState} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(14),
    gap: scale(8),
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: scale(10),
  },
  backButton: {
    width: scale(29),
    height: scale(29),
    borderRadius: moderateScale(23),
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "EBGaramond_500Medium",
    fontSize: moderateScale(18),
    lineHeight: moderateScale(27),
    color: "#000000",
    flexShrink: 1,
  },
});
