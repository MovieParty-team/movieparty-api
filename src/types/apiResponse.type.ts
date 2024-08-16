export interface ApiResponse<T> {
  provided: T;
  message: string;
  success: boolean;
  accessToken?: string;
}
