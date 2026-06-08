export interface AuthUser {
  id: string;
  name?: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  user?: AuthUser;
  data?: {
    token?: string;
    accessToken?: string;
    jwt?: string;
    user?: AuthUser;
  };
}