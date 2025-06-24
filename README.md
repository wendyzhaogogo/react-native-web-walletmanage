# React Native Web Demo

This project is a demo application built with React Native Web, allowing you to run your React Native code on the web platform.

## Features

- Cross-platform compatibility (iOS, Android, and Web)
- Modern UI with Tailwind CSS
- Navigation using React Navigation
- Custom modal components
- Crypto utilities

## Prerequisites

- Node.js (v18 or later)
- pnpm (v9.11.0 or later)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/react-native-web-walletmanage.git
   cd react-native-web-walletmanage
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Running the App

### Web

To run the app on the web:

```bash
pnpm run web
```

### iOS

To run the app on iOS:

```bash
pnpm run ios
```

### Android

To run the app on Android:

```bash
pnpm run android
```

## Building for Web

To build the app for web deployment:

```bash
pnpm run build:web
```

The build output will be in the `dist` directory.

## Configuration

The app uses Expo for configuration. Key settings are in `app.json`:

- `baseUrl`: Base URL for web assets
- `publicPath`: Public path for static assets

## License

MIT 