import { apiRequest } from "./api-client";
import type { AuthResponse, AuthSession, LoginCredentials, RegisterCredentials } from "../types/auth";

function buildAuthSession(response: AuthResponse): AuthSession {
  const token =
    response.token ??
    response.accessToken ??
    response.jwt ??
    response.data?.token ??
    response.data?.accessToken ??
    response.data?.jwt;
  const user = response.user ?? response.data?.user;

  if (!token) {
    throw new Error("La respuesta de autenticación no incluyó un token.");
  }

  if (!user) {
    throw new Error("La respuesta de autenticación no incluyó el usuario.");
  }

  return {
    token,
    user,
  };
}

export async function login(credentials: LoginCredentials) {
  const response = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: credentials,
    auth: false,
  });

  return buildAuthSession(response);
}

export async function register(credentials: RegisterCredentials) {
  const response = await apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: credentials,
    auth: false,
  });

  return buildAuthSession(response);
}

export async function me() {
  return apiRequest<AuthSession["user"]>("/api/auth/me");
}