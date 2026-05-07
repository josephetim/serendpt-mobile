import React, { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  error?: string | null;
  secureToggle?: boolean;
}

export const FloatingLabelInput = ({
  label,
  error,
  secureTextEntry,
  secureToggle = false,
  value,
  ...props
}: FloatingLabelInputProps) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const hasValue = useMemo(() => Boolean(value && String(value).length > 0), [value]);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputWrap, (focused || hasValue) && styles.inputWrapFocused]}>
        <Text style={[styles.label, (focused || hasValue) && styles.labelFloating]}>
          {label}
        </Text>
        <TextInput
          {...props}
          value={value}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          style={styles.input}
          placeholderTextColor="#70706F"
        />
        {secureToggle ? (
          <Pressable onPress={() => setHidden((prev) => !prev)} style={styles.eye}>
            <Feather
              name={hidden ? "eye-off" : "eye"}
              size={scale(16)}
              color="#70706F"
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: verticalScale(12),
  },
  inputWrap: {
    minHeight: verticalScale(56),
    borderWidth: 1,
    borderColor: "#424242",
    borderRadius: moderateScale(8),
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    paddingHorizontal: moderateScale(14),
  },
  inputWrapFocused: {
    borderColor: "#212121",
  },
  label: {
    position: "absolute",
    left: scale(16),
    top: verticalScale(17),
    fontFamily: "BrownStd",
    fontSize: moderateScale(13),
    color: "#424242",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: scale(4),
  },
  labelFloating: {
    top: verticalScale(-10),
    fontSize: moderateScale(12),
  },
  input: {
    fontFamily: "BrownStd",
    fontSize: moderateScale(16),
    color: "#212121",
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(10),
    paddingRight: scale(32),
  },
  eye: {
    position: "absolute",
    right: scale(12),
    top: verticalScale(20),
  },
  error: {
    marginTop: verticalScale(5),
    color: "#FF3B30",
    fontSize: moderateScale(12),
    fontFamily: "BrownStd",
  },
});
