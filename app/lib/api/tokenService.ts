const ACCESS_TOKEN_KEY = "admin-access-token";

export const tokenService = {
  getAccessToken(): string | null {
    return typeof window === "undefined" ? null : window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setTokens(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  login(): boolean {
    return !!this.getAccessToken();
  },
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};

export default tokenService;
