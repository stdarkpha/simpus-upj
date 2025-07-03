# Pusher WebSocket Implementation Guide

## Overview

This implementation uses direct Pusher PHP SDK instead of Laravel Broadcasting to ensure compatibility with shared hosting environments.

## Backend Setup

### 1. PusherService

-  **File**: `backend/app/Services/PusherService.php`
-  **Purpose**: Direct Pusher communication without Laravel Broadcasting
-  **Methods**:
   -  `sendNotification($userId, $data)`: Send notification to specific user
   -  `broadcast($data)`: Send to all users
   -  `testConnection()`: Test Pusher connectivity
   -  `getChannelInfo($channel)`: Get channel information

### 2. Updated Controllers

#### NotificationController

-  **File**: `backend/app/Http/Controllers/Api/NotificationController.php`
-  **New method**: `create()` - Creates notification and sends via Pusher
-  **Integration**: Uses PusherService for real-time delivery

#### LendingController

-  **File**: `backend/app/Http/Controllers/Api/LendingController.php`
-  **Updated**: Lending success now sends Pusher notification
-  **Integration**: Uses PusherService for real-time delivery

#### TestController

-  **File**: `backend/app/Http/Controllers/Api/TestController.php`
-  **Methods**:
   -  `testPusher()`: Create test notification and send via Pusher
   -  `testConnection()`: Test Pusher connection only
   -  `getChannelInfo()`: Get channel info for debugging

### 3. Database Schema

-  **Migration**: `2025_07_03_155112_update_notifications_table_for_pusher.php`
-  **Changes**:
   -  `desc` → `message` (text field)
   -  Added `data` (JSON field for additional data)
   -  `type` enum: `['info', 'success', 'warning', 'error']`
   -  Removed `variant` field (now using `type`)

### 4. Environment Configuration

```env
# .env
BROADCAST_DRIVER=log
PUSHER_APP_ID=2009080
PUSHER_APP_KEY=668d263d6e1fb690800d
PUSHER_APP_SECRET=fc2000c3827cac26ca6c
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=ap1
```

## Frontend Setup

### 1. Environment Configuration

```env
# frontend/.env
PUSHER_KEY=668d263d6e1fb690800d
PUSHER_CLUSTER=ap1
```

### 2. Nuxt Configuration

-  **File**: `frontend/nuxt.config.ts`
-  **Added**: Pusher environment variables to runtimeConfig

### 3. Layout Component

-  **File**: `frontend/layouts/default.vue`
-  **Changes**:
   -  Removed SSE implementation
   -  Added Pusher.js integration
   -  Updated notification structure to match new schema
   -  Channel: `user.{userId}`
   -  Event: `notification.created`

## API Endpoints

### Notification Endpoints

```
GET    /api/notifications              - List user notifications
PUT    /api/notifications/{id}/read    - Mark notification as read
PUT    /api/notifications/read-all     - Mark all as read
GET    /api/notifications/unread-count - Get unread count
POST   /api/notifications              - Create notification (internal)
```

### Test Endpoints

```
POST   /api/test/pusher                - Test notification creation & Pusher
POST   /api/test/connection            - Test Pusher connection only
GET    /api/test/channel-info          - Get channel info for debugging
```

## Channel Structure

### User Channels

-  **Pattern**: `user.{userId}`
-  **Event**: `notification.created`
-  **Data Structure**:

```json
{
  "id": 123,
  "type": "success",
  "title": "Notification Title",
  "message": "Notification message",
  "data": {...},
  "timestamp": "2025-07-03T15:30:00.000Z",
  "is_read": false
}
```

## Testing

### 1. Backend Connection Test

```bash
curl -X POST http://localhost:8000/api/test/connection \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

### 2. Frontend Test Button

-  Located in notification panel header
-  Creates test notification and sends via Pusher
-  Check browser console for Pusher connection logs

### 3. Real Lending Flow

1. Add books to cart
2. Confirm lending
3. Notification should appear in real-time via Pusher

## Shared Hosting Considerations

### Benefits of Direct Pusher SDK

-  ✅ No Laravel Broadcasting dependency
-  ✅ No queue/job requirements
-  ✅ Direct HTTP API calls to Pusher
-  ✅ Compatible with shared hosting limitations
-  ✅ No Redis/database queue needed

### Fallback Strategy

-  Frontend includes polling fallback (30-second intervals)
-  If Pusher connection fails, polling will still deliver notifications
-  Browser notifications for important updates

## Debugging

### Backend Logs

```php
// Check Laravel logs for Pusher activity
tail -f storage/logs/laravel.log | grep Pusher
```

### Frontend Console

```javascript
// Enable Pusher debugging
pusher.connection.bind("all", (event, data) => {
   console.log("Pusher Event:", event, data);
});
```

### Common Issues

1. **CORS**: Ensure API_URL is correct in frontend .env
2. **Authentication**: Check Bearer token in requests
3. **Pusher Credentials**: Verify app_id, key, secret, and cluster
4. **Firewall**: Ensure port 443 is open for Pusher WebSocket connections

## Migration Notes

-  Old notifications with `type: lending/reminder` are mapped to `info/warning`
-  Old `desc` field content is preserved in new `message` field
-  `variant` field is removed (functionality merged into `type`)
