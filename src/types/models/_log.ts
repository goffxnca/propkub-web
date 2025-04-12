export interface LogPayload {
  [key: string]: any;
}

export interface LogParams {
  action: string;
  type: string;
  payload: LogPayload;
}

export interface LogResponse {
  success: boolean;
  message?: string;
} 