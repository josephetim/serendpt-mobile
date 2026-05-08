export const Fonts = {
  serifRegular: "EBGaramond_400Regular",
  serifMedium: "EBGaramond_500Medium",
  serifSemiBold: "EBGaramond_600SemiBold",
  sansLight: "Inter_300Light",
  sansRegular: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
  inputRegular: "ZenKakuGothicAntique_400Regular",
} as const;

export type FontKey = (typeof Fonts)[keyof typeof Fonts];
