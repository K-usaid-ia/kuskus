// src/utils/config.ts
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  blockExplorerUrl:
    process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "https://celoscan.io",
};

export default config;
