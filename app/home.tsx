import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router, useFocusEffect } from "expo-router";

import { CategoryPill } from "../src/components/home/CategoryPill";
import { DocumentProgressCard } from "../src/components/home/DocumentProgressCard";
import { HomeHeader } from "../src/components/home/HomeHeader";
import { UploadDocumentButton } from "../src/components/home/UploadDocumentButton";
import { EmptyState } from "../src/components/ui/EmptyState";
import { ErrorState } from "../src/components/ui/ErrorState";
import { LoadingState } from "../src/components/ui/LoadingState";
import { Screen } from "../src/components/ui/Screen";
import { useAuth } from "../src/hooks/useAuth";
import { useDocuments } from "../src/hooks/useDocuments";
import { normalizeError } from "../src/utils/errors";
import { getUserInitial } from "../src/utils/format";
import {
  computeDocumentProgress,
  mergeLastReadPosition,
} from "../src/utils/progress";
import { scale, verticalScale } from "../src/utils/responsive";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export default function HomeScreen() {
  const { user } = useAuth();
  const {
    documents,
    isLoading,
    error,
    totalPagesByDocumentId,
    loadingTotalPagesByDocumentId,
    localProgressByDocumentId,
    hydrateLocalProgress,
    fetchDocuments,
    fetchDocumentTotalPages,
    uploadDocument,
  } = useDocuments();
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const welcomeName = useMemo(() => {
    const fullName = user?.full_name?.trim();
    if (!fullName) {
      return null;
    }
    return fullName.split(" ")[0];
  }, [user?.full_name]);
  const userInitial = useMemo(() => getUserInitial(user), [user]);
  const documentCards = useMemo(() => {
    return documents.map((document) => {
      const localEntry = localProgressByDocumentId[document.document_id];
      const mergedLastReadPosition = mergeLastReadPosition(
        document.last_read_position,
        localEntry,
      );
      const totalPages =
        totalPagesByDocumentId[document.document_id] ??
        localEntry?.totalPages ??
        0;
      const metrics = computeDocumentProgress(
        mergedLastReadPosition,
        totalPages,
      );
      const isProgressLoading =
        loadingTotalPagesByDocumentId[document.document_id] &&
        !metrics.totalPages;

      return {
        document,
        mergedLastReadPosition,
        progressPercent: metrics.progressPercent,
        isProgressLoading,
      };
    });
  }, [
    documents,
    localProgressByDocumentId,
    totalPagesByDocumentId,
    loadingTotalPagesByDocumentId,
  ]);

  useEffect(() => {
    void hydrateLocalProgress().catch(() => undefined);
    void fetchDocuments().catch(() => undefined);
  }, [fetchDocuments, hydrateLocalProgress]);

  useFocusEffect(
    useCallback(() => {
      void fetchDocuments().catch(() => undefined);
    }, [fetchDocuments]),
  );

  useEffect(() => {
    documents.forEach((document) => {
      const cachedTotalPages = totalPagesByDocumentId[document.document_id];
      if (typeof cachedTotalPages === "number" && cachedTotalPages > 0) {
        return;
      }
      void fetchDocumentTotalPages(document.document_id).catch(() => undefined);
    });
  }, [documents, totalPagesByDocumentId, fetchDocumentTotalPages]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDocuments();
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpload = async () => {
    try {
      const selected = await DocumentPicker.getDocumentAsync({
        type: ALLOWED_MIME_TYPES,
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (selected.canceled) {
        return;
      }

      const asset = selected.assets[0];
      if (!asset) {
        return;
      }

      if ((asset.size ?? 0) > MAX_FILE_SIZE_BYTES) {
        Alert.alert("File too large", "Please upload a file smaller than 50MB.");
        return;
      }

      setUploading(true);
      await uploadDocument({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
      });
      Alert.alert("Upload complete", "Your document is ready in your library.");
    } catch (uploadError) {
      Alert.alert("Upload failed", normalizeError(uploadError).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Screen style={styles.screen} contentContainerStyle={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#212121"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader
          userName={welcomeName}
          userInitial={userInitial}
          onEditProfilePress={() =>
            Alert.alert("Edit profile", "Edit profile coming soon")
          }
        />

        <View style={styles.categories}>
          <CategoryPill label="Website" icon="globe" />
          <CategoryPill label="Fanfiction" icon="bookOpen" />
        </View>

        <View style={styles.listWrap}>
          {isLoading ? <LoadingState message="Fetching your documents..." /> : null}
          {!isLoading && error ? (
            <ErrorState message={error} onRetry={() => void fetchDocuments()} />
          ) : null}
          {!isLoading && !error && documents.length === 0 ? (
            <EmptyState
              title="No documents yet"
              description="Upload your first file to start reading and listening."
            />
          ) : null}
          {!isLoading && !error
            ? documentCards.map(({ document, progressPercent, isProgressLoading, mergedLastReadPosition }) => (
                <DocumentProgressCard
                  key={document.document_id}
                  document={document}
                  progressPercent={progressPercent}
                  progressLoading={isProgressLoading}
                  onPress={() =>
                    router.push({
                      pathname: "/reader/[documentId]",
                      params: {
                        documentId: document.document_id,
                        title: document.document_title,
                        lastReadPosition: String(mergedLastReadPosition ?? 0),
                      },
                    })
                  }
                />
              ))
            : null}
        </View>

        <UploadDocumentButton onPress={handleUpload} loading={uploading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingHorizontal: scale(17),
    paddingBottom: verticalScale(28),
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: verticalScale(24),
  },
  categories: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(16),
    marginBottom: verticalScale(20),
  },
  listWrap: {
    marginBottom: verticalScale(6),
  },
});
