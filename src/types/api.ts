export type OtpPurpose = "signup" | "login" | "password_reset" | "email_change";

export interface SignupRequest {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user_email: string;
  otp_required: boolean;
  access_token?: string | null;
  token_type?: string | null;
}

export interface OTPRequest {
  email: string;
  otp_code: string;
}

export interface ResendOTPRequest {
  email: string;
  purpose: OtpPurpose;
}

export interface GoogleIdTokenRequest {
  id_token: string;
}

export interface DocumentSummary {
  document_id: string;
  user_email?: string | null;
  document_title: string;
  original_filename: string;
  uploaded_at: string;
  last_read_position?: number | null;
}

export interface ProcessedDocumentSummary {
  document_id: string;
  user_email?: string | null;
  document_title: string;
  original_filename: string;
  uploaded_at: string;
}

export interface BatchDetail {
  document_id: string;
  batch_title: string;
  batch_content: Record<string, string>;
  batch_order: number;
}

export interface UpdateLastReadPositionRequest {
  last_read_position: number;
}

export interface Voice {
  name: string;
  image_url: string;
  tag: string;
  disabled?: boolean;
}

export interface VoicesResponse {
  voices: Voice[];
}

export interface AudioStreamRequest {
  document_id: string;
  batch_order?: number;
  language?: string;
  speaker?: string;
}

export interface TextToAudioRequest {
  text: string;
  language?: string;
  speaker?: string;
}

export interface TextToAudioResponse {
  audio_base64: string;
  words?: Array<Record<string, unknown>>;
  duration: number;
  sample_rate?: number;
  text?: string | null;
}

export interface UserDetailResponse {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  is_verified: boolean;
  plan: string;
  word_count_remaining: number;
  qa_prompts_remaining: number;
  google_id?: string | null;
}

export interface MessageResponse {
  message: string;
}

export interface ChatRequest {
  document_id: string;
  batch_order: number;
  question: string;
}

export interface ChatResponse {
  user_message: string;
  intent: string;
  ai_response: string;
  conversation_id: string;
}

export interface ConversationItem {
  id?: string;
  role: "user" | "assistant";
  text: string;
  created_at?: string;
}
