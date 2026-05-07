import { apiGet, apiPost, apiPut } from "./client";
import {
  BatchDetail,
  DocumentSummary,
  MessageResponse,
  ProcessedDocumentSummary,
  UpdateLastReadPositionRequest,
} from "../types/api";

export interface UploadDocumentPayload {
  uri: string;
  name: string;
  mimeType?: string | null;
}

export const processDocument = async (
  payload: UploadDocumentPayload,
): Promise<ProcessedDocumentSummary> => {
  const formData = new FormData();
  formData.append("file", {
    uri: payload.uri,
    name: payload.name,
    type: payload.mimeType ?? "application/octet-stream",
  } as unknown as Blob);

  return apiPost<ProcessedDocumentSummary, FormData>("/process_document/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getDocumentsByEmail = async (): Promise<DocumentSummary[]> => {
  const data = await apiGet<DocumentSummary[] | { documents?: DocumentSummary[] }>(
    "/documents/by_email",
  );

  if (Array.isArray(data)) {
    return data;
  }

  return data.documents ?? [];
};

const isBatchDetail = (value: unknown): value is BatchDetail => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BatchDetail>;
  return (
    typeof candidate.document_id === "string" &&
    typeof candidate.batch_title === "string" &&
    typeof candidate.batch_content === "object" &&
    typeof candidate.batch_order === "number"
  );
};

export const getDocumentBatchesContent = async (
  documentId: string,
): Promise<BatchDetail[]> => {
  const data = await apiGet<
    BatchDetail | BatchDetail[] | { batches?: BatchDetail[]; items?: BatchDetail[] }
  >(`/documents/${documentId}/batches_content`);

  if (Array.isArray(data)) {
    return data.filter(isBatchDetail);
  }

  if ("batches" in data && Array.isArray(data.batches)) {
    return data.batches.filter(isBatchDetail);
  }

  if ("items" in data && Array.isArray(data.items)) {
    return data.items.filter(isBatchDetail);
  }

  if (isBatchDetail(data)) {
    return [data];
  }

  return [];
};

export const updateLastReadPosition = (
  documentId: string,
  payload: UpdateLastReadPositionRequest,
) =>
  apiPut<MessageResponse, UpdateLastReadPositionRequest>(
    `/documents/${documentId}/last_read_position`,
    payload,
  );
