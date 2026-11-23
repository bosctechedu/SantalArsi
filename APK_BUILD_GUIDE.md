# Santal आ़रसी — Android APK बनाने की गाइड

यह प्रोजेक्ट Android APK पैकेजिंग (PWABuilder, Google Bubblewrap TWA, और Capacitor Offline APK) के लिए 100% तैयार है।

## तरीका 1 (सबसे आसान — 2 मिनट, बिना कोई सॉफ्टवेयर इंस्टॉल किए Real `.apk`)
1. पहले अपनी लाइव साइट अपडेट करें (`D:\PROJECT\SantalArsi` में):
   ```cmd
   cd /d D:\PROJECT\SantalArsi
   npx wrangler pages deploy dist --project-name=santalarsi --branch=main --commit-dirty=true
   ```
2. ब्राउज़र में **https://www.pwabuilder.com** खोलें।
3. URL बॉक्स में `https://santalarsi.pages.dev` लिखें और **Start** दबाएँ।
4. **Package For Stores → Android → Generate Package** पर क्लिक करें।
5. डाउनलोड हुए ZIP के अंदर तैयार **signed `.apk`**, **Play Store `.aab`**, और **`assetlinks.json`** मिल जाएगा।
6. बिना ब्राउज़र बार के फुल-स्क्रीन चलाने के लिए उस `assetlinks.json` को `public/.well-known/assetlinks.json` में कॉपी करके दोबारा deploy कर दें।

## तरीका 2 (Windows पर 1-Click Local APK Builder — Google Bubblewrap)
1. `D:\PROJECT\SantalArsi` में **`build-santalarsi-apk.bat`** पर डबल-क्लिक करें।
2. पहली बार यह अपने-आप JDK और Android CLI टूल्स डाउनलोड करने के लिए पूछेगा (`Yes` चुनें)।
3. कुछ मिनट में `android-twa\app-release-signed.apk` तैयार हो जाएगा।

## तरीका 3 (100% Offline Bundled APK — Capacitor + Android Studio)
`capacitor.config.json` पहले से तैयार है और `dist/` फोल्डर पहले से प्री-बिल्ट है:
```cmd
cd /d D:\PROJECT\SantalArsi
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap copy android
npx cap open android
```
Android Studio में **Build → Build Bundle(s) / APK(s) → Build APK(s)** चुनें।
