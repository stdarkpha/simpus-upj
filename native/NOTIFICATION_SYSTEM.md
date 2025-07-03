# React Native Notification System Implementation

## Overview

This notification system provides real-time notifications using:

-  **Pusher WebSockets** for real-time communication
-  **Native Push Notifications** for device-level alerts
-  **Polling fallback** for unreliable connections
-  **Auto-refresh** for history and data updates

## Features

-  ✅ Real-time WebSocket notifications via Pusher
-  ✅ Native device push notifications (no popups/alerts)
-  ✅ Auto-refresh of notification badge and count
-  ✅ Fallback polling when WebSocket is unavailable
-  ✅ Auto-close modals on real-time updates
-  ✅ Notification permissions handling
-  ✅ Cross-platform support (iOS/Android)

## Installation

To use the notification system, you need to install the required## Troubleshooting

### Common Issues

1. **"Unable to resolve @react-native-community/netinfo" error**

   ```bash
   # Install the missing dependency
   pnpm add @react-native-community/netinfo
   # or
   yarn add @react-native-community/netinfo
   # or
   npm install @react-native-community/netinfo
   ```

2. **Pusher connection issues**

   -  Check your Pusher credentials in `config.js`
   -  Ensure your backend is using the same Pusher app
   -  Check network connectivity
   -  Monitor console logs for connection status

3. **Notifications not appearing**

   -  Verify user authentication and token storage
   -  Check if the correct user ID is being used for channel subscription
   -  Ensure the backend is sending notifications to the correct channel format: `user.{userId}`

4. **Metro bundler issues with Pusher**
   ```javascript
   // If you encounter Metro bundling issues, try using this import instead:
   import Pusher from "pusher-js";
   ```

### Debug Mode

Enable verbose logging by adding this to your Pusher initialization:

```javascript
pusherRef.current = new Pusher(Config.PUSHER_KEY, {
   cluster: Config.PUSHER_CLUSTER,
   forceTLS: true,
   enabledTransports: ["ws", "wss"],
   enableLogging: __DEV__, // Enable logging in development
});
```

## Performance Considerations

-  Properly cleans up WebSocket connections
-  Clears polling intervals on unmount
-  Uses FlatList for efficient notification rendering
-  Animated badge for smooth user experiencedencies:

```bash
npm install pusher-js @react-native-community/netinfo
# or
yarn add pusher-js @react-native-community/netinfo
# or with pnpm
pnpm add pusher-js @react-native-community/netinfo
```

**Note**: `@react-native-community/netinfo` is required by pusher-js for network connectivity detection in React Native.

## Configuration

Update your `config.js` file with your actual Pusher credentials:

```javascript
const Config = {
   API_BASE_URL: "your-api-url",
   API_URL: "your-api-url",
   PUSHER_KEY: "your-actual-pusher-key",
   PUSHER_CLUSTER: "your-actual-pusher-cluster",
};
```

## Environment Variables

For production, use environment variables:

```bash
EXPO_PUBLIC_PUSHER_KEY=your_pusher_key
EXPO_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

## Features Implemented

### ✅ Real-time WebSocket Notifications

-  Connects to Pusher when user is authenticated
-  Subscribes to user-specific channel (`user.{userId}`)
-  Receives notifications in real-time
-  Automatically updates notification badge

### ✅ Notification Badge

-  Shows unread count on bell icon
-  Animated scale effect when new notifications arrive
-  Displays "99+" for counts over 99

### ✅ Notifications Panel

-  Modal that slides up from bottom
-  Lists all notifications with icons and timestamps
-  Different colors for different notification types
-  Mark all as read functionality

### ✅ Fallback Polling

-  Automatically falls back to polling if WebSocket fails
-  Polls every 30 seconds as backup
-  Handles network connectivity issues gracefully

### ✅ Notification Types

-  **Success**: Green icon (check-circle)
-  **Warning**: Yellow icon (warning)
-  **Error**: Red icon (error)
-  **Info**: Blue icon (info)

### ✅ Data Management

-  Fetches notifications from API on app start
-  Stores authentication token from AsyncStorage
-  Handles user data from AsyncStorage
-  Proper cleanup on component unmount

## Native Push Notifications

The system uses `expo-notifications` for native device notifications instead of popup alerts:

### ✅ Features

-  Native device notifications (system tray/notification panel)
-  Automatic permission requests
-  Sound and vibration support
-  Rich notification content with titles and messages
-  Custom notification channels (Android)

### ✅ Permissions

The app automatically requests notification permissions on startup:

-  **iOS**: Uses iOS notification permission system
-  **Android**: Creates notification channel and requests permissions

### ✅ Notification Behavior

When a WebSocket notification is received:

1. Native push notification is displayed
2. Notification badge updates
3. Internal notification list updates
4. No popup alerts or modals

### ✅ Fallback

If native notifications fail, the system logs the notification to console instead of showing alerts.

## Usage Example

```jsx
import UserNavbar from "./components/TopNavbar";

function App() {
   const userData = {
      data: {
         id: 123,
         name: "John Doe",
      },
   };

   return <UserNavbar status="authenticated" greetings="Pagi" userData={userData} />;
}
```

## API Endpoints Required

The component expects these API endpoints:

1. `GET /notifications` - Fetch user notifications
2. `PUT /notifications/read-all` - Mark all notifications as read

## WebSocket Events

Listens for Pusher events:

-  Channel: `user.{userId}`
-  Event: `notification.created`

## Data Structure

Expected notification format:

```javascript
{
   id: number,
   user_id: number,
   type: 'info' | 'success' | 'warning' | 'error',
   title: string,
   message: string,
   data?: any,
   timestamp?: string,
   is_read: boolean,
   created_at: string
}
```

## Error Handling

-  Gracefully handles Pusher connection failures
-  Falls back to polling if WebSocket unavailable
-  Logs errors to console for debugging
-  Shows user-friendly alerts for new notifications

## Performance Considerations

-  Properly cleans up WebSocket connections
-  Clears polling intervals on unmount
-  Uses FlatList for efficient notification rendering
-  Animated badge for smooth user experience
