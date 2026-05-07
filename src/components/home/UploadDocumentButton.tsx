import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../ui/AppButton";
import { moderateScale, verticalScale } from "../../utils/responsive";

interface UploadDocumentButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export const UploadDocumentButton = ({
  onPress,
  loading = false,
}: UploadDocumentButtonProps) => {
  return (
    <View style={styles.wrap}>
      <AppButton
        title="Upload a new doc"
        onPress={onPress}
        loading={loading}
        variant="yellow"
        style={styles.button}
      />
      <Text style={styles.helpText}>
        Supported formats: PDF, DOC, DOCX, TXT (Max 50MB)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
  },
  button: {
    alignSelf: "center",
    width: "72%",
  },
  helpText: {
    marginTop: verticalScale(16),
    textAlign: "center",
    fontFamily: "BrownStd",
    color: "#000000",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(21),
    opacity: 0.9,
  },
});
