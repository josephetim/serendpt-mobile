import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { getConversation, sendChatQuestion } from "../../api/chat";
import { ConversationItem } from "../../types/api";
import { normalizeError } from "../../utils/errors";
import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { AssistantState } from "./ListeningPill";
import { Fonts } from "../../theme/fonts";
import { AppIcon } from "../ui/AppIcon";

type AssistantOpenReason = "assistant" | "history";

interface AIAssistantSheetProps {
  visible: boolean;
  documentId: string;
  batchOrder: number;
  openReason: AssistantOpenReason;
  onClose: () => void;
  onStateChange: (state: AssistantState) => void;
  onReadCurrentPage: () => Promise<void>;
}

const MessageBubble = ({ message }: { message: ConversationItem }) => {
  const isUser = message.role === "user";
  return (
    <View style={[styles.messageWrap, isUser ? styles.messageWrapUser : styles.messageWrapAi]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.aiBubbleText]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

export const AIAssistantSheet = ({
  visible,
  documentId,
  batchOrder,
  openReason,
  onClose,
  onStateChange,
  onReadCurrentPage,
}: AIAssistantSheetProps) => {
  const [messages, setMessages] = useState<ConversationItem[]>([]);
  const [question, setQuestion] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtitle = useMemo(
    () =>
      openReason === "history"
        ? "Review previous AI conversations"
        : "Ask questions about this page",
    [openReason],
  );

  useEffect(() => {
    if (!visible || !documentId) {
      return;
    }

    const loadHistory = async () => {
      setIsLoadingHistory(true);
      setErrorMessage(null);
      onStateChange("listening");
      try {
        const history = await getConversation(documentId);
        setMessages(history);
        onStateChange("idle");
      } catch (error) {
        setErrorMessage(normalizeError(error).message);
        onStateChange("error");
      } finally {
        setIsLoadingHistory(false);
      }
    };

    void loadHistory();
  }, [visible, documentId, onStateChange]);

  const handleSend = async () => {
    const trimmed = question.trim();
    if (!trimmed || !documentId || isSending) {
      return;
    }

    const userMessage: ConversationItem = {
      role: "user",
      text: trimmed,
      id: `local-user-${Date.now()}`,
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setErrorMessage(null);
    setIsSending(true);
    onStateChange("thinking");

    try {
      const response = await sendChatQuestion({
        document_id: documentId,
        batch_order: batchOrder,
        question: trimmed,
      });
      const assistantMessage: ConversationItem = {
        role: "assistant",
        text: response.ai_response,
        id: `assistant-${response.conversation_id}-${Date.now()}`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      onStateChange("idle");
    } catch (error) {
      setErrorMessage(normalizeError(error).message);
      onStateChange("error");
    } finally {
      setIsSending(false);
    }
  };

  const handleReadCurrentPage = async () => {
    try {
      onStateChange("speaking");
      await onReadCurrentPage();
    } catch (error) {
      setErrorMessage(normalizeError(error).message);
      onStateChange("error");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.dismissZone} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>AI Assistant</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <Pressable onPress={onClose}>
              <AppIcon name="close" size={scale(19)} color="#000000" />
            </Pressable>
          </View>

          <Pressable style={styles.readButton} onPress={() => void handleReadCurrentPage()}>
            <Text style={styles.readButtonText}>Read this page aloud</Text>
          </Pressable>

          <View style={styles.messagesContainer}>
            {isLoadingHistory ? (
              <View style={styles.center}>
                <ActivityIndicator color="#212121" />
                <Text style={styles.helperText}>Loading conversation...</Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.messagesList}
              >
                {!messages.length ? (
                  <Text style={styles.emptyText}>Start a conversation with AI Assistant.</Text>
                ) : null}
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id ?? `${message.role}-${index}`}
                    message={message}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ask about this page..."
              placeholderTextColor="#8A8A8A"
              value={question}
              onChangeText={setQuestion}
              multiline
              maxLength={500}
            />
            <Pressable
              style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
              onPress={() => void handleSend()}
              disabled={isSending}
            >
              {isSending ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <AppIcon name="send" size={scale(16)} color="#000000" />
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  dismissZone: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    minHeight: verticalScale(430),
    maxHeight: "85%",
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(18),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(10),
  },
  title: {
    fontFamily: Fonts.serifMedium,
    fontSize: moderateScale(28),
    color: "#000000",
  },
  subtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(13),
    color: "#70706F",
    marginTop: verticalScale(2),
  },
  readButton: {
    backgroundColor: "#FFFAEA",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    alignSelf: "flex-start",
    marginBottom: verticalScale(10),
  },
  readButtonText: {
    fontFamily: Fonts.sansRegular,
    color: "#212121",
    fontSize: moderateScale(13),
  },
  messagesContainer: {
    flex: 1,
    minHeight: verticalScale(220),
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: moderateScale(12),
    backgroundColor: "#FFFEF8",
  },
  messagesList: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    gap: verticalScale(8),
  },
  messageWrap: {
    flexDirection: "row",
  },
  messageWrapUser: {
    justifyContent: "flex-end",
  },
  messageWrapAi: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(10),
  },
  userBubble: {
    backgroundColor: "#FFCC00",
    borderBottomRightRadius: moderateScale(4),
  },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderBottomLeftRadius: moderateScale(4),
  },
  bubbleText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontFamily: Fonts.sansRegular,
  },
  userBubbleText: {
    color: "#000000",
  },
  aiBubbleText: {
    color: "#212121",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(8),
  },
  helperText: {
    fontFamily: Fonts.sansRegular,
    color: "#70706F",
    fontSize: moderateScale(13),
  },
  emptyText: {
    fontFamily: Fonts.sansRegular,
    color: "#70706F",
    fontSize: moderateScale(13),
    textAlign: "center",
    paddingTop: verticalScale(12),
  },
  errorText: {
    marginTop: verticalScale(8),
    color: "#FF3B30",
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(12),
  },
  inputRow: {
    marginTop: verticalScale(10),
    flexDirection: "row",
    alignItems: "flex-end",
    gap: scale(8),
  },
  input: {
    flex: 1,
    minHeight: verticalScale(44),
    maxHeight: verticalScale(100),
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    fontFamily: Fonts.sansRegular,
    color: "#212121",
    fontSize: moderateScale(14),
    backgroundColor: "#FFFFFF",
  },
  sendButton: {
    width: scale(42),
    height: scale(42),
    borderRadius: moderateScale(21),
    backgroundColor: "#FFCC00",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
});
