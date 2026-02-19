# NexusMarket Mobile App

Professional React Native classifieds marketplace application built with Expo.

## Quick Start

```bash
# Install dependencies
cd mobile
npm install

# Start development
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Features

✓ Browse listings with infinite scroll  
✓ Search and filter by category, price, location  
✓ User authentication  
✓ Professional dark theme  
✓ Profile management  
✓ Responsive design (iOS & Android)  
✓ Real-time search  
✓ Featured listings highlight  

## Project Structure

- `App.tsx` - Entry point
- `navigation/` - Navigation setup
- `screens/` - Screen components
- `app.json` - Expo configuration
- `assets/` - Icons and images

## Requirements

- Node.js v16+
- npm or pnpm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS) or Android Emulator

## Installation

See [MOBILE_APP_SETUP.md](../MOBILE_APP_SETUP.md) for detailed setup instructions.

## Configuration

Update API endpoint in `navigation/RootNavigator.tsx`:

```typescript
const API_URL = 'https://your-api-domain.com'
```

## Build & Deploy

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for iOS
eas build --platform ios --release

# Build for Android
eas build --platform android --release

# Submit to app stores
eas submit
```

## Available Scripts

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "eject": "expo eject"
}
```

## Architecture

**Navigation:**
- Bottom Tab Navigation (5 tabs)
- Stack Navigation for detail screens
- Proper back button handling

**State Management:**
- React Context for global state
- AsyncStorage for persistence

**UI Components:**
- Lucide icons
- Custom styled components
- Dark mode optimized

## API Integration

Connected to NexusMarket backend API:

- `/api/listings` - Get listings
- `/api/auth/*` - Authentication
- `/api/profiles` - User data
- `/api/metadata` - Categories & countries

## Performance

- Optimized FlatList rendering
- Image lazy loading
- Request caching
- Minimal bundle size

## Support

See main project README for overall documentation.

---

**Status:** Production Ready ✓
