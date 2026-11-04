import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { src, cfg } from './files.js';

const S = 'Advanced Apps and Release';
const HONEST = "The code in this course was syntax-checked with a TypeScript parser. It was not run on a phone or emulator while the course was written, so type it in, run it with Expo and fix any small differences your versions show. Always install Expo libraries with `npx expo install` so the versions match your Expo SDK.";

export const lessons = [
  // 10
  les(S, 'project-8-photo-journal-camera-image-picker-and-file-system', 'Project 8: Photo Journal with Camera and File System', 'Project 8: Photo Journal with Camera',
    'Build a photo journal with expo-image-picker and expo-file-system: ask for camera and library permissions, copy photos into app storage and save captions.', [
    P("Phones have a camera, a photo library and file storage, and apps use them constantly. This project teaches how to use device features safely. The most important lesson is permissions. The user must agree before your app uses the camera or photos, and your app must still work when they say no."),
    H("Concepts in this project"),
    L("**expo-image-picker**: opens the photo library or the camera. It returns a temporary file address (`uri`).", "**Permissions**: call `requestCameraPermissionsAsync` or `requestMediaLibraryPermissionsAsync` and check `granted`. Explain, with `Alert`, what to do when permission is denied.", "**expo-file-system**: copy the picked photo into the app's own document folder so it stays after the temporary file is cleaned up.", "**Metadata in AsyncStorage**: the caption, date and file address for each entry.", "**Cleaning up**: delete the file when the entry is deleted, so storage does not fill with orphan photos.", "**Permission texts**: iOS shows a message you write in `app.json`. Use clear, honest text."),
    H("Create the project"),
    O("Use a blank Expo TypeScript project.", "Install the libraries: `npx expo install expo-image-picker expo-file-system @react-native-async-storage/async-storage`.", "Add the permission texts to `app.json` (below).", "Add `journal.ts` and replace `App.tsx`."),
    ...cfg('config/permissions.txt', 'app.json permission texts'),
    ...src('p8/journal.ts', 'journal.ts'),
    ...src('p8/App.tsx', 'App.tsx'),
    H("How it works"),
    L("`add` first asks for permission, then opens the picker or the camera. If the user cancels, nothing happens.", "`addEntry` copies the temporary photo into the `photos/` folder with a new name and saves the entry list.", "The list shows each photo with its caption and date. Delete removes the file and the entry.", "The camera works on a real phone. Emulators may only have a simulated camera."),
    N("API names in Expo libraries change between SDK versions. For example, newer versions of file system have a newer object-based API alongside the classic functions used here. If an import is reported as deprecated, check that library's page in the Expo docs for the current names."),
    H("Expected output"),
    P("The screen shows Photo Journal, a caption box and two buttons, Choose photo and Take photo. Tap Choose photo: the system asks permission the first time. Allow it, pick a photo and it appears as a card with your caption and today's date. Add another with the camera. Close and reopen the app: both entries are still there with their photos. Delete one and it disappears. If you deny permission, the app shows an alert and keeps working."),
    N(HONEST),
    ...task("Build the app on a real phone and add one photo from the library and one from the camera.", "Deny permission once and read the alert. Then allow it in the phone's Settings and try again.", "Tap a photo to show it full screen in a Modal.", "Add a search box that filters entries by caption."),
    ...check("Photos remain after the app restarts.", "Denied permission produces a message, not a crash.", "Deleting an entry also removes its file."),
  ], A('Using the camera safely', [
    n('user', 'User taps', 'Take photo', 0, 0, 'user'), n('perm', 'Permission', 'ask, check granted', 1, 0, 'check'),
    n('pick', 'Image picker', 'returns a temp uri', 2, 0, 'tool'), n('fs', 'File system', 'copy + save entry', 3, 0, 'store'),
  ], [
    { say: 'The user taps Take photo.', on: ['user'] },
    { say: 'The app asks for camera permission and stops with a message if it is denied.', flow: ['user>perm:request'] },
    { say: 'If it is allowed, the picker opens the camera and returns a temporary file address.', flow: ['perm>pick:granted'] },
    { say: 'The app copies the file into its own folder and saves the caption and date.', flow: ['pick>fs:copy'] },
  ]), [
    faq('Why copy the photo?', 'The picker gives a temporary address that the system may clear. Copying it into the app\'s document folder keeps it as long as the app is installed.'),
    faq('What if the user denies permission forever?', 'On many systems the request cannot be shown again. Explain what the feature needs and offer a button that opens the app\'s settings using Linking.openSettings().'),
    faq('Does the camera work in Expo Go?', 'Yes on a real phone for the picker and camera used here. Some libraries need a development build instead of Expo Go, and the Expo docs say so on each library page.'),
  ]),

  // 11
  les(S, 'project-9-habit-tracker-streaks-and-local-notifications', 'Project 9: Habit Tracker with Streaks and Notifications', 'Project 9: Habit Tracker with Notifications',
    'Build a habit tracker with streaks calculated from dates, saved data and a daily reminder using expo-notifications and permission handling.', [
    P("Habit and reminder apps feel alive because they remember your progress and nudge you at the right time. This project covers two things: a clean way to calculate streaks from dates, and **local notifications**, which the app schedules on the phone itself with no server."),
    H("Concepts in this project"),
    L("**Date keys**: store each completed day as a text key such as `2026-11-04`. Text keys avoid time-zone bugs from storing full timestamps.", "**Streak function**: a plain function counts consecutive days ending today, or yesterday if today is not done yet, so a streak is not shown as broken during the day.", "**Local notifications**: `scheduleNotificationAsync` with a daily trigger fires every day at a set time, even when the app is closed.", "**Permission**: ask with `requestPermissionsAsync`. On Android 8 and later you also create a notification channel.", "**Notification handler**: tells the app how to show notifications that arrive while it is open.", "**Limits**: remote push notifications (sent from a server) need more setup and are outside this lesson. Notifications can behave differently in Expo Go. For a faithful test, use a development build."),
    H("Create the project"),
    O("Use a blank Expo TypeScript project.", "Install: `npx expo install expo-notifications @react-native-async-storage/async-storage`.", "Add the plugin entry for expo-notifications to `app.json` (see lesson 10's permissions file).", "Add `habits.ts` and `reminders.ts`, and replace `App.tsx`."),
    ...src('p9/habits.ts', 'habits.ts'),
    ...src('p9/reminders.ts', 'reminders.ts'),
    ...src('p9/App.tsx', 'App.tsx'),
    H("How it works"),
    L("`dayKey` makes the date key. `streak` walks backwards from today while days are in the set.", "Marking done toggles today's key in the habit's list. The streak is calculated while rendering, not stored.", "The reminder switch asks for permission, cancels old reminders and schedules one daily at 8 pm. Turning it off cancels all of them.", "If permission is refused, the switch stays off and an alert explains how to fix it."),
    N("The notification trigger format has changed between Expo SDK versions. This code uses the typed form. If your editor reports a type error on `trigger`, check the expo-notifications page in the Expo docs for your SDK."),
    H("Expected output"),
    P("The screen shows Habits, a reminder switch and a box to add habits. Add Read and Walk. Press Mark done on Read: the button turns green and says Done, and the line reads \"1 day streak\". Press it again to undo. Turn on the reminder: a permission request appears. Allow it. At 8 pm each day you receive a notification titled Habit check-in. To test faster, change the hour and minute to a time a minute or two ahead. Close and reopen the app: habits and streaks remain."),
    N(HONEST),
    ...task("Build the app, add two habits and mark one done.", "Schedule the reminder for two minutes ahead and confirm that it arrives.", "Deny the permission once and check that the app handles it.", "Run the streak tests from the testing lesson."),
    ...check("Streaks and habits persist.", "The reminder arrives on a device.", "You can explain why dates are stored as text keys."),
  ], A('Streak and reminder', [
    n('done', 'Mark done', 'adds today\'s key', 0, 0, 'user'), n('store', 'Saved dates', '2026-11-04', 1, 0, 'store'),
    n('streak', 'streak()', 'count back from today', 2, 0, 'tool'), n('note', 'Notification', 'daily at 8 pm', 3, 0, 'out'),
  ], [
    { say: 'The user marks a habit done and today\'s date key is added.', flow: ['done>store:save'] },
    { say: 'The streak function counts back through consecutive days.', flow: ['store>streak:dates'] },
    { say: 'A separate daily reminder is scheduled once, with permission.', on: ['note'] },
    { say: 'Each evening the phone shows the notification, even if the app is closed.', flow: ['streak>note:motivates'] },
  ]), [
    faq('Local or push notifications?', 'Local notifications are scheduled by the app on the phone and need no server. Push notifications are sent from a server to many devices, and need a token and a backend.'),
    faq('Why not store timestamps?', 'A timestamp depends on the time zone. A date key like 2026-11-04 means the same day for the user no matter when you read it.'),
    faq('Why is my notification late or missing?', 'Check permission, battery saver settings and the channel on Android, and the Focus modes on iPhone. Test on a real device, not an emulator.'),
  ]),

  // 12
  les(S, 'project-10-shop-app-zustand-cart-tabs-and-product-list', 'Project 10 Capstone: Shop App with Zustand and Tabs', 'Project 10: Shop App with Zustand',
    'Build a shop app capstone with a product grid, category filter, a Zustand cart store, tab navigation with a live cart count and a demo checkout.', [
    P("The last project brings together a typical shop: products from an API, filters, a cart and two tabs. It adds **Zustand**, a small, popular state library. A cart is a good example of global state because many screens read and change it, and the tab bar even shows its count."),
    H("Concepts in this project"),
    L("**Zustand store**: `create` makes a store with state and actions. Components read what they need with a selector like `useCart((s) => s.add)`, and re-render only when that part changes.", "**Selectors and derived data**: `cartCount` and `cartTotal` are plain functions over the lines, so they cannot go out of date.", "**Tabs**: `Tabs` from Expo Router gives a bottom tab bar. The Cart tab label shows the live count.", "**FlatList grid**: `numColumns={2}` makes a product grid. A horizontal FlatList shows category chips.", "**TanStack Query** loads the products (project 7).", "**Data source**: the Fake Store API at fakestoreapi.com. It is a free practice API, so check that it is still online. Prices are demo values, and the checkout here only clears the cart."),
    H("Create the project"),
    O("Use an Expo Router project.", "Install: `npm install zustand @tanstack/react-query`.", "Create the files below. Note that `cart.ts` (the store) lives in `src`, and `cart.tsx` (the screen) lives in `app`."),
    C('text', `my-app/
  app/
    _layout.tsx    Tabs + QueryClientProvider
    index.tsx      Shop tab: products
    cart.tsx       Cart tab
  src/
    api.ts         fetchProducts
    cart.ts        the Zustand store`),
    ...src('p10/cart.ts', 'src/cart.ts'),
    ...src('p10/api.ts', 'src/api.ts'),
    ...src('p10/_layout.tsx', 'app/_layout.tsx'),
    ...src('p10/index.tsx', 'app/index.tsx'),
    ...src('p10/CartScreen.tsx', 'app/cart.tsx'),
    H("How it works"),
    L("`add` increases the quantity if the product is already in the cart, or adds a new line. `decrease` removes a line when its quantity reaches zero. `flatMap` makes that easy.", "The shop reads only `add` from the store, so it does not redraw when quantities change elsewhere.", "The cart tab label reads the count with a selector and updates instantly.", "Place demo order clears the cart. A real checkout needs a payment provider and a server, which this app does not include."),
    H("Expected output"),
    P("The Shop tab shows category chips (All and the categories from the API) above a two-column grid of products with pictures, titles and prices. Tap Add to cart on two products: the tab shows Cart (2). Open the Cart tab: the lines show images, titles, line prices and − and + buttons. Press + on a line and the total goes up. Press − until the quantity is zero and the line disappears. Press the ✕ to remove a line. Place demo order empties the cart."),
    N(HONEST),
    ...task("Build the app and fill the cart from two categories.", "Persist the cart with Zustand's `persist` middleware and AsyncStorage.", "Add a product detail screen with a larger image and description.", "Add a promo code text box that applies a fixed discount, and show the saved amount."),
    ...check("The cart count in the tab bar matches the items.", "Quantities and totals stay correct as you tap + and −.", "You can explain why a selector keeps screens from redrawing."),
  ], A('A shared cart store', [
    n('shop', 'Shop tab', 'Add to cart', 0, 0, 'app'), n('store', 'Zustand store', 'lines + actions', 1, 0, 'store'),
    n('tab', 'Tab label', 'Cart (2)', 2, 0, 'out'), n('cart', 'Cart tab', 'qty and total', 3, 0, 'app'),
  ], [
    { say: 'The user taps Add to cart on a product.', on: ['shop'] },
    { say: 'The action updates the store.', flow: ['shop>store:add'] },
    { say: 'The tab label reads the count from the store and shows Cart (2).', flow: ['store>tab:count'] },
    { say: 'The Cart tab reads the same lines and total, so all screens agree.', flow: ['tab>cart:same store'] },
  ]), [
    faq('Zustand, Redux or Context?', 'Context is fine for small shared state. Zustand is lighter than Redux, has less code and avoids needless re-renders with selectors. Redux Toolkit is common in big teams, so it is worth reading about.'),
    faq('Why use selectors?', 'A selector subscribes a component to only one piece of the store. The component redraws only when that piece changes.'),
    faq('How would I add real payments?', 'Use a payment provider\'s official SDK or hosted checkout and a server that creates orders. Never handle card numbers yourself.'),
  ]),

  // 13
  les(S, 'forms-validation-secure-storage-and-api-authentication', 'Forms, Validation, Secure Storage and Authentication', 'Forms, Secure Storage and Authentication',
    'Build React Native forms with validation, store tokens safely with expo-secure-store and design login flows with protected routes in Expo Router.', [
    P("Almost every real app needs a login or sign-up form, and the data it handles is sensitive. This lesson shows how to build forms that give clear feedback, where to store a login token, and how to protect screens. It uses short examples that you can add to the apps you built. It does not need a project of its own."),
    H("Forms and validation"),
    P("A form is state plus rules. Keep each field in state, validate on submit (and on blur for a nicer feel) and show the message next to the field. Return errors from a plain function so you can test it."),
    C('ts', `export type Errors = { email?: string; password?: string };

export function validateLogin(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) errors.email = "Enter a valid email";
  if (password.length < 8) errors.password = "Use at least 8 characters";
  return errors;
}`),
    C('tsx', `const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errors, setErrors] = useState<Errors>({});

const submit = () => {
  const found = validateLogin(email, password);
  setErrors(found);
  if (Object.keys(found).length === 0) signIn(email.trim(), password);
};

<TextInput value={email} onChangeText={setEmail} keyboardType="email-address"
  autoCapitalize="none" autoComplete="email" placeholder="Email" />
{errors.email && <Text style={{ color: "#c92a2a" }}>{errors.email}</Text>}
<TextInput value={password} onChangeText={setPassword} secureTextEntry
  autoComplete="password" placeholder="Password" />
{errors.password && <Text style={{ color: "#c92a2a" }}>{errors.password}</Text>}`),
    P("Use the right keyboard type, turn off auto-capitalisation for emails, and `secureTextEntry` for passwords. Wrap long forms in `KeyboardAvoidingView` and a `ScrollView` with `keyboardShouldPersistTaps=\"handled\"` so the keyboard does not hide the fields. For big forms, libraries such as React Hook Form with a schema validator like Zod save work."),
    P("Client-side checks are for user experience only. The server must validate everything again, because anyone can send requests without your app."),
    H("Where to store a token"),
    P("After login, your server returns a token that proves who the user is. AsyncStorage is not encrypted, so it is not the place for it. Use **expo-secure-store**, which keeps values in the iOS Keychain and the Android Keystore."),
    C('ts', `import * as SecureStore from "expo-secure-store";

const TOKEN = "auth.token";
export const saveToken = (t: string) => SecureStore.setItemAsync(TOKEN, t);
export const readToken = () => SecureStore.getItemAsync(TOKEN);
export const clearToken = () => SecureStore.deleteItemAsync(TOKEN);`),
    P("Install it with `npx expo install expo-secure-store`. Keep tokens short-lived and refresh them as your backend allows. Send them in a header, never in the URL: `fetch(url, { headers: { Authorization: \\`Bearer \\${token}\\` } })`."),
    H("Protecting screens"),
    P("A simple pattern with Expo Router keeps signed-in screens in one group and redirects when there is no session. Keep the session in a small Context or Zustand store that loads the token at start."),
    C('tsx', `// app/(app)/_layout.tsx  -- only signed-in users reach these screens
import { Redirect, Stack } from "expo-router";
import { useSession } from "../../src/session";

export default function AppLayout() {
  const { token, loading } = useSession();
  if (loading) return null;               // or a splash screen
  if (!token) return <Redirect href="/login" />;
  return <Stack />;
}`),
    P("Files under `app/(app)/` are protected, and `app/login.tsx` stays open. The parentheses make a group that does not appear in the URL."),
    H("Security habits"),
    L("Never put secrets, private keys or API keys with write power in the app.", "Use HTTPS only.", "Never log passwords or tokens.", "Do not trust data from the client on the server.", "For social login, use the provider's official method (such as expo-auth-session) rather than building your own."),
    N("These snippets were not run in a full project here. Treat them as patterns to adapt, and test the login flow with your own backend."),
    ...task("Add the validation function and form to a new login screen in one of your projects.", "Write three tests for `validateLogin` (bad email, short password, valid input).", "Store a fake token with SecureStore after pressing Sign in and read it on app start.", "Make a protected group and check that you are redirected when no token exists."),
    ...check("Invalid input shows messages without a request being sent.", "The token is saved in secure storage, not AsyncStorage.", "Protected screens redirect to the login screen."),
  ], A('Login flow', [
    n('form', 'Login form', 'validate input', 0, 0, 'user'), n('api', 'Server', 'checks the password', 1, 0, 'cloud'),
    n('secure', 'SecureStore', 'keeps the token', 2, 0, 'store'), n('app', 'Protected screens', 'need a token', 3, 0, 'app'),
  ], [
    { say: 'The form checks the fields and shows messages for mistakes.', on: ['form'] },
    { say: 'Valid input goes to the server over HTTPS, which checks the password.', flow: ['form>api:login'] },
    { say: 'The server returns a token, which the app keeps in Keychain or Keystore.', flow: ['api>secure:token'] },
    { say: 'Protected screens read the token. Without it they redirect to login.', flow: ['secure>app:token'] },
  ]), [
    faq('Why not keep the token in AsyncStorage?', 'AsyncStorage is plain, unencrypted storage. SecureStore uses the operating system\'s secure storage, which is much harder for other apps or tools to read.'),
    faq('Is client-side validation enough?', 'No. It improves the experience, but a server must validate every request because attackers can skip your app.'),
    faq('Should I build my own login server?', 'Most teams use a trusted service or a well-tested library for authentication rather than writing password handling themselves.'),
  ]),

  // 14
  les(S, 'testing-and-performance-for-react-native-apps', 'Testing and Performance for React Native Apps', 'Testing and Performance for React Native',
    'Set up Jest and React Native Testing Library, test pure functions and components, and learn practical performance habits for FlatList, memoisation and images.', [
    P("Tests are small programs that check your code automatically. They let you change code without fear and catch mistakes before users do. React Native projects use **Jest** to run tests and **React Native Testing Library** to render components and act like a user: find text, type and press."),
    H("Set up testing"),
    ...cfg('config/jest.txt', 'Terminal and package.json'),
    P("Test files go in a `__tests__` folder or end in `.test.ts` or `.test.tsx`. `npm test` runs them all."),
    H("Test pure functions first"),
    P("The best tests are for plain functions: the tip maths, the money helpers and the streak counter. They are fast and need no phone. Each test has a name that says what should happen, then a setup, an action and a check."),
    ...src('tests/tip.test.ts', '__tests__/tip.test.ts'),
    ...src('tests/money.test.ts', '__tests__/money.test.ts'),
    ...src('tests/streak.test.ts', '__tests__/streak.test.ts'),
    P("`it.each` runs the same check for many inputs. Notice that the streak test passes the date in as a parameter. Code that takes the current time from outside is far easier to test than code that reads the clock itself."),
    H("Test a component"),
    P("This test renders the tip calculator from project 1, types a bill like a user and checks the visible result. Place `tip.ts` and `App.tsx` at the project root so the imports match."),
    ...src('tests/TipScreen.test.tsx', '__tests__/TipScreen.test.tsx'),
    P("Find elements by what the user sees (text, placeholder, role) rather than by internal details. If you must target something with no text, give it a `testID` and use `getByTestId`."),
    N(HONEST),
    P("Component tests for screens that use native modules (SQLite, camera, notifications) need those modules mocked. Test their logic through the small functions around them instead, as the data layers in this course allow."),
    H("Performance habits"),
    L("**Use FlatList, not ScrollView, for long lists.** Give it a stable `keyExtractor`. For very large lists, tune `initialNumToRender` and `windowSize`, or try a faster list library such as FlashList.", "**Keep render cheap.** Do heavy calculations outside render or wrap them in `useMemo`.", "**Memoise rows when needed.** `React.memo` on a row component, and `useCallback` for handlers you pass to it, avoid redrawing every row.", "**Do not create huge inline objects** or functions inside long lists when a stable reference will do.", "**Size images properly.** Do not load a 4000 pixel photo into a 100 pixel thumbnail. Consider the expo-image library for caching.", "**Measure, do not guess.** Use the React DevTools Profiler and the performance monitor in the developer menu to see slow renders and dropped frames.", "**Test the release build.** Development mode is slower than a release build, so judge speed on a release build."),
    H("Preventing crashes"),
    L("Handle every network, storage and permission error with a visible message.", "Use TypeScript and optional chaining for data that might be missing.", "Wrap risky screens with an error boundary, or use the error boundary Expo Router provides per route.", "Test with a slow network, airplane mode, large text and dark mode."),
    ...task("Set up Jest and run the three function tests.", "Add a test for a case you can think of that is not covered.", "Run the component test and add a second one for the round-up switch.", "Break a function on purpose, see the test fail, then fix it."),
    ...check("`npm test` passes.", "You can explain why pure functions are easy to test.", "You can name three ways to keep a long list smooth."),
  ], A('Where tests fit', [
    n('fn', 'Function tests', 'many, fast', 0, 0, 'check'), n('comp', 'Component tests', 'fewer', 1, 0, 'check'),
    n('device', 'Device tests', 'by hand or E2E', 2, 0, 'check'), n('ship', 'Release', 'more confident', 3, 0, 'out'),
  ], [
    { say: 'Most tests check plain functions. They run in milliseconds.', on: ['fn'] },
    { say: 'Component tests render a screen and act like a user.', flow: ['fn>comp:more UI'] },
    { say: 'A few checks on a real device catch what mocks cannot, such as camera and notifications.', flow: ['comp>device:real phone'] },
    { say: 'When all pass, you can release with more confidence.', flow: ['device>ship:ready'] },
  ]), [
    faq('Jest or Vitest?', 'React Native projects use Jest through the jest-expo preset, because it handles the native environment for you.'),
    faq('How many tests should I write?', 'Cover rules that would hurt if they broke: money, validation, streaks and state changes. Do not chase 100 percent coverage of simple screens.'),
    faq('Why is my list slow only in development?', 'Development builds include extra checks and are slower. Always judge speed on a release build on a real phone.'),
  ]),

  // 15
  les(S, 'build-and-publish-with-eas-and-react-native-interview-prep', 'Build and Publish with EAS, and React Native Interviews', 'Publish React Native Apps with EAS',
    'Prepare a React Native app for release: app.json, EAS Build for Android and iOS, store submission, over-the-air updates and interview questions.', [
    P("An app only matters when people can install it. Expo's build service, **EAS** (Expo Application Services), turns your project into real app files in the cloud, so you do not need Xcode or Android Studio on your computer. Store steps and fees change from time to time, so follow the current instructions from Apple, Google and Expo if they differ from this lesson."),
    H("Prepare the app"),
    L("Open `app.json` and set a clear `name`, a unique `slug` and a `version`.", "Set a unique app ID for each platform: `ios.bundleIdentifier` and `android.package`, such as `com.yourname.shop`. They cannot be changed after you publish.", "Replace the default icon and splash screen in `assets/`.", "Check every permission text, and remove libraries and code you do not use.", "Test the whole app on at least one real phone."),
    H("Build with EAS"),
    ...cfg('config/eas.txt', 'Terminal commands'),
    O("Create a free Expo account and run `eas login`.", "Run `eas build:configure`. It creates an `eas.json` with build profiles.", "Build a **preview** version first. For Android this is an APK you can send to testers. For iOS, internal builds need an Apple Developer account.", "Install it on a phone and check the whole app, because release builds can behave differently from Expo Go.", "Build the **production** version: an AAB for Google Play and an IPA for the App Store. EAS can manage signing credentials for you, or you can supply your own."),
    N("Some libraries, such as ones with custom native code, do not run in Expo Go. A **development build** (`eas build --profile development`) is a custom version of Expo Go that includes them."),
    H("Publish to the stores"),
    O("**Google Play**: create a Play Console developer account (a one-time fee applies). Create the app, fill in the store listing, privacy policy, data safety and content rating forms, upload the AAB to an Internal testing track, then move to Production when ready. New personal accounts may have extra testing requirements, so check the current rules.", "**App Store**: join the Apple Developer Program (a yearly fee applies). Create the app in App Store Connect, add screenshots, a description and privacy details, upload the build, test with TestFlight, then submit for review.", "`eas submit` can upload builds to both stores from the command line.", "Reviews can take days. Fix any feedback and resubmit."),
    H("Over-the-air updates"),
    P("With `expo-updates` you can send a JavaScript or asset fix directly to installed apps, without a full store review, using `eas update`. It cannot change native code, so changes to native libraries or permissions still need a new build. Stores also have rules about what updates may change, so keep them to bug fixes and small improvements."),
    H("After release"),
    L("Read reviews and fix problems fast.", "Add crash reporting (for example Sentry) so you see errors from real devices.", "Raise the version, and the build number, for every release.", "Keep Expo SDK and libraries reasonably current. Upgrade with `npx expo install --fix` and the SDK upgrade guide."),
    H("Interview preparation"),
    P("Interviewers want to hear that you understand how React Native works and can explain choices. Practise answering these aloud with examples from your own projects."),
    L("What is React Native and how is it different from a hybrid web app?", "What is Expo and when would you use a development build or bare React Native?", "Explain props, state and the rules of hooks.", "What does `useEffect` do, and what does the dependency array mean?", "How does `FlatList` work, and how do you make a long list fast?", "How does Flexbox in React Native differ from the web?", "How do you store data on the device? AsyncStorage, SQLite and SecureStore: when do you use each?", "What is the difference between server state and client state, and what tools do you use?", "How do you handle permissions properly?", "How do you test a React Native app?", "How do you share navigation params, and why are they strings in Expo Router?", "What is the new architecture of React Native (Fabric and TurboModules) and what problem does it solve?"),
    P("Make a short portfolio: publish three or four of the ten apps to GitHub with a README, screenshots and the steps to run them. Add one that is on a store or in TestFlight if you can. Honest, working projects matter more than a long list of tools."),
    N(HONEST),
    ...task("Pick your best project and set its name, icon and app IDs in `app.json`.", "Run `eas build:configure` and make a preview build for Android.", "Install the build on a phone and write down anything that differs from Expo Go.", "Answer five of the interview questions aloud and note the ones you could not answer."),
    ...check("The preview build installs and runs on a real phone.", "You know the difference between an EAS update and a new build.", "You can describe the steps from code to store in order."),
  ], A('From code to the stores', [
    n('code', 'Your Expo app', 'tested', 0, 0, 'data'), n('eas', 'EAS Build', 'cloud build + signing', 1, 0, 'tool'),
    n('store', 'App stores', 'Play + App Store', 2, 0, 'cloud'), n('users', 'Users', 'install and update', 3, 0, 'user'),
  ], [
    { say: 'You finish and test the app and set its name, icon and app IDs.', on: ['code'] },
    { say: 'EAS Build compiles signed Android and iOS files in the cloud.', flow: ['code>eas:build'] },
    { say: 'You submit the builds to Google Play and the App Store for review.', flow: ['eas>store:submit'] },
    { say: 'People install the app. Small JavaScript fixes can follow as over-the-air updates.', flow: ['store>users:publish'] },
  ]), [
    faq('Do I need a Mac to publish to the App Store?', 'No. EAS Build compiles iOS apps in the cloud. You still need an Apple Developer account, and you can upload with eas submit.'),
    faq('What is the difference between eas build and eas update?', 'A build creates a new app file for the stores. An update sends changed JavaScript and assets to apps that are already installed, but cannot change native code.'),
    faq('How do I get my first React Native job?', 'Publish a few real projects on GitHub, make one polished app, practise the interview questions above, and apply for junior and internship roles while you keep building.'),
  ]),
];
