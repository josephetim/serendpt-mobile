import React from "react";
import {
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { StyleProp, TextStyle } from "react-native";

export type AppIconName =
  | "search"
  | "editProfile"
  | "back"
  | "aiAssistant"
  | "fullscreen"
  | "exitFullscreen"
  | "chatHistory"
  | "microphone"
  | "close"
  | "more"
  | "upload"
  | "document"
  | "google"
  | "check"
  | "eye"
  | "eyeOff"
  | "send"
  | "play"
  | "pause"
  | "chevronDown"
  | "userInitialFallback"
  | "chevronLeft"
  | "chevronRight"
  | "globe"
  | "bookOpen";

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const AppIcon = ({
  name,
  size = 20,
  color = "#000000",
  style,
}: AppIconProps) => {
  switch (name) {
    case "search":
      return <Feather name="search" size={size} color={color} style={style} />;
    case "editProfile":
      return <Feather name="edit-3" size={size} color={color} style={style} />;
    case "back":
      return <Ionicons name="chevron-back" size={size} color={color} style={style} />;
    case "aiAssistant":
      return (
        <MaterialCommunityIcons name="creation" size={size} color={color} style={style} />
      );
    case "fullscreen":
      return <MaterialIcons name="fullscreen" size={size} color={color} style={style} />;
    case "exitFullscreen":
      return (
        <MaterialIcons name="fullscreen-exit" size={size} color={color} style={style} />
      );
    case "chatHistory":
      return (
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={size}
          color={color}
          style={style}
        />
      );
    case "microphone":
      return <Feather name="mic" size={size} color={color} style={style} />;
    case "close":
      return <Ionicons name="close" size={size} color={color} style={style} />;
    case "more":
      return (
        <MaterialCommunityIcons name="dots-vertical" size={size} color={color} style={style} />
      );
    case "upload":
      return <Feather name="upload" size={size} color={color} style={style} />;
    case "document":
      return <Ionicons name="document-text-outline" size={size} color={color} style={style} />;
    case "google":
      return <FontAwesome5 name="google" size={size} color={color} style={style} />;
    case "check":
      return <Feather name="check" size={size} color={color} style={style} />;
    case "eye":
      return <Feather name="eye" size={size} color={color} style={style} />;
    case "eyeOff":
      return <Feather name="eye-off" size={size} color={color} style={style} />;
    case "send":
      return <Feather name="send" size={size} color={color} style={style} />;
    case "play":
      return <Ionicons name="play" size={size} color={color} style={style} />;
    case "pause":
      return <Ionicons name="pause" size={size} color={color} style={style} />;
    case "chevronDown":
      return <Feather name="chevron-down" size={size} color={color} style={style} />;
    case "userInitialFallback":
      return <Entypo name="user" size={size} color={color} style={style} />;
    case "chevronLeft":
      return <Feather name="chevron-left" size={size} color={color} style={style} />;
    case "chevronRight":
      return <Feather name="chevron-right" size={size} color={color} style={style} />;
    case "globe":
      return <Feather name="globe" size={size} color={color} style={style} />;
    case "bookOpen":
      return <Feather name="book-open" size={size} color={color} style={style} />;
    default:
      return <Feather name="search" size={size} color={color} style={style} />;
  }
};
