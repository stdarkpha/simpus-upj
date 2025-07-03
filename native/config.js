// config.js - Environment configuration
const Config = {
   API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "https://besimpus.farouq.me/api",
   // For backward compatibility
   API_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "https://besimpus.farouq.me/api",

   // Pusher Configuration
   PUSHER_KEY: process.env.EXPO_PUBLIC_PUSHER_KEY || "668d263d6e1fb690800d",
   PUSHER_CLUSTER: process.env.EXPO_PUBLIC_PUSHER_CLUSTER || "ap1",

   // App Configuration
   APP_NAME: "SIMPus UPJ",
   VERSION: "1.0.0",
};

export default Config;
