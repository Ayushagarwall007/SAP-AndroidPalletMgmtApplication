# SAP Mobile

A React Native mobile application built with **Expo** and **TypeScript**. Runs on **iOS** and **Android**.

## Prerequisites

- **Node.js** 18+
- **npm** or yarn

### iOS (Mac only)

- **Xcode** (from Mac App Store) and Xcode Command Line Tools: `xcode-select --install`
- **iOS Simulator**: included with Xcode (Xcode → Open Developer Tool → Simulator)
- Or use [Expo Go](https://expo.dev/go) on a physical iPhone

### Android

- **Android Studio** with:
  - Android SDK
  - Android SDK Platform (e.g. API 34)
  - Android Virtual Device (AVD) — create one in Device Manager
- Or use [Expo Go](https://expo.dev/go) on a physical Android device

## Setup

```bash
npm install
```

## Run on iOS

**Option A — Expo Go (simulator or device)**  
Starts Metro and opens the app in the iOS Simulator or in Expo Go:

```bash
npm run ios
```

Or start the dev server and press **i**:

```bash
npm start
# then press i
```

**Option B — Native build (development build)**  
Builds and runs the native iOS app (no Expo Go):

```bash
npm run ios:native
```

## Run on Android

**Option A — Expo Go (emulator or device)**  
Starts Metro and opens the app in the Android emulator or in Expo Go:

```bash
npm run android
```

Or start the dev server and press **a**:

```bash
npm start
# then press a
```

**Option B — Native build (development build)**  
Builds and runs the native Android app (no Expo Go):

```bash
npm run android:native
```

> **Note:** For native builds, ensure an Android emulator is running or a device is connected (`adb devices`).

## Zebra device installation & testing (Infrared scanner)

This app can be tested on **Zebra Android devices** (e.g. TC52, MC93) for infrared/pallet scanning.

### Full configuration checklist (on the Zebra device)

Do these in order. Menu names may vary slightly by device/DataWedge version.

| # | What to do | Where / value |
|---|------------|----------------|
| 1 | **Install the app** | Install SAP-Mobile APK (from EAS Build link or `app-release.apk`). |
| 2 | **Open DataWedge** | App drawer or **Settings → DataWedge**. |
| 3 | **Create or choose a profile** | **Profiles** → Create new (e.g. “SAP-Mobile”) or edit an existing one. |
| 4 | **Set Associated app** | In the profile: **Associated apps** (or Application association) → **Add application** → enter **`com.anonymous.SAPMobile`**. Activity: **`*`**. Save. |
| 5 | **Enable Barcode input** | In the profile: **Input** → **Barcode** → enable the scanner (1D/2D imager or camera as needed). Enable **Hardware trigger** if you want the side button to trigger scan. |
| 6 | **Set Keystroke output** | In the profile: **Output** → **Keystroke** → **Enable**. Ensure **Send Enter key** (or append Enter) is **enabled** so each scan ends with Enter. |
| 7 | **Disable Intent output (if present)** | In **Output**, ensure **Intent** is **off** or not used for this profile so data goes to Keystroke only. |
| 8 | **Save and activate** | Save the profile. It becomes active when SAP-Mobile is in the foreground. |

### Install the app (step 1 detail)

1. Install the SAP-Mobile APK on the Zebra device (use the [APK build link or file](#building-an-apk-share-with-others) from EAS Build or local build).
2. Open the app and go to **Home → Partial Pallet → Infrared Scanner**.

### DataWedge summary (steps 2–8)

- **Associated app:** `com.anonymous.SAPMobile` (exact package name).
- **Output:** **Keystroke** enabled; **Send Enter key** enabled; Intent off for this profile.
- **Input:** Barcode scanner enabled; hardware trigger on if you use the side button.

### How to scan

- On the **Infrared Scanner** screen, press the **device side (scan) button** to trigger a scan.
- Point at the barcode/QR; the decoded value appears in the **Scanner input** box and as “Last scan” / “Recent scans.”
- If nothing happens: **tap the “Scanner input” box** once (so it has focus), then press the side scan button again.

**If infrared still doesn’t work:** (1) In DataWedge profile, set **Output** to **Keystroke** (not Intent). (2) Confirm **Associated app** is exactly `com.anonymous.SAPMobile`. (3) Reboot the device and open SAP-Mobile → Infrared Scanner, tap the scanner input, then scan.

> **Note:** The reference test app (e.g. zsacn.apk) uses package `com.mdk.zscan`. Our app uses **`com.anonymous.SAPMobile`**. When testing SAP-Mobile, DataWedge must be associated with **com.anonymous.SAPMobile**.

---

## Building an APK (share with others)

### Option 1: EAS Build (recommended — get a download link)

1. Install EAS CLI and log in (one-time):
   ```bash
   npm install -g eas-cli
   eas login
   ```
2. Build the APK in the cloud:
   ```bash
   eas build --platform android --profile preview
   ```
3. When the build finishes, EAS gives you a **link to download the APK**. Share that link with your friend; they open it on their Android device and install.

### Option 2: Local APK on your machine

1. Ensure `android/local.properties` has `sdk.dir` set (see above).
2. Build the release APK:
   ```bash
   yarn build:apk
   ```
   or:
   ```bash
   cd android && ./gradlew assembleRelease
   ```
3. The APK is at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```
4. Share that file (email, Drive, etc.); your friend installs it on their Android device (they may need to allow “Install from unknown sources” for the browser or file app).

## All scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Metro; use **i** / **a** for iOS / Android |
| `npm run ios` | Start Metro and open iOS (Expo Go) |
| `npm run android` | Start Metro and open Android (Expo Go) |
| `npm run ios:native` | Build and run native iOS app |
| `npm run android:native` | Build and run native Android app |
| `npm run build:apk` | Build release APK locally |
| `npm run web` | Run in the browser |

## Project structure

```
├── App.tsx                 # App entry with navigation
├── src/
│   ├── navigation/         # Tab navigator
│   ├── screens/            # Home, Profile
│   └── theme/              # Colors and shared styles
├── assets/                 # Icons and splash
└── app.json                # Expo config
```

## Stack

- **Expo** (SDK 55)
- **React Native** 0.83
- **React Navigation** (bottom tabs)
- **TypeScript**
