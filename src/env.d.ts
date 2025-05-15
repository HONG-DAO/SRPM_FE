/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_URL: string;
    readonly VITE_API_URL: string;
    readonly VITE_JWT_SECRET: string;
    readonly VITE_JWT_EXPIRATION: string;
    readonly VITE_API_KEY_NAME: string;
    readonly VITE_API_KEY: string;
    // Add other env variables
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  