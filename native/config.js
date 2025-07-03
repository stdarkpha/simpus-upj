// config.js - Environment configuration
const Config = {
   API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "https://besimpus.farouq.me/api",
   // For backward compatibility
   API_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "https://besimpus.farouq.me/api",
};

export default Config;
