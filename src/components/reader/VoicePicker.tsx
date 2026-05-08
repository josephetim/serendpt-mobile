import React from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Voice } from "../../types/api";
import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";
import { AppIcon } from "../ui/AppIcon";

interface VoicePickerProps {
  visible: boolean;
  voices: Voice[];
  selectedVoice: Voice | null;
  onClose: () => void;
  onSelect: (voice: Voice) => void;
}

export const VoicePicker = ({
  visible,
  voices,
  selectedVoice,
  onClose,
  onSelect,
}: VoicePickerProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Select a voice</Text>
            <Pressable onPress={onClose}>
              <AppIcon name="close" size={scale(19)} color="#000000" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.list}>
            {voices.map((voice) => {
              const selected = selectedVoice?.name === voice.name;
              const disabled = voice.disabled;

              return (
                <Pressable
                  key={`${voice.name}-${voice.tag}`}
                  onPress={() => onSelect(voice)}
                  disabled={disabled}
                  style={[
                    styles.item,
                    selected && styles.itemSelected,
                    disabled && styles.itemDisabled,
                  ]}
                >
                  {voice.image_url ? (
                    <Image source={{ uri: voice.image_url }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.placeholderAvatar]} />
                  )}
                  <View style={styles.meta}>
                    <Text style={styles.name}>{voice.name}</Text>
                    <Text style={styles.tag}>{voice.tag}</Text>
                  </View>
                  {disabled ? <Text style={styles.disabledText}>Unavailable</Text> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  sheet: {
    minHeight: verticalScale(360),
    maxHeight: verticalScale(520),
    borderTopLeftRadius: moderateScale(22),
    borderTopRightRadius: moderateScale(22),
    backgroundColor: "#FFFFFF",
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(12),
  },
  title: {
    fontFamily: Fonts.serifMedium,
    fontSize: moderateScale(24),
    color: "#000000",
  },
  list: {
    paddingBottom: verticalScale(40),
    gap: verticalScale(10),
  },
  item: {
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  itemSelected: {
    borderColor: "#FFCC00",
    backgroundColor: "#FFFBEB",
  },
  itemDisabled: {
    opacity: 0.55,
  },
  avatar: {
    width: scale(46),
    height: scale(46),
    borderRadius: moderateScale(999),
    backgroundColor: "#F1F1F1",
  },
  placeholderAvatar: {
    backgroundColor: "#DEDEDE",
  },
  meta: {
    flex: 1,
  },
  name: {
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(15),
    color: "#212121",
  },
  tag: {
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(12),
    color: "#70706F",
    marginTop: verticalScale(2),
  },
  disabledText: {
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(12),
    color: "#FF3B30",
  },
});
