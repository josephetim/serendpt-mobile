import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";

const editIcon = require("../../../assets/icons/edit-icon.png");

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
            <Feather name="search" size={scale(23)} color="#000000" />
          </Pressable>
          <Pressable style={styles.editButton} onPress={onEditProfilePress}>
            <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
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
    fontFamily: "BrownStd",
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
  editIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: "#000000",
  },
  title: {
    fontFamily: "EBGaramond_500Medium",
    fontSize: moderateScale(36),
    lineHeight: moderateScale(44),
    color: "#000000",
    marginBottom: verticalScale(14),
  },
});
