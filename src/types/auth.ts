export interface VerifyEmailParams {
  email: string;
  vToken: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message?: string;
}
