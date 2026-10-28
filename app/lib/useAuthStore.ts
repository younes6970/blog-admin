import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tokenService } from "./api/tokenService";


type Permissions = Record<string, string[]>;

export type AuthUser = {
  name?: string;
  username?: string;
  email?: string;
  id?: string;
};

function getAuthUser(payload: Record<string, unknown>): AuthUser {
  const firstName = String(payload.given_name ?? payload.firstName ?? "");
  const lastName = String(payload.family_name ?? payload.lastName ?? "");
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    name: String(payload.name ?? fullName) || undefined,
    username:
      String(
        payload.preferred_username ?? payload.unique_name ?? payload.username ?? "",
      ) || undefined,
    email: String(payload.email ?? "") || undefined,
    id: String(payload.sub ?? payload.userId ?? "") || undefined,
  };
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;

  permissions: Permissions;
  roles: string[];
  user: AuthUser | null;

  login: (accessToken: string) => void;
  logout: () => void;
  checkAuth: () => void;

  can: (permission: string) => boolean;
  hasMenu: (key: string) => boolean;
}

function parseJwt(token: string) {
  const json = atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"));

  return JSON.parse(
    decodeURIComponent(
      json
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    ),
  );
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,

      permissions: {},
      roles: [],
      user: null,

      login: (accessToken) => {
        const payload = parseJwt(accessToken);
        if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
          throw new Error("Token expired");
        }
        tokenService.setTokens(accessToken);

        set({
          isAuthenticated: true,
          isLoading: false,
          permissions:
            typeof payload.permissions === "string"
              ? JSON.parse(payload.permissions)
              : (payload.permissions ?? {}),
          roles:
            typeof payload.roles === "string"
              ? JSON.parse(payload.roles)
              : (payload.roles ?? []),
          user: getAuthUser(payload),
        });
      },

      logout: () => {
        tokenService.clearTokens();

        set({
          isAuthenticated: false,
          permissions: {},
          roles: [],
          user: null,
        });

        toast.info("با موفقیت خارج شدید", {
          id: "LOGOUT_SUCCESS",
          duration: 3000,
        });

        window.location.href = "/login";
      },

      checkAuth: () => {
        try {
          const token = tokenService.getAccessToken();

          if (!token) {
            set({
              isAuthenticated: false,
              isLoading: false,
              permissions: {},
              roles: [],
              user: null,
            });

            return;
          }

          const payload = parseJwt(token);
          if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
            throw new Error("Token expired");
          }

          set({
            isAuthenticated: true,
            isLoading: false,
            permissions:
              typeof payload.permissions === "string"
                ? JSON.parse(payload.permissions)
                : (payload.permissions ?? {}),
            roles:
              typeof payload.roles === "string"
                ? JSON.parse(payload.roles)
                : (payload.roles ?? []),
            user: getAuthUser(payload),
          });
        } catch (error) {
          console.error("Error checking auth:", error);

          tokenService.clearTokens();

          set({
            isAuthenticated: false,
            isLoading: false,
            permissions: {},
            roles: [],
            user: null,
          });
        }
      },

      can: (permission) => {
        const { permissions } = get();

        return Object.values(permissions).flat().includes(permission);
      },

      hasMenu: (key) => {
        const { permissions } = get();

        return key in permissions;
      },
    }),
    {
      name: "admin-auth-storage",

      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
        roles: state.roles,
        user: state.user,
      }),
    },
  ),
);
