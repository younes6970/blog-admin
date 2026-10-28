import type { Response, TokenResponse } from "~/types";
import { apiPost } from "../api/api";

export type ServiceLoginParams = { username: string; password: string };

// Adapt this endpoint and response contract when connecting the new backend.
export const serviceLogin = (params: ServiceLoginParams) =>
  apiPost<ServiceLoginParams, Response<TokenResponse>>("/auth/login", params);
