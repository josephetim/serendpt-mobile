import { apiPost } from "./client";
import {
  GoogleIdTokenRequest,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  OTPRequest,
  ResendOTPRequest,
  SignupRequest,
} from "../types/api";

export const signup = (payload: SignupRequest) =>
  apiPost<LoginResponse, SignupRequest>("/signup", payload);

export const verifySignupOtp = (payload: OTPRequest) =>
  apiPost<LoginResponse, OTPRequest>("/verify-signup-otp", payload);

export const resendOtp = (payload: ResendOTPRequest) =>
  apiPost<MessageResponse, ResendOTPRequest>("/resend-otp", payload);

export const login = (payload: LoginRequest) =>
  apiPost<LoginResponse, LoginRequest>("/login", payload);

export const verifyLoginOtp = (payload: OTPRequest) =>
  apiPost<LoginResponse, OTPRequest>("/verify-login-otp", payload);

export const googleMobileAuth = (payload: GoogleIdTokenRequest) =>
  apiPost<LoginResponse, GoogleIdTokenRequest>("/auth/google/mobile", payload);
