export interface StandardResponse<T> {
  provided: T;
  message: string;
  success: boolean;
  accessToken?: string;
}
