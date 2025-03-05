/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Should be something like "https://gitea.example.com/api/v1"
  readonly VITE_GITEA_API_BASE_URL: string;
  readonly VITE_GITEA_OWNER: string;
  readonly VITE_GITEA_REPO: string;
}
