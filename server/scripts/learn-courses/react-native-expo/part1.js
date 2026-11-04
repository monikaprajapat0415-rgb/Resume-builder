import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { src, cfg, sample } from './files.js';

const S1 = 'Getting Started';
const S2 = 'Core Skills';
const HONEST = "The code in this course was syntax-checked with a TypeScript parser. It was not run on a phone or emulator while the course was written, so type it in, run it with Expo and fix any small differences your versions show. React Native and Expo release often: when `npx expo install` picks newer library versions for you, accept them and read the release notes if something changes.";

export const lessons = [
  // 1
  les(S1, 'what-is-react-native-expo-setup-and-your-first-app', 'React Native with Expo: Setup and Your First App', 'React Native and Expo: Setup, First App',
    'Learn what React Native and Expo are, install the tools, create a TypeScript project, run it on your phone with Expo Go, and understand the files Expo creates.', [
    P("React Native lets you build real mobile apps for iPhone and Android with JavaScript or TypeScript and React. You write one codebase. The framework shows real native buttons, text boxes and lists on each phone, not a web page in disguise. That is why many companies use it: one team can ship to both stores, and web developers who already know React can move into mobile work quickly."),
    P("**Expo** is a set of tools on top of React Native. It gives you a ready project, a development server, ready-made libraries for the camera, files, notifications and more, and a build service. Today the React Native team itself recommends starting with Expo, so that is what this course uses. You do not need a Mac, and you do not need Xcode or Android Studio to start. You can test on your own phone with an app called Expo Go."),
    H("What you will build"),
    P("After two lessons on the language and the core ideas, you build ten complete apps. Each uses a new group of skills that real teams use."),
    L("**Tip calculator**: components, state and styling.", "**To-do list**: lists and saved data with AsyncStorage.", "**Quiz**: several screens with Expo Router.", "**Weather**: loading data from an API with loading and error states.", "**Expense tracker**: useReducer, Context and money stored as cents.", "**Notes**: a real SQLite database with search.", "**Recipe browser**: TanStack Query for server data, caching and refresh.", "**Photo journal**: camera, photo library, permissions and the file system.", "**Habit tracker**: streaks and daily local notifications.", "**Shop app**: Zustand for the cart and tab navigation."),
    P("The last lessons cover forms and security, testing and speed, and how to build and publish with EAS."),
    N(HONEST),
    H("Install the tools"),
    O("Install **Node.js** (the current LTS version) from the official Node website. It includes `npm`.", "Install a code editor. **Visual Studio Code** is free and works well with TypeScript.", "Install **Expo Go** on your phone from the App Store or Google Play.", "Make sure your phone and your computer are on the same Wi-Fi network."),
    H("Create the project"),
    ...cfg('config/setup.txt', 'Terminal commands'),
    P("The first command creates a folder with a blank TypeScript app. The second starts the development server and prints a QR code. On Android open Expo Go and scan it. On iPhone scan it with the Camera app. The app loads on your phone in a few seconds. Edit a file and save, and the phone updates by itself. This is called **Fast Refresh**, and it makes learning quick."),
    H("What Expo created"),
    C('text', `my-app/
  App.tsx          the first screen (older template; newer ones use app/)
  app.json         app name, icon, version, permissions and plugins
  package.json     libraries (dependencies) and scripts
  tsconfig.json    TypeScript settings
  assets/          icons and images
  node_modules/    installed libraries (never edit)`),
    P("Open `App.tsx`. You will see something like this."),
    C('tsx', `import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello, my first app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});`),
    P("`App` is a **component**: a function that returns what should appear on screen. `View` is a box, like a `div`. `Text` shows text, and all text in React Native must be inside `Text`. `StyleSheet.create` holds the styles as plain objects. The syntax that looks like HTML inside the function is **JSX**, which React turns into native elements."),
    P("If your phone cannot connect, press `s` in the terminal to switch connection mode, or start with `npx expo start --tunnel`. You can also press `a` to open an Android emulator or `i` for the iOS simulator on a Mac."),
    ...task("Install Node.js and Expo Go, then create the project and scan the QR code.", "Change the text to your name and save. Watch the phone update.", "Add a second `Text` line and give the first one a bigger `fontSize` in the styles.", "Open `app.json` and find the app name."),
    ...check("The app shows on your phone and updates when you save.", "You can say what a component, JSX and Expo each are."),
  ], A('From code to phone', [
    n('code', 'Your TypeScript', 'App.tsx', 0, 0, 'data'), n('metro', 'Dev server', 'bundles the code', 1, 0, 'tool'),
    n('go', 'Expo Go', 'runs the bundle', 2, 0, 'app'), n('screen', 'Native screen', 'real iOS/Android UI', 3, 0, 'out'),
  ], [
    { say: 'You write TypeScript and React components.', on: ['code'] },
    { say: 'The dev server bundles your code and sends it to the phone over Wi-Fi.', flow: ['code>metro:bundle'] },
    { say: 'Expo Go on the phone runs the JavaScript.', flow: ['metro>go:send'] },
    { say: 'React Native draws real native views. Save a file and the screen refreshes.', flow: ['go>screen:render'] },
  ]), [
    faq('Do I need a Mac to build iPhone apps?', 'You can develop and test on iPhone with Expo Go from Windows or Linux. A Mac is not needed for builds either, because EAS Build compiles iOS apps in the cloud, though you need an Apple Developer account to publish.'),
    faq('Is React Native the same as React?', 'They share the same ideas: components, props, state and hooks. React draws web pages, while React Native draws native mobile views using components like View and Text.'),
    faq('Expo or bare React Native?', 'Start with Expo. It covers most apps and you can add custom native code later with development builds when a library requires it.'),
  ]),

  // 2
  les(S2, 'javascript-and-typescript-essentials-for-react-native', 'JavaScript and TypeScript Essentials for React Native', 'JavaScript and TypeScript for React Native',
    'Learn the JavaScript and TypeScript React Native needs: const and let, arrow functions, array methods, destructuring, spread, types and async await.', [
    P("React Native is written in JavaScript, and in this course in TypeScript, which is JavaScript with types. You do not need to master the language first. You need a working set of ideas that appear in every app. This lesson teaches them with small programs. To run them, create a file such as `demo.ts` in any folder and run `npx tsx demo.ts`, or paste the code into the online TypeScript Playground."),
    H("Variables and types"),
    P("Use `const` for values that are never reassigned and `let` for values that change. Avoid the old `var`. TypeScript infers most types from the value, and you add a type where it is not obvious, mainly on function parameters and on objects that other code uses. Backticks make template strings, where `${...}` inserts a value."),
    sample('basics/variables.ts'),
    C('text', `Asha walked 6500 steps
That is 65% of the goal`),
    H("Functions, arrays and types"),
    P("Arrow functions are short functions. Array methods are the main tool for working with lists: `filter` keeps items, `map` changes every item, `reduce` folds them into one value. They return new arrays and do not change the old one. In React you always create new arrays and objects instead of changing existing ones, because React compares them to decide what to redraw. A `type` describes the shape of an object, and `?` marks an optional field."),
    sample('basics/functions.ts'),
    C('text', `Hello, Ravi!
Welcome, Ravi!
[ 75, 90, 55 ]
[ 150, 180, 110 ]
260`),
    H("Destructuring and spread"),
    P("Destructuring pulls values out of objects and arrays into variables. The spread operator `...` copies an object or array and lets you change part of it. You will use `{ ...item, done: true }` constantly to update state."),
    sample('basics/destructuring.ts'),
    C('text', `Meera Pune
React [ 'TypeScript' ]
Delhi Pune`),
    H("Async code"),
    P("Network calls and storage take time, so they return a **Promise**: a value that arrives later. `async` functions use `await` to wait for a promise while the rest of the app keeps running. Put the awaited code in `try/catch` to handle errors."),
    sample('basics/async.ts'),
    C('text', `User 7
Failed: Bad id`),
    N("All the expected outputs here were worked out by hand from the code. Run each sample to confirm them."),
    H("Why this matters in React Native"),
    L("State updates use spread and `map` to build new objects and lists.", "Every API call, database call and permission request is async.", "Types catch mistakes such as passing a number where text is expected, before you run the app.", "Optional fields and `?.` stop crashes when data is missing."),
    ...task("Run all four samples and compare the output.", "Write a type `Product` with name and price, a list of three products and print the names of those above 100.", "Write an async function that waits 200 ms and returns a number, call it and print the result.", "Use destructuring to read `city` from an object that may not have it, with a default value."),
    ...check("Your outputs match the lesson.", "You can explain why React code copies arrays instead of changing them.", "You know what `await` does and where to put `try/catch`."),
  ], A('A list through helpers', [
    n('list', 'scores', '[40, 75, 90, 55]', 0, 0, 'data'), n('filter', 'filter', 'keep 50 or more', 1, 0, 'check'),
    n('map', 'map', 'double each', 2, 0, 'tool'), n('out', 'New array', '[150, 180, 110]', 3, 0, 'out'),
  ], [
    { say: 'You have an array of scores.', on: ['list'] },
    { say: 'filter returns a new array with only the scores of 50 or more.', flow: ['list>filter:fn'] },
    { say: 'map returns another new array with each value doubled.', flow: ['filter>map:fn'] },
    { say: 'The original array is untouched. React relies on this habit.', flow: ['map>out:result'] },
  ]), [
    faq('Do I have to use TypeScript?', 'No, React Native works with plain JavaScript. TypeScript is worth it because it finds many mistakes before you run the app, and most teams use it.'),
    faq('const or let?', 'Use const by default. Use let only when the variable must be reassigned. Objects and arrays declared with const can still have their contents changed, but in React you avoid doing that.'),
    faq('What is a Promise?', 'A Promise is a value that will be available later, such as the result of a network request. await pauses an async function until it is ready.'),
  ]),

  // 3
  les(S2, 'core-components-styling-state-and-project-1-tip-calculator', 'Core Components, State and Project 1: Tip Calculator', 'Core Components and Tip Calculator',
    'Learn View, Text, TextInput, Pressable, FlatList, StyleSheet and Flexbox, then useState, and build a complete tip calculator in React Native with a test.', [
    P("A React Native screen is built from components. A few built-in ones cover most needs, and you combine them. This lesson teaches them and the idea of state, then builds your first complete app."),
    H("The core components"),
    L("**View**: a box that groups and positions other things.", "**Text**: all visible text. Text cannot sit directly inside a View.", "**TextInput**: a box to type in. Use `value` and `onChangeText`. `keyboardType` picks the keyboard.", "**Pressable**: anything that can be tapped. It replaces the old TouchableOpacity for most uses.", "**Image**: shows a picture from a file or a web address. Remote images need a width and a height.", "**ScrollView and FlatList**: ScrollView shows everything at once. FlatList draws only the rows on screen, so use it for long lists.", "**Switch, ActivityIndicator, Modal**: a toggle, a spinner and a pop-up panel.", "**SafeAreaView**: keeps content away from notches and system bars."),
    H("Styling and Flexbox"),
    P("Styles are JavaScript objects, written with `StyleSheet.create`. Layout uses **Flexbox**, with two differences from the web: the default direction is vertical (`column`), and sizes are numbers without units. `flexDirection: \"row\"` puts children side by side. `justifyContent` places them along the main direction, `alignItems` across it, `flex: 1` makes an item take the available space, and `gap` adds space between children."),
    H("State: data that changes the screen"),
    P("`useState` gives a component a value that can change. When you call the setter, React runs the component again with the new value and updates only what changed."),
    C('tsx', `const [count, setCount] = useState(0);
<Pressable onPress={() => setCount(count + 1)}>
  <Text>Clicked {count} times</Text>
</Pressable>`),
    P("Never change state directly (`count++`). Always call the setter with a new value. When the new value depends on the old one, use the function form `setCount((c) => c + 1)`."),
    H("Project 1: Tip Calculator"),
    P("The user types a bill, chooses a tip, sets how many people share and sees the totals. All the maths lives in a plain function in its own file, so you can test it without a phone."),
    P("No extra libraries are needed for this project."),
    C('text', `my-app/
  App.tsx        the screen
  tip.ts         the calculation, with no React in it
  __tests__/
    tip.test.ts
    TipScreen.test.tsx`),
    ...src('p1/tip.ts', 'tip.ts'),
    ...src('p1/App.tsx', 'App.tsx'),
    H("How it works"),
    L("Four values are in state: the bill text, tip percent, number of people and the round-up switch.", "The bill stays as text because the user types it. `parseFloat(billText) || 0` turns empty or invalid text into 0.", "The result is calculated on every render, so it can never be out of date.", "The array `[10, 15, 20, 25].map(...)` creates one button for each tip choice. Each needs a unique `key`."),
    H("Expected output"),
    P("The screen shows the title, a bill box, four tip buttons with 15% highlighted, a people row showing 1, a round-up switch and a card. Type 100: the card shows Tip 15.00, Total 115.00 and Each person pays 115.00. Press + twice: each person pays 38.33. With a bill of 33 and 15%, the tip is 4.95, and 5.00 when round up is on."),
    N(HONEST),
    ...task("Create the project, add the two files and run the app.", "Check the three examples.", "Add a custom tip box where the user types their own percent.", "Run the tests in the testing lesson later and add one for your custom tip."),
    ...check("100 at 15% gives a total of 115.00.", "The numbers change as you tap, with no calculate button.", "You can explain what useState does and why we never change state directly."),
  ], A('State drives the screen', [
    n('user', 'User', 'types and taps', 0, 0, 'user'), n('state', 'State', 'bill, tip, people', 1, 0, 'store'),
    n('comp', 'Component', 'App runs again', 2, 0, 'app'), n('ui', 'Screen', 'new totals', 3, 0, 'out'),
  ], [
    { say: 'The user types a bill or taps a tip button.', on: ['user'] },
    { say: 'The handler calls a state setter with the new value.', flow: ['user>state:setState'] },
    { say: 'React runs the component function again with the new state.', flow: ['state>comp:re-render'] },
    { say: 'The new JSX is compared with the old one, and only the changes are applied to the screen.', flow: ['comp>ui:update'] },
  ]), [
    faq('Why do list items need a key?', 'The key tells React which item is which when the list changes, so it can update the right rows and keep their state. Use a stable ID, not the array index, when items can move.'),
    faq('Why can\'t I put text directly inside a View?', 'On phones, text is drawn by a special native component. React Native requires all text to be inside Text.'),
    faq('View or Pressable?', 'Use View to lay things out and Pressable when the user must tap it. Pressable adds press events and pressed-state styling.'),
  ]),
];
