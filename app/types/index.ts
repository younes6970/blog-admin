export interface Response<T = unknown> {
  succeed: boolean;
  result: T;
  error: Error | null;
}
export interface Error { code: string; message: string }
export interface ErrorResponse { succeed: false; result: null; error: Error }
export interface TokenResponse { token: string }
