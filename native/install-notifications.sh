#!/bin/bash

# Instaecho "✅ Dependencies installed successfully!"
echo ""
echo "📱 Installed packages:"
echo "  - pusher-js (WebSocket client)"
echo "  - @react-native-community/netinfo (Network info for Pusher)"
echo ""
echo "📝 Next steps:"
echo "1. Update your config.js with Pusher credentials"
echo "2. Make sure your backend is configured with the same Pusher settings"
echo "3. Import and use the TopNavbar component in your app"
echo ""
echo "For more information, see NOTIFICATION_SYSTEM.md" for React Native Notification System
echo "🚀 Installing React Native Notification System dependencies..."

# Check if package manager is available
if command -v pnpm &> /dev/null; then
    echo "📦 Using pnpm..."
    pnpm add pusher-js @react-native-community/netinfo
elif command -v yarn &> /dev/null; then
    echo "📦 Using yarn..."
    yarn add pusher-js @react-native-community/netinfo
elif command -v npm &> /dev/null; then
    echo "📦 Using npm..."
    npm install pusher-js @react-native-community/netinfo
else
    echo "❌ No package manager found. Please install npm, yarn, or pnpm."
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""
echo "� Installed packages:"
echo "  - pusher-js (WebSocket client)"
echo "  - @react-native-community/netinfo (Network info for Pusher)"
echo "  - expo-notifications (Native push notifications)"
echo ""
echo "�📝 Next steps:"
echo "1. Update your config.js with Pusher credentials"
echo "2. Configure notification permissions in your app"
echo "3. Make sure your backend is configured with the same Pusher settings"
echo "4. Import and use the TopNavbar component in your app"
echo ""
echo "For more information, see NOTIFICATION_SYSTEM.md"
