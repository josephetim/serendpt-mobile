import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { moderateScale, scale } from "../../utils/responsive";

interface VoiceVisualizerProps {
  active: boolean;
  barCount?: number;
}

export const VoiceVisualizer = ({ active, barCount = 5 }: VoiceVisualizerProps) => {
  const animatedValuesRef = useRef<Animated.Value[]>(
    Array.from({ length: barCount }, () => new Animated.Value(0.25)),
  );

  const animations = useMemo(() => {
    return animatedValuesRef.current.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 320 + index * 70,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(value, {
            toValue: 0.25,
            duration: 260 + index * 50,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ),
    );
  }, []);

  useEffect(() => {
    if (active) {
      animations.forEach((animation) => animation.start());
      return;
    }

    animations.forEach((animation, index) => {
      animation.stop();
      animatedValuesRef.current[index]?.setValue(0.25);
    });
  }, [active, animations]);

  return (
    <View pointerEvents="none" style={styles.container}>
      {animatedValuesRef.current.map((value, index) => {
        const height = value.interpolate({
          inputRange: [0, 1],
          outputRange: [scale(4), scale(15)],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: "50%",
    bottom: scale(8),
    transform: [{ translateX: -scale(16) }],
    width: scale(32),
    height: scale(18),
    borderRadius: moderateScale(8),
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: scale(5),
    paddingVertical: scale(3),
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  bar: {
    width: scale(3),
    borderRadius: moderateScale(2),
    backgroundColor: "#FFCC00",
  },
});
