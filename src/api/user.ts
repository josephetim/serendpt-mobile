import { apiGet } from "./client";
import { UserDetailResponse } from "../types/api";

export const getCurrentUser = () => apiGet<UserDetailResponse>("/users/me");
