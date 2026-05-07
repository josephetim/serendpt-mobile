import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { Voice } from "../../types/api";
import { moderateScale, scale } from "../../utils/responsive";
import { VoiceVisualizer } from "./VoiceVisualizer";

interface VoiceMiniCardProps {
  voice: Voice | null;
  visualizerActive?: boolean;
}

export const VoiceMiniCard = ({
  voice,
  visualizerActive = false,
}: VoiceMiniCardProps) => {
  if (!voice) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        {voice.image_url ? (
          <Image source={{ uri: voice.image_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}
        <VoiceVisualizer active={visualizerActive} />
      </View>
      <Text style={styles.label}>{voice.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
  },
  card: {
    width: scale(75),
    height: scale(75),
    borderRadius: moderateScale(14),
    backgroundColor: "#FFFBEB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: scale(4),
  },
  avatar: {
    width: scale(65),
    height: scale(65),
    borderRadius: moderateScale(999),
  },
  avatarPlaceholder: {
    backgroundColor: "#DADADA",
  },
  label: {
    fontFamily: "BrownStd",
    fontSize: moderateScale(12),
    color: "#424242",
  },
});
