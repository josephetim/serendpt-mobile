import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "../ui/AppIcon";
import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";

interface HomeHeaderProps {
  userName?: string | null;
  userInitial: string;
  onEditProfilePress: () => void;
}

export const HomeHeader = ({
  userName,
  userInitial,
  onEditProfilePress,
}: HomeHeaderProps) => {
  const title = userName?.trim() ? `Welcome back, ${userName.trim()}` : "Welcome back";

  return (
    <View>
      <View style={styles.topRow}>
        <View style={styles.leftCircle}>
          <Text style={styles.initial}>{userInitial}</Text>
        </View>
        <View style={styles.rightIcons}>
          <Pressable style={styles.searchButton}>
            <AppIcon name="search" size={scale(23)} color="#000000" />
          </Pressable>
          <Pressable style={styles.editButton} onPress={onEditProfilePress}>
            <AppIcon name="editProfile" size={scale(20)} color="#000000" />
          </Pressable>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    marginTop: verticalScale(6),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  leftCircle: {
    width: scale(38),
    height: scale(38),
    borderRadius: moderateScale(23),
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(17),
    color: "#000000",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(14),
  },
  searchButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: scale(2),
  },
  title: {
    fontFamily: Fonts.serifMedium,
    fontSize: moderateScale(36),
    lineHeight: moderateScale(44),
    color: "#000000",
    marginBottom: verticalScale(14),
  },
});
