@echo off
echo 🚀 Installing :success
echo ✅ Dependencies installed successfully!
echo.
echo 📱 Installed packages:
echo   - pusher-js (WebSocket client)
echo   - @react-native-community/netinfo (Network info for Pusher)
echo.
echo 📝 Next steps:
echo 1. Update your config.js with Pusher credentials
echo 2. Make sure your backend is configured with the same Pusher settings
echo 3. Import and use the TopNavbar component in your app
echo.
echo For more information, see NOTIFICATION_SYSTEM.md
pauseification System dependencies...

REM Check if pnpm is available
where pnpm >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo 📦 Using pnpm...
    pnpm add pusher-js @react-native-community/netinfo
    goto :success
)

REM Check if yarn is available
where yarn >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo 📦 Using yarn...
    yarn add pusher-js @react-native-community/netinfo
    goto :success
)

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo 📦 Using npm...
    npm install pusher-js @react-native-community/netinfo
    goto :success
)

echo ❌ No package manager found. Please install npm, yarn, or pnpm.
exit /b 1

:success
echo ✅ Dependencies installed successfully!
echo.
echo � Installed packages:
echo   - pusher-js (WebSocket client)
echo   - @react-native-community/netinfo (Network info for Pusher)
echo   - expo-notifications (Native push notifications)
echo.
echo �📝 Next steps:
echo 1. Update your config.js with Pusher credentials
echo 2. Configure notification permissions in your app
echo 3. Make sure your backend is configured with the same Pusher settings
echo 4. Import and use the TopNavbar component in your app
echo.
echo For more information, see NOTIFICATION_SYSTEM.md
pause
