import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { moderateScale, verticalScale } from "../../utils/responsive";

interface ReaderContentProps {
  pageNumber: number;
  pageTitle: string;
  body: string;
  bottomPadding?: number;
}

export const ReaderContent = ({
  pageNumber,
  pageTitle,
  body,
  bottomPadding = verticalScale(230),
}: ReaderContentProps) => {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingBottom: bottomPadding }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageNumber}>Page {pageNumber}</Text>
      <Text style={styles.pageTitle}>{pageTitle}</Text>
      <View style={styles.bodyWrap}>
        <Text style={styles.bodyText}>{body}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingBottom: verticalScale(230),
  },
  pageNumber: {
    textAlign: "center",
    color: "rgba(0,0,0,0.70)",
    fontFamily: "BrownStd",
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(2),
  },
  pageTitle: {
    textAlign: "center",
    color: "#000000",
    fontFamily: "EBGaramond_500Medium",
    fontSize: moderateScale(37),
    lineHeight: moderateScale(44),
    marginBottom: verticalScale(20),
  },
  bodyWrap: {
    paddingHorizontal: moderateScale(14),
  },
  bodyText: {
    color: "#000000",
    fontFamily: "Georgia",
    fontSize: moderateScale(16),
    lineHeight: moderateScale(31),
    textAlign: "left",
  },
});
