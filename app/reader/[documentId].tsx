import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { AIControlGroup } from "../../src/components/reader/AIControlGroup";
import { AIAssistantSheet } from "../../src/components/reader/AIAssistantSheet";
import { AssistantState } from "../../src/components/reader/ListeningPill";
import { ReaderContent } from "../../src/components/reader/ReaderContent";
import { ReaderHeader } from "../../src/components/reader/ReaderHeader";
import { ReaderToolbar } from "../../src/components/reader/ReaderToolbar";
import { VoicePicker } from "../../src/components/reader/VoicePicker";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingState } from "../../src/components/ui/LoadingState";
import { Screen } from "../../src/components/ui/Screen";
import { AppIcon } from "../../src/components/ui/AppIcon";
import { usePageAudio } from "../../src/hooks/usePageAudio";
import { useReader } from "../../src/hooks/useReader";
import { useVoices } from "../../src/hooks/useVoices";
import { getBatchText } from "../../src/utils/batchContent";
import { scale, verticalScale } from "../../src/utils/responsive";
import { Fonts } from "../../src/theme/fonts";

type ReaderParams = {
  documentId?: string | string[];
  title?: string;
  lastReadPosition?: string;
};

type AssistantOpenReason = "assistant" | "history";

const resolveParam = (value?: string | string[]): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
};

export default function ReaderScreen() {
  const params = useLocalSearchParams<ReaderParams>();
  const documentId = resolveParam(params.documentId);
  const documentTitleParam = resolveParam(params.title);
  const lastReadPosition = Number(resolveParam(params.lastReadPosition) || "0");

  const {
    pages,
    currentIndex,
    currentBatchOrder,
    isLoading,
    error,
    fetchBatches,
    goToPage,
    clearReader,
  } = useReader();

  const { voices, selectedVoice, setVoice, errorMessage: voicesError } = useVoices();
  const [voicePickerVisible, setVoicePickerVisible] = useState(false);
  const [pagePickerVisible, setPagePickerVisible] = useState(false);
  const [assistantSheetVisible, setAssistantSheetVisible] = useState(false);
  const [assistantOpenReason, setAssistantOpenReason] =
    useState<AssistantOpenReason>("assistant");
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!documentId) {
      return;
    }

    void fetchBatches(documentId, {
      documentTitle: documentTitleParam,
      initialBatchOrder: Number.isFinite(lastReadPosition) ? lastReadPosition : 0,
    }).catch(() => undefined);

    return () => {
      clearReader();
    };
  }, [documentId, documentTitleParam, lastReadPosition, fetchBatches, clearReader]);

  const currentPage = pages[currentIndex];
  const pageText = useMemo(
    () => (currentPage ? getBatchText(currentPage.batch_content) : ""),
    [currentPage],
  );
  const pageNumber = useMemo(
    () => (currentPage ? currentPage.batch_order + 1 : currentIndex + 1),
    [currentPage, currentIndex],
  );
  const pageTitle = currentPage?.batch_title || "Untitled";
  const headerTitle = documentTitleParam || currentPage?.document_id || "Document";

  const {
    status,
    errorMessage: audioError,
    startPlayback,
  } = usePageAudio({
    documentId: documentId || "unknown-document",
    batchOrder: currentPage?.batch_order ?? 0,
    text: pageText,
  });

  useEffect(() => {
    if (status === "playing") {
      setAssistantState("speaking");
      return;
    }
    if (status === "loading" || status === "buffering") {
      setAssistantState("thinking");
      return;
    }
    if (status === "error") {
      setAssistantState("error");
      return;
    }
    setAssistantState(assistantSheetVisible ? "listening" : "idle");
  }, [status, assistantSheetVisible]);

  return (
    <Screen style={styles.screen} contentContainerStyle={styles.container}>
      {!isFullscreen ? (
        <>
          <ReaderHeader
            title={headerTitle}
            assistantState={assistantState}
            onBack={() => router.back()}
          />

          <ReaderToolbar
            pageLabel={`Page ${pageNumber}`}
            onPageSelectorPress={() => setPagePickerVisible(true)}
            onOpenAssistant={() => {
              setAssistantOpenReason("assistant");
              setAssistantSheetVisible(true);
            }}
            onToggleFullscreen={() => setIsFullscreen(true)}
            isFullscreen={isFullscreen}
          />
        </>
      ) : (
        <Pressable
          style={styles.exitFullscreenButton}
          onPress={() => setIsFullscreen(false)}
        >
          <AppIcon name="exitFullscreen" size={scale(19)} color="#000000" />
        </Pressable>
      )}

      {isLoading ? <LoadingState message="Loading document pages..." /> : null}
      {!isLoading && error ? (
        <ErrorState message={error} onRetry={() => void fetchBatches(documentId)} />
      ) : null}

      {!isLoading && !error && !currentPage ? <ErrorState message="Empty document content." /> : null}

      {!isLoading && !error && currentPage ? (
        <ReaderContent
          pageNumber={pageNumber}
          pageTitle={pageTitle}
          body={pageText}
          bottomPadding={isFullscreen ? verticalScale(280) : verticalScale(250)}
        />
      ) : null}

      {audioError ? <ErrorState message={`Audio generation failed: ${audioError}`} /> : null}
      {!audioError && voicesError ? <ErrorState message={voicesError} /> : null}

      <AIControlGroup
        assistantState={assistantState}
        selectedVoice={selectedVoice}
        onOpenAssistant={() => {
          setAssistantOpenReason("assistant");
          setAssistantSheetVisible(true);
        }}
        onOpenHistory={() => {
          setAssistantOpenReason("history");
          setAssistantSheetVisible(true);
        }}
        onSelectVoice={() => setVoicePickerVisible(true)}
      />

      <VoicePicker
        visible={voicePickerVisible}
        voices={voices}
        selectedVoice={selectedVoice}
        onClose={() => setVoicePickerVisible(false)}
        onSelect={(voice) => {
          setVoice(voice);
          setVoicePickerVisible(false);
        }}
      />

      <AIAssistantSheet
        visible={assistantSheetVisible}
        documentId={documentId}
        batchOrder={currentBatchOrder}
        openReason={assistantOpenReason}
        onClose={() => setAssistantSheetVisible(false)}
        onStateChange={setAssistantState}
        onReadCurrentPage={startPlayback}
      />

      <Modal
        visible={pagePickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPagePickerVisible(false)}
      >
        <Pressable style={styles.pageModalOverlay} onPress={() => setPagePickerVisible(false)}>
          <Pressable style={styles.pageModalSheet}>
            <Text style={styles.pageModalTitle}>Go to page</Text>
            <ScrollView contentContainerStyle={styles.pageList}>
              {pages.map((page, index) => (
                <Pressable
                  key={`${page.document_id}-${page.batch_order}`}
                  style={[styles.pageItem, index === currentIndex && styles.pageItemActive]}
                  onPress={() => {
                    goToPage(index);
                    setPagePickerVisible(false);
                  }}
                >
                  <Text style={styles.pageItemText}>Page {page.batch_order + 1}</Text>
                  <Text style={styles.pageItemSubtitle}>{page.batch_title}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(14),
    backgroundColor: "#FFFFFF",
  },
  exitFullscreenButton: {
    alignSelf: "flex-end",
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(10),
  },
  pageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  pageModalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: scale(22),
    borderTopRightRadius: scale(22),
    minHeight: verticalScale(320),
    maxHeight: verticalScale(480),
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(14),
  },
  pageModalTitle: {
    fontFamily: Fonts.serifMedium,
    fontSize: scale(25),
    color: "#000000",
    marginBottom: verticalScale(10),
  },
  pageList: {
    paddingBottom: verticalScale(30),
  },
  pageItem: {
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: scale(11),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(8),
  },
  pageItemActive: {
    borderColor: "#FFCC00",
    backgroundColor: "#FFFBEB",
  },
  pageItemText: {
    fontFamily: Fonts.sansRegular,
    color: "#000000",
    fontSize: scale(14),
  },
  pageItemSubtitle: {
    fontFamily: Fonts.sansRegular,
    color: "#70706F",
    fontSize: scale(12),
    marginTop: verticalScale(2),
  },
});
