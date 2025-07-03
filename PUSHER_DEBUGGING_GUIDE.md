# Pusher WebSocket Debugging Guide

## ✅ Configuration Verified

Your Pusher setup is correctly configured with:

-  **App ID**: `2009080`
-  **Key**: `668d263d6e1fb690800d`
-  **Secret**: `fc2000c3827cac26ca6c`
-  **Cluster**: `ap1`

## 🔍 Debugging Steps

### 1. Check Browser Console Logs

When you load the frontend, you should see these console logs:

```
🚀 Component mounted!
📊 Auth status: authenticated
👤 User data on mount: {id: 123, name: "User Name", ...}
📥 Loading notifications...
🔌 Initializing Pusher...
🚀 Initializing Pusher...
User data: {id: 123, name: "User Name", ...}
User ID: 123
📡 Creating Pusher instance with config: {key: "668d263d6e1fb690800d", cluster: "ap1", forceTLS: true}
📺 Subscribing to channel: notifications.user.123
🔄 Pusher connecting...
✅ Pusher connected successfully!
🌐 Connection state: connected
✅ Successfully subscribed to channel: notifications.user.123
🎯 Pusher setup completed
```

### 2. Test Notification Button

I've added a green "Test" button next to the bell icon. Click it to:

1. Send a test notification from your backend
2. Check if the WebSocket receives it

Expected console output when clicking test:

```
🧪 Testing Pusher notification...
🧪 Test response: {success: true, message: "Test notification sent successfully"}
✅ Test notification sent from backend
🔔 NEW NOTIFICATION RECEIVED!
📨 Notification data: {id: 456, title: "Test Notification", ...}
👤 For user: 123
📊 Updated unread count: 1
```

### 3. Check Pusher Dashboard

Go to your Pusher dashboard:

1. **Login** to [https://dashboard.pusher.com](https://dashboard.pusher.com)
2. **Select your app** (ID: 2009080)
3. **Go to Debug Console**
4. **Look for events** when you trigger notifications

### 4. Backend Event Broadcasting

Your backend code is correct:

```php
$notification = Notification::create([
    'user_id' => $user_id,
    'type' => 'lending',
    'title' => 'Lending ' . now()->format('Y-m-d H:i:s') . ' success',
    'desc' => 'Your book lending success you can go to library to verify the book lending',
    'variant' => 'success'
]);

// Broadcast notification to user in real-time
broadcast(new NotificationCreated($notification));
```

## 🚨 Troubleshooting

### If Pusher doesn't connect:

1. **Check network**: Ensure port 443 is open
2. **Check credentials**: Verify in Pusher dashboard
3. **Check cluster**: Ensure 'ap1' is correct for your app

### If notifications aren't received:

1. **Check channel name**: Should be `notifications.user.{user_id}`
2. **Check event name**: Should be `notification.created`
3. **Check user ID**: Ensure it matches between frontend and backend

### If backend doesn't broadcast:

1. **Check .env**: Ensure `BROADCAST_DRIVER=pusher`
2. **Check Laravel logs**: Look in `storage/logs/laravel.log`
3. **Test manually**: Use the test button or `/api/test/pusher` endpoint

## 🧪 Manual Testing Commands

### Test backend broadcasting:

```bash
curl -X POST http://your-domain.com/api/test/pusher \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### Check if broadcasting service is active:

```bash
php artisan about
```

## 📱 Expected Flow

1. **User logs in** → Frontend gets user data
2. **Component mounts** → Pusher initializes with user ID
3. **Pusher connects** → Subscribes to `notifications.user.{user_id}`
4. **User performs action** → Backend creates notification
5. **Backend broadcasts** → Pusher sends event to channel
6. **Frontend receives** → Updates UI and shows notification

## 🔧 Current Setup Status

✅ **Frontend**: Public channel subscription (no auth needed)
✅ **Backend**: Broadcasting to public channels
✅ **Credentials**: Correctly configured
✅ **Event**: NotificationCreated properly set up
✅ **Debug logs**: Comprehensive logging added
✅ **Test button**: Available for manual testing

Remove the test button in production by deleting the button element from the template!
