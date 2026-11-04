import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { kt, file } from './files.js';

const SECTION = 'More Real-World Projects';
const HONEST = "The code in this project was syntax-checked with a Kotlin parser. It was not compiled or run on a device while the course was written, so type it in, build it in Android Studio and fix any small differences your tool versions show. Library versions move quickly: accept newer versions Android Studio suggests.";
const GRADLE = file('gradle/p11-p21.txt', 'Gradle dependencies for projects 11 to 21 (use the block for this project)', 'text');

// Builds one project lesson from its parts, so every project lesson has the same shape.
function project({ n: num, slug, title, meta, desc, intro, concepts, setup, tree, files, how, expected, extra = [], tasks, checks, anim, faqs }) {
  return les(SECTION, slug, title, meta, desc, [
    ...intro.map((t) => P(t)),
    H('Concepts in this project'),
    L(...concepts),
    H('Create the project'),
    O(...setup),
    ...GRADLE,
    C('text', tree),
    H('The code'),
    ...files,
    H('How it works'),
    L(...how),
    H('Expected output'),
    P(expected),
    ...extra,
    N(HONEST),
    ...task(...tasks),
    ...check(...checks),
  ], anim, faqs);
}

export const lessons = [
  project({
    slug: 'project-11-calculator-app-expression-parser-and-compose-keypad',
    title: 'Project 11: Calculator App with an Expression Parser',
    meta: 'Project 11: Calculator App in Compose',
    desc: 'Build a calculator in Kotlin and Compose with its own expression parser, correct order of operations, error handling, a keypad grid and unit tests.',
    intro: [
      "A calculator looks like the easiest app there is, and that is why it makes a good first project of the next group. The screen is simple, but the logic is real: you must turn the text \"2+3*4\" into the answer 14, not 20. Many beginners reach for a library or a script engine. Here you write a tiny parser yourself, so you learn how text becomes a result, and you keep all of it in a plain Kotlin object that you can test without a phone.",
      "The screen is a grid of buttons built with `Row` and `weight`, a display that shows the expression, and a line for the result or an error. The state lives in a ViewModel, as in every project you have built so far, so the calculator keeps its value when the phone rotates.",
    ],
    concepts: [
      "**Tokenising**: splitting \"12+3.5*2\" into the pieces 12, +, 3.5, *, 2. A leading minus belongs to the first number.",
      "**Order of operations**: the first pass handles `*` and `/`, the second handles `+` and `-`. This gives the same results as mathematics.",
      "**Failing safely**: the evaluator returns `null` for broken input (a missing number, letters, division by zero) and the screen shows \"Invalid expression\" instead of crashing.",
      "**Separating logic from UI**: `Calculator` is an `object` with no Android imports. The ViewModel calls it, and unit tests call it directly.",
      "**Grid layout**: `Modifier.weight(1f)` gives each key equal width, and `aspectRatio` keeps keys the same shape.",
    ],
    setup: ["New Empty Activity project `Calculator`, package `com.example.calculator`.", "Add the JUnit test dependency from the block below (no other library is needed).", "Add the five files."],
    tree: `Calculator/app/src/main/java/com/example/calculator/
  Calculator.kt           tokenise and evaluate
  CalculatorViewModel.kt  expression, result, error
  CalculatorScreen.kt     display and keypad
  MainActivity.kt
app/src/test/java/com/example/calculator/
  CalculatorTest.kt`,
    files: [...kt('p11', 'Calculator.kt', 'calculator'), ...kt('p11', 'CalculatorViewModel.kt', 'calculator'), ...kt('p11', 'CalculatorScreen.kt', 'calculator'), ...kt('p11', 'MainActivity.kt', 'calculator'), ...file('p11/CalculatorTest.kt', 'app/src/test/java/com/example/calculator/CalculatorTest.kt')],
    how: [
      "Each key calls `onKey` with its label. Digits and operators are appended to the expression. C clears everything, the backspace key removes one character, and = evaluates.",
      "`evaluate` tokenises, then folds multiplication and division, then addition and subtraction. Anything unexpected returns `null`.",
      "After a successful =, the expression becomes the result, so you can keep calculating with it.",
      "`format` prints 14.0 as 14 and keeps 3.75 as it is.",
    ],
    expected: "The screen shows 0, an empty result line and the keypad. Press 2, +, 3, *, 4, =: the display shows 14. Press C, then 7, ., 5, /, 2, =: the display shows 3.75. Press 5, /, 0, =: the line below the display shows \"Invalid expression\" in the error colour and the app keeps running. The five unit tests in `CalculatorTest` pass.",
    tasks: ["Build the app and run all the examples above.", "Run the unit tests with the green arrow next to the class.", "Add a percent key that divides the last number by 100.", "Add support for brackets by making the evaluator call itself on the text inside them."],
    checks: ["2+3*4 gives 14.", "Division by zero shows a message, not a crash.", "You can explain why the parser uses two passes."],
    anim: A('Text to answer', [
      n('text', 'Expression', '2+3*4', 0, 0, 'user'), n('tok', 'Tokens', '2 + 3 * 4', 1, 0, 'data'),
      n('mul', 'Pass 1', 'do * and /', 2, 0, 'tool'), n('add', 'Pass 2', 'do + and -', 3, 0, 'out'),
    ], [
      { say: 'The user types the expression with the keypad.', on: ['text'] },
      { say: 'The tokeniser cuts it into numbers and operators.', flow: ['text>tok:tokenise'] },
      { say: 'The first pass multiplies and divides: 3 * 4 becomes 12.', flow: ['tok>mul:first pass'] },
      { say: 'The second pass adds and subtracts: 2 + 12 is 14.', flow: ['mul>add:second pass'] },
    ]),
    faqs: [
      faq('Why not use a script engine to evaluate text?', 'Running arbitrary text as code is unsafe and heavy. A small parser handles only the characters you allow, so it is safe and easy to test.'),
      faq('Why return null instead of throwing an exception?', 'Bad input is normal in a calculator. Returning null makes the caller handle it, and the screen shows a message.'),
      faq('Why use Double?', 'It is fine for a simple calculator. For money, use whole cents or BigDecimal, as in project 7.'),
    ],
  }),

  project({
    slug: 'project-12-e-commerce-app-products-cart-and-demo-checkout',
    title: 'Project 12: E-Commerce App with Products, Cart and Checkout',
    meta: 'Project 12: E-Commerce App with Room Cart',
    desc: 'Build a shopping app with a product grid from a free API, a Room cart that survives restarts, quantity controls, exact totals in cents and a demo checkout.',
    intro: [
      "Shopping apps combine nearly everything you have learned: a list from the network, images, a database, state shared between two screens and exact money. This project builds the core of one. The products come from the free Fake Store API, the cart lives in a Room database so it survives closing the app, and the checkout is a **demo** that clears the cart and takes no payment.",
      "A real store needs more: sign-in, addresses, a server that creates orders, a payment provider and legal pages. The lesson shows the correct place for each of these, but it does not pretend that this demo is a finished shop.",
    ],
    concepts: [
      "**Network plus database**: products are loaded with Retrofit, and the cart is stored with Room. The cart screen reads the database through a Flow, so it updates by itself.",
      "**Exact money**: prices are converted to cents when a product is added to the cart, and totals are sums of integers. `asMoney()` formats them.",
      "**Upsert**: adding the same product again increases its quantity. `@Upsert` handles both insert and update.",
      "**Derived state**: the total and the cart count come from the lines Flow, so they cannot go out of sync.",
      "**Bottom navigation**: a `NavigationBar` switches between Shop and Cart, and the Cart label shows the live item count.",
      "**Payments**: never handle card numbers in your app. A real checkout sends the cart to your server, which creates an order and uses a payment provider's SDK (lesson 26).",
    ],
    setup: ["New Empty Activity project `Shop`, package `com.example.shop`.", "Add the Retrofit, serialization, Room, KSP, Coil and icons libraries from the Project 12 block, then sync. Add the INTERNET permission.", "Create the files below."],
    tree: `Shop/app/src/main/java/com/example/shop/
  ShopApi.kt        DTOs and Retrofit interface
  CartDb.kt         entity, DAO, database
  ShopViewModel.kt  products state, cart actions, totals
  ShopApp.kt        tabs, product grid, cart screen
  MainActivity.kt   builds Retrofit and Room
app/src/test/.../ShopTest.kt`,
    files: [...kt('p12', 'ShopApi.kt', 'shop'), ...kt('p12', 'CartDb.kt', 'shop'), ...kt('p12', 'ShopViewModel.kt', 'shop'), ...kt('p12', 'ShopApp.kt', 'shop'), ...kt('p12', 'MainActivity.kt', 'shop'), ...file('p12/ShopTest.kt', 'app/src/test/java/com/example/shop/ShopTest.kt')],
    how: [
      "`ShopViewModel` loads products once and exposes `Loading`, `Ready` and `Failed`. A Try again button calls `load()`.",
      "`add` finds the product in the cart. If it is there the quantity grows, otherwise a new line is created with the price in cents.",
      "`change(line, delta)` removes a line when its quantity reaches zero.",
      "The grid uses `LazyVerticalGrid` with two columns and `AsyncImage` from Coil for pictures.",
      "`placeDemoOrder` clears the cart and shows a message. No money moves.",
    ],
    expected: "The Shop tab shows a two-column grid of products with a picture, title, price and an Add to cart button. Tap Add to cart on two products and the second tab reads Cart (2). Open it: each line has a picture, title, line price and - and + buttons. Press + and the total rises. Press - to zero and the line disappears. Close the app completely and reopen it: the cart is still there. Place demo order empties the cart and shows \"Demo order placed. No payment was taken.\" Turn on airplane mode before first launch and the grid shows the error message and a Try again button.",
    tasks: ["Build the app and fill the cart with three products.", "Add a category filter using chips, built from the products' `category` field.", "Add a product detail screen with Navigation Compose that shows the description.", "Add the login call from the API and keep the token encrypted, as in project 18."],
    checks: ["The cart survives closing the app.", "Totals equal the sum of the lines, with two decimals.", "You can explain why the payment step must be on a server."],
    anim: A('Browse, add, pay on a server', [
      n('api', 'Product API', 'Retrofit', 0, 0, 'cloud'), n('vm', 'ViewModel', 'products + cart', 1, 0, 'tool'),
      n('db', 'Room cart', 'lines in cents', 2, 0, 'store'), n('srv', 'Your server', 'creates the order', 3, 0, 'cloud'),
    ], [
      { say: 'Products load from the API into the ViewModel.', flow: ['api>vm:products'] },
      { say: 'Add to cart saves a line in Room, with the price in cents.', flow: ['vm>db:upsert'] },
      { say: 'The cart screen watches Room, so totals update at once.', on: ['db'] },
      { say: 'In a real shop, checkout sends the cart to your server, which takes payment through a provider.', flow: ['db>srv:checkout'] },
    ]),
    faqs: [
      faq('Why store the cart in Room?', 'The cart should survive closing the app and work offline. Room also gives you a Flow, so the screen updates whenever the cart changes.'),
      faq('Should the app calculate the final price?', 'Only for display. The server must recalculate prices from its own data, because a modified app could send any price.'),
      faq('Can I take payments inside this app?', 'Use a payment provider SDK or hosted checkout, and confirm the order on your server. Never collect or store card numbers yourself.'),
    ],
  }),

  project({
    slug: 'project-13-real-time-chat-app-firebase-auth-firestore-and-push',
    title: 'Project 13: Real-Time Chat App with Firebase',
    meta: 'Project 13: Real-Time Chat with Firebase',
    desc: 'Build a real-time chat app with Firebase Authentication and Cloud Firestore, live message updates as a Flow, security rules and push notification handling.',
    intro: [
      "Chat is the classic real-time app: you send a message and everyone in the room sees it a moment later. Building your own server for this takes time, so this project uses Firebase, Google's backend service. Firebase Authentication handles accounts, Cloud Firestore stores messages and pushes changes to every connected phone, and Cloud Messaging can wake a phone with a notification.",
      "This project needs an account and setup that only you can do: a Firebase project and your own `google-services.json` file. Follow the current setup steps in the Firebase console, because its screens change. The security rules at the end matter as much as the app code, because they decide who can read and write your data.",
    ],
    concepts: [
      "**Firebase setup**: create a project, register your application ID, download `google-services.json` into the `app` folder and add the Google services plugin.",
      "**Authentication**: email and password sign-up and sign-in, with the result wrapped in `Result` so the ViewModel can show errors.",
      "**Firestore documents**: each message is a document in `rooms/general/messages` with text, sender id, name and a server timestamp.",
      "**callbackFlow**: wraps a Firestore snapshot listener as a Flow, and removes the listener when nobody collects it.",
      "**Cloud Messaging**: a `FirebaseMessagingService` receives pushes. Sending them needs a server or a Cloud Function.",
      "**Security rules**: only signed-in users can read, a message may only be created with the sender's own id, and nobody can edit or delete.",
    ],
    setup: ["Create a Firebase project in the Firebase console, add an Android app with your application ID and download `google-services.json`.", "Enable Email/Password in Authentication, and create a Firestore database.", "New Empty Activity project `Chat`, package `com.example.chat`. Add the Google services plugin and the Firebase libraries from the Project 13 block.", "Create the files below, and register the messaging service in the manifest.", "Paste the rules file into Firestore Rules and publish."],
    tree: `Chat/app/
  google-services.json     from your Firebase console (do not share publicly)
  src/main/java/com/example/chat/
    ChatRepository.kt         auth, send, live messages
    ChatViewModel.kt          sign-in state and messages
    ChatScreen.kt             login and chat room
    ChatMessagingService.kt   push receiver
    MainActivity.kt
  firestore.rules`,
    files: [...kt('p13', 'ChatRepository.kt', 'chat'), ...kt('p13', 'ChatViewModel.kt', 'chat'), ...kt('p13', 'ChatScreen.kt', 'chat'), ...kt('p13', 'ChatMessagingService.kt', 'chat'), ...kt('p13', 'MainActivity.kt', 'chat'), ...file('p13/firestore.rules', 'firestore.rules (paste into Firestore > Rules)', 'text')],
    how: [
      "The ViewModel starts signed in if Firebase already has a user. Otherwise the login screen validates the email and password length before calling Firebase.",
      "`messages` is a Flow built with `callbackFlow`. Every new message triggers the listener, which sends the full list to the screen.",
      "The room screen scrolls to the newest message when the list grows, and aligns your own messages to the right.",
      "The messaging service builds a notification from the data in a push message. A server must send those pushes.",
    ],
    expected: "The first screen shows Chat, an email box, a password box, a Sign in button and a Create account button. Create an account with a test email and a password of at least 6 characters. You land in the General room. Type a message and press Send: it appears on the right. Install the app on a second phone or emulator, create another account and send a message: it appears on the first phone within a second or two, on the left with the sender's email above it. Signing out returns to the login screen. A wrong password shows an error message.",
    tasks: ["Set up Firebase, build the app and chat between two devices.", "Add several rooms, and a room list screen.", "Test the rules in the Firebase Rules Playground: try to write a message with another user's id.", "Add a Cloud Function that sends a push when a message is created (see the Firebase documentation)."],
    checks: ["Two devices see each other's messages without a refresh.", "A signed-out user cannot read messages (test in the Rules Playground).", "Your `google-services.json` is not in a public repository unless you accept that."],
    anim: A('Live messages', [
      n('a', 'Phone A', 'sends a message', 0, 0, 'app'), n('fs', 'Firestore', 'stores + notifies', 1, 0, 'store'),
      n('rules', 'Security rules', 'allow or refuse', 2, 0, 'check'), n('b', 'Phone B', 'listener updates', 3, 0, 'out'),
    ], [
      { say: 'Phone A sends a message to Firestore.', flow: ['a>fs:add'] },
      { say: 'Security rules check that the user is signed in and the sender id is theirs.', flow: ['fs>rules:check'] },
      { say: 'Firestore stores it and tells every listener.', on: ['fs'] },
      { say: 'Phone B receives the new list through its snapshot listener, so the message appears at once.', flow: ['rules>b:push update'] },
    ]),
    faqs: [
      faq('Why use callbackFlow?', 'Firestore gives a callback when data changes. callbackFlow turns that into a Flow and lets you clean up the listener with awaitClose.'),
      faq('Is it safe to publish google-services.json?', 'It only identifies your project, so security rules and App Check must protect the data. Many teams still keep it private.'),
      faq('How do push notifications get sent?', 'A server or a Cloud Function calls the Firebase Cloud Messaging API with the receiver\'s device token. The app only receives them.'),
    ],
  }),

  project({
    slug: 'project-14-fitness-tracker-step-sensor-room-history-and-canvas-chart',
    title: 'Project 14: Fitness Tracker with Sensors and a Chart',
    meta: 'Project 14: Fitness Tracker with Sensors',
    desc: 'Build a fitness tracker that counts steps with the step sensor, saves daily totals in Room, draws a weekly Canvas bar chart and asks for permission.',
    intro: [
      "Phones contain many sensors. This project uses the **step counter**, a low-power sensor that counts steps even when your app is closed. It reports one number: the total steps since the phone last restarted. To show today's steps you must save a starting point for the day and subtract it. That small piece of thinking is the heart of this app.",
      "You will also draw your own chart with a `Canvas`. Charts are common in fitness, finance and health apps, and a bar chart needs only a few lines of drawing code. For serious health data across apps, Google offers Health Connect, which you can study next.",
    ],
    concepts: [
      "**SensorManager and SensorEventListener**: register to get values, and always unregister. A `callbackFlow` does both for you.",
      "**Runtime permission**: from Android 10 the step counter needs `ACTIVITY_RECOGNITION`, requested with the Activity Result API.",
      "**Baseline**: today's steps = the sensor total minus the total at the start of today. If the phone restarts, the sensor total resets, so the baseline resets too.",
      "**Room by day**: one row per date key like 2026-11-04, updated as steps arrive.",
      "**Canvas drawing**: `drawRect` for bars and `drawLine` for the goal line, scaled by the largest value.",
      "**Graceful absence**: some phones have no step counter. The screen says so instead of failing.",
    ],
    setup: ["New Empty Activity project `Fitness`, package `com.example.fitness`.", "Add Room and KSP from the Project 14 block and sync.", "Add the permission lines from `AndroidManifest-additions.xml` to the manifest.", "Create the files below. Test on a real phone, since emulators have no real step counter."],
    tree: `Fitness/app/src/main/java/com/example/fitness/
  StepSensor.kt        sensor as a Flow
  FitnessDb.kt         DaySteps entity, DAO, database
  FitnessViewModel.kt  start tracking, last week, goal progress
  FitnessScreen.kt     permission, progress, Canvas chart
  MainActivity.kt`,
    files: [...file('p14/AndroidManifest-additions.xml', 'app/src/main/AndroidManifest.xml (add these lines)', 'xml'), ...kt('p14', 'StepSensor.kt', 'fitness'), ...kt('p14', 'FitnessDb.kt', 'fitness'), ...kt('p14', 'FitnessViewModel.kt', 'fitness'), ...kt('p14', 'FitnessScreen.kt', 'fitness'), ...kt('p14', 'MainActivity.kt', 'fitness')],
    how: [
      "`StepSensor.totals()` registers a listener when someone starts collecting and unregisters when they stop, so the sensor is not left running.",
      "The ViewModel collects the flow, looks up today's row and saves `total - baseline` as today's steps.",
      "`progress(steps, goal)` returns a value between 0 and 1 for the progress bar.",
      "`BarChart` finds the largest value (or the goal) and scales each bar to the canvas height. The goal appears as a horizontal line.",
    ],
    expected: "On first launch Android asks for permission to recognise physical activity. Allow it. The big number shows steps today, starting at 0, and a progress bar shows the part of the 8,000 goal. Walk about 50 steps with the phone: after a few seconds the number rises. The chart shows up to seven bars, one for each day with data, and a line for the goal. On a phone with no step counter, the screen shows \"This phone has no step counter sensor.\" Denying the permission leaves the number at 0 and the Allow step counting button lets you try again.",
    tasks: ["Build the app on a real phone, allow the permission and walk.", "Add a setting for the daily goal and store it with DataStore.", "Add a notification when the goal is reached.", "Read the steps from Health Connect instead and compare the numbers."],
    checks: ["The number rises while you walk.", "The sensor stops when you leave the screen.", "You can explain why a baseline is needed."],
    anim: A('Total minus baseline', [
      n('sensor', 'Step sensor', 'total since boot', 0, 0, 'data'), n('base', 'Baseline', 'total at start of day', 1, 0, 'store'),
      n('calc', 'Subtract', 'today = total - baseline', 2, 0, 'tool'), n('chart', 'Chart', 'bars for 7 days', 3, 0, 'out'),
    ], [
      { say: 'The sensor reports total steps since the phone started.', on: ['sensor'] },
      { say: 'The app keeps the total it saw at the start of the day.', flow: ['sensor>base:first value'] },
      { say: 'Today\'s steps are the difference. A restart resets both numbers.', flow: ['base>calc:subtract'] },
      { say: 'Room saves one row per day and the chart draws the last seven.', flow: ['calc>chart:draw'] },
    ]),
    faqs: [
      faq('Why does the sensor give a total instead of today\'s steps?', 'It is a counter kept by the hardware to save battery. Your app turns it into per-day numbers by remembering where each day started.'),
      faq('Do I need a chart library?', 'Not for simple charts. Canvas is enough for bars and lines. Libraries help with axes, touch and animation in larger apps.'),
      faq('What is Health Connect?', 'An Android feature where health apps share data with the user\'s permission. Use it when you need data from other apps or devices.'),
    ],
  }),

  project({
    slug: 'project-15-food-delivery-app-cart-order-tracking-and-google-maps',
    title: 'Project 15: Food Delivery App with Order Tracking and Maps',
    meta: 'Project 15: Food Delivery with Maps',
    desc: 'Build a food delivery app with restaurants, menus, a cart, a live order status Flow and Google Maps showing the restaurant, you and a courier marker.',
    intro: [
      "Food delivery apps are a good test of state management: browse restaurants, build a cart, place an order, then watch the order change over time. This project builds that flow. The restaurants and dishes are sample data in code, the checkout is a demo, and the order tracking is simulated by a Flow that changes status every few seconds.",
      "The map uses **Maps Compose**, which needs your own Google Maps API key. Without a key the rest of the app works and the map area stays blank. In a real product, the courier position comes from your server over a WebSocket, Firestore or push updates, and a payment provider handles money.",
    ],
    concepts: [
      "**Sample data object**: `FoodData` holds restaurants and dishes. Replace it with a Retrofit call later without changing the screens.",
      "**Cart as a map**: `Map<Int, Int>` from dish id to quantity. Adding builds a new map, so state updates correctly.",
      "**Order status as an enum**: `Placed`, `Preparing`, `OnTheWay`, `Delivered`, each with a label for the screen.",
      "**A Flow that simulates a server**: `OrderTracker.track()` emits each status with a delay. A real app would listen to a server instead.",
      "**Maps Compose**: `GoogleMap` with `Marker`s and a camera position. The courier marker moves when the status changes.",
      "**Pure helpers**: `courierPosition` and `totalCents` are plain functions with unit tests.",
    ],
    setup: ["New Empty Activity project `Food`, package `com.example.food`.", "Get a Maps API key from Google Cloud, restrict it to your app, and put it in the manifest using `local.properties` and the Secrets Gradle Plugin so it stays out of git.", "Add the Maps Compose libraries from the Project 15 block and sync.", "Create the files below."],
    tree: `Food/app/src/main/java/com/example/food/
  FoodData.kt       restaurants, dishes, OrderStatus
  OrderTracker.kt   simulated status updates + courier position
  FoodViewModel.kt  cart and order state
  FoodScreens.kt    list, menu, tracking map
  MainActivity.kt
app/src/test/.../FoodTest.kt`,
    files: [...kt('p15', 'FoodData.kt', 'food'), ...kt('p15', 'OrderTracker.kt', 'food'), ...kt('p15', 'FoodViewModel.kt', 'food'), ...kt('p15', 'FoodScreens.kt', 'food'), ...kt('p15', 'MainActivity.kt', 'food'), ...file('p15/FoodTest.kt', 'app/src/test/java/com/example/food/FoodTest.kt')],
    how: [
      "The app shows one of three screens: the restaurant list, a menu for the chosen restaurant, or tracking once an order has a status.",
      "`add` and `remove` update the cart map. The total is calculated from the map and the dish prices.",
      "`placeOrder` collects the tracker flow. The first status, Placed, also empties the cart.",
      "On the tracking screen, a progress bar shows how far through the statuses the order is, and the courier marker sits at the start, middle or end of the straight line to your home.",
    ],
    expected: "The first screen lists three restaurants. Tap Spice Corner to see Paneer Tikka and Dal Makhani with prices in rupees. Press + on Paneer Tikka twice: the total reads ₹498.00. Press Place demo order. The tracking screen shows \"Order placed\", then every three seconds \"Preparing your food\", \"On the way\" and \"Delivered\", with the progress bar filling. The map shows the restaurant, your home and a courier marker that moves to the halfway point and then to your home. With no valid Maps key the map is blank but the status text still changes.",
    tasks: ["Build the app and place an order.", "Load restaurants from a Retrofit call to your own API.", "Replace the simulated tracker with a Firestore document listener.", "Add a notification when the status becomes On the way."],
    checks: ["The cart total is correct for each combination of dishes.", "The status moves through all four steps.", "Your Maps key is not committed to a public repository."],
    anim: A('Order status as a Flow', [
      n('cart', 'Cart', 'dishes + quantities', 0, 0, 'app'), n('place', 'Place order', 'demo, no payment', 1, 0, 'user'),
      n('flow', 'Status Flow', 'Placed, Preparing...', 2, 0, 'tool'), n('map', 'Tracking map', 'courier marker', 3, 0, 'out'),
    ], [
      { say: 'The user builds a cart from one restaurant\'s menu.', on: ['cart'] },
      { say: 'Place order starts the status flow and clears the cart.', flow: ['cart>place:checkout'] },
      { say: 'The flow emits a new status every few seconds. A real app gets these from a server.', flow: ['place>flow:start'] },
      { say: 'The tracking screen shows the text, the progress bar and moves the courier on the map.', flow: ['flow>map:status'] },
    ]),
    faqs: [
      faq('Where does the courier position come from in a real app?', 'From the courier\'s phone, sent to your server, which pushes it to the customer through a WebSocket, Firestore or push messages.'),
      faq('How do I keep the Maps key out of git?', 'Put it in local.properties, which is not committed, and read it with the Secrets Gradle Plugin into the manifest. Also restrict the key to your app in Google Cloud.'),
      faq('Why model status as an enum?', 'It limits the values to known ones, gives each a label, and lets the compiler check every when expression.'),
    ],
  }),

  project({
    slug: 'project-16-music-player-media3-exoplayer-and-background-playback',
    title: 'Project 16: Music Player with Media3 and Background Playback',
    meta: 'Project 16: Music Player with Media3',
    desc: 'Build a music player with Media3 ExoPlayer and a MediaSessionService, so playback continues in the background with notification controls and a seek bar.',
    intro: [
      "A music player has one special requirement: the music must keep playing when the user leaves the app. A screen cannot do that, because Android may destroy it. The player must live in a **service**. Google's **Media3** library makes this much easier. It gives you ExoPlayer, a powerful player, and a `MediaSessionService`, which creates the media notification and lock screen controls for you.",
      "The design has two sides. The service owns the player. The screen is a **controller**: it connects to the service, sends commands such as play and next, and shows the state it receives. That separation is why playback survives rotation, closing the screen and even the app being swiped away while music plays.",
    ],
    concepts: [
      "**ExoPlayer**: plays audio and video from URLs and files, and handles buffering and formats.",
      "**MediaSessionService**: a foreground service that publishes the player to the system. The notification, Bluetooth buttons and lock screen all talk to it.",
      "**MediaController**: how the screen connects to the session. It is created asynchronously, so the ViewModel waits for the future to finish.",
      "**Playlist**: `setMediaItems` with metadata for title and artist, and `seekToNextMediaItem` and `seekToPreviousMediaItem`.",
      "**Position polling**: the player does not push the playback position every moment, so the ViewModel reads it twice a second for the seek bar.",
      "**Audio focus and noise**: the player settings pause for calls and when headphones are unplugged.",
    ],
    setup: ["New Empty Activity project `Music`, package `com.example.music`.", "Add the Media3 libraries from the Project 16 block and sync.", "Register the service and permissions in the manifest (see the additions file).", "Replace the placeholder addresses in `Tracks.kt` with audio you have the right to play, such as your own files or royalty-free music.", "Create the files below."],
    tree: `Music/app/src/main/java/com/example/music/
  PlaybackService.kt    owns the ExoPlayer and the media session
  Tracks.kt             playlist, MediaItem helper, time format
  PlayerViewModel.kt    MediaController, UI state, commands
  PlayerScreen.kt       title, seek bar, buttons
  MainActivity.kt
app/src/test/.../MusicTest.kt`,
    files: [...file('p16/AndroidManifest-additions.xml', 'app/src/main/AndroidManifest.xml (add these lines)', 'xml'), ...kt('p16', 'PlaybackService.kt', 'music'), ...kt('p16', 'Tracks.kt', 'music'), ...kt('p16', 'PlayerViewModel.kt', 'music'), ...kt('p16', 'PlayerScreen.kt', 'music'), ...kt('p16', 'MainActivity.kt', 'music'), ...file('p16/MusicTest.kt', 'app/src/test/java/com/example/music/MusicTest.kt')],
    how: [
      "The service creates an `ExoPlayer` with music audio attributes, so Android manages audio focus, and wraps it in a `MediaSession`.",
      "The ViewModel builds a `SessionToken`, creates a `MediaController` and, once connected, loads the playlist and prepares it.",
      "A player listener updates the UI state when the track or play state changes, and a small loop refreshes the position.",
      "The screen's buttons call the controller. The seek bar sends the new position to the player when the user drags.",
    ],
    expected: "The screen shows the first track's title and artist, a seek bar, the times 0:00 and the track length, and Prev, Play and Next buttons. Press Play: audio starts and the seek bar moves. Press Home: the music keeps playing and a media notification appears with play and pause. Pull down the notification and press Next: the track changes and the app shows the new title when you return. With placeholder addresses that do not exist, the player reports an error and nothing plays, so replace them first.",
    tasks: ["Replace the track addresses, build the app and play for a minute in the background.", "Add shuffle and repeat buttons with `shuffleModeEnabled` and `repeatMode`.", "Show the playlist and let the user tap a track to jump to it.", "Add album art through `MediaMetadata.setArtworkUri` and show it with Coil."],
    checks: ["Music keeps playing after you leave the app.", "Notification buttons control playback.", "You can explain why the player lives in a service."],
    anim: A('Service owns the player', [
      n('ui', 'Screen', 'buttons + seek bar', 0, 0, 'app'), n('ctl', 'MediaController', 'sends commands', 1, 0, 'tool'),
      n('svc', 'Playback service', 'ExoPlayer lives here', 2, 0, 'store'), n('note', 'Notification', 'lock screen controls', 3, 0, 'out'),
    ], [
      { say: 'The screen connects to the service with a MediaController.', flow: ['ui>ctl:connect'] },
      { say: 'Commands such as play and next go to the player in the service.', flow: ['ctl>svc:play / next'] },
      { say: 'The service keeps playing even if the screen is destroyed.', on: ['svc'] },
      { say: 'The system shows a notification and lock screen controls from the same session.', flow: ['svc>note:media session'] },
    ]),
    faqs: [
      faq('Why not play music from the ViewModel?', 'A ViewModel dies with its screen. A foreground service can keep running, and the system treats it as a media app with notification and button support.'),
      faq('Can I stream any song I find online?', 'Only audio you have the right to use. Use your own files, licensed music or royalty-free sources.'),
      faq('What about video?', 'Media3 plays video with the same ExoPlayer. Project 20 does it with a PlayerView.'),
    ],
  }),

  project({
    slug: 'project-17-qr-code-scanner-camerax-and-ml-kit-barcode-scanning',
    title: 'Project 17: QR Code Scanner with CameraX and ML Kit',
    meta: 'Project 17: QR Scanner with CameraX',
    desc: 'Build a QR and barcode scanner with CameraX preview, an ImageAnalysis analyzer, ML Kit barcode scanning, camera permission and safe handling of scanned links.',
    intro: [
      "Scanning a QR code needs three things: a live camera preview, a way to look at each camera frame, and a model that finds codes in it. Android gives you each piece. **CameraX** is a friendly camera library that follows the lifecycle for you. **ML Kit** is Google's on-device machine learning toolkit, and its barcode scanner runs on the phone with no network.",
      "This project also teaches an important habit: treat scanned content as untrusted input. A QR code can contain any text, including a link to a harmful website. The app therefore shows the content and asks before it opens a link, and it classifies the result so the screen can offer the right action.",
    ],
    concepts: [
      "**Camera permission**: asked at run time with the Activity Result API. The screen explains why before asking.",
      "**CameraX use cases**: `Preview` shows the camera, `ImageAnalysis` gives you frames. `bindToLifecycle` starts and stops them with the screen.",
      "**Analyzer**: runs on a background thread for each frame. It must close the `ImageProxy` when done, or the camera stops delivering frames.",
      "**ML Kit BarcodeScanning**: takes an `InputImage` and returns the barcodes found, with their raw text.",
      "**AndroidView**: shows a classic `PreviewView` inside Compose.",
      "**Classifying results**: a sealed class (`Link`, `Wifi`, `Text`) and a pure `classify` function that you can unit test.",
    ],
    setup: ["New Empty Activity project `Qr`, package `com.example.qr`.", "Add the CameraX and ML Kit libraries from the Project 17 block and sync.", "Add `<uses-permission android:name=\"android.permission.CAMERA\"/>` to the manifest.", "Create the files below and test on a real phone with a QR code on a screen or a printout."],
    tree: `Qr/app/src/main/java/com/example/qr/
  QrAnalyzer.kt     ML Kit analyzer + classify()
  ScannerScreen.kt  permission, preview, result card
  MainActivity.kt
app/src/test/.../QrTest.kt`,
    files: [...kt('p17', 'QrAnalyzer.kt', 'qr'), ...kt('p17', 'ScannerScreen.kt', 'qr'), ...kt('p17', 'MainActivity.kt', 'qr'), ...file('p17/QrTest.kt', 'app/src/test/java/com/example/qr/QrTest.kt')],
    how: [
      "If the camera permission is missing, the screen explains and shows an Allow camera button. If it is given, the preview starts.",
      "`ImageAnalysis` uses `STRATEGY_KEEP_ONLY_LATEST`, so a slow frame never builds a queue.",
      "The analyzer passes each frame to ML Kit. When a code is found, the callback gives the text to the screen.",
      "`classify` turns the text into a link, Wi-Fi details or plain text. The result card shows it and, for links, an Open button with a warning.",
    ],
    expected: "On first launch the screen asks you to allow the camera. After you allow it, you see the live camera and the line \"Point the camera at a QR code\". Hold a QR code that contains a web address in front of the camera. Within a moment the preview is replaced by a card titled Link, showing the address, a reminder to open only links you trust, an Open button and a Scan again button. A QR code with plain text shows a Text card. Scan again returns to the camera. If you deny the permission, nothing is recorded and the Allow camera button remains.",
    tasks: ["Build the app and scan a link, plain text and a Wi-Fi code.", "Add a flashlight button using `camera.cameraControl.enableTorch`.", "Add a history list in Room with the scanned values and dates.", "Run the three unit tests for `classify`."],
    checks: ["Codes are read within a second or two in good light.", "Closing the screen stops the camera.", "The app never opens a link without a tap."],
    anim: A('Frame to result', [
      n('cam', 'CameraX', 'preview + frames', 0, 0, 'app'), n('an', 'Analyzer', 'runs per frame', 1, 0, 'tool'),
      n('ml', 'ML Kit', 'finds the code', 2, 0, 'check'), n('card', 'Result card', 'link / text / Wi-Fi', 3, 0, 'out'),
    ], [
      { say: 'CameraX shows the preview and gives your analyzer each frame.', on: ['cam'] },
      { say: 'The analyzer wraps the frame as an InputImage.', flow: ['cam>an:frame'] },
      { say: 'ML Kit looks for barcodes on the device, with no network.', flow: ['an>ml:InputImage'] },
      { say: 'The text is classified, and the screen shows a card. Links need a tap to open.', flow: ['ml>card:raw text'] },
    ]),
    faqs: [
      faq('Why must I close the ImageProxy?', 'CameraX only delivers the next frame after you release the current one. If you forget, the analysis freezes after a few frames.'),
      faq('Does ML Kit send my camera images to a server?', 'The barcode scanner used here runs on the device. Check the current ML Kit documentation for the exact behaviour of each feature.'),
      faq('Is it safe to open scanned links?', 'Treat them as untrusted. Show the address, warn the user, and open only after a tap. Consider checking against a safe browsing service for production apps.'),
    ],
  }),

  project({
    slug: 'project-18-banking-app-secure-login-biometrics-and-encrypted-token',
    title: 'Project 18: Banking-Style App with Secure Login and Biometrics',
    meta: 'Project 18: Secure Banking-Style App',
    desc: 'Build a banking-style app with secure login, a Keystore-encrypted token, biometric unlock, transaction history, transfer validation and screenshot protection.',
    intro: [
      "Banking and wallet apps show how much care security needs. This project builds the client side of a banking-style app: sign in, keep the token encrypted, unlock with a fingerprint or face, show transactions and send a transfer. It is a **learning project**. It talks to a backend that you must provide, and it should never be used for real money. Real banking software needs a regulated backend, audits and much more.",
      "The key lesson is the split of responsibility. The app is not trusted: anyone can modify it. So it only helps the user and validates early for good feedback, while the **server enforces every rule** again: who the user is, what the balance is and whether a transfer is allowed.",
    ],
    concepts: [
      "**Token, not password**: after login the server returns a short-lived token. The app stores only the token, never the password.",
      "**Android Keystore**: an AES key is created inside protected storage. `TokenVault` encrypts the token with it and saves only the encrypted bytes and the random IV.",
      "**BiometricPrompt**: asks for fingerprint, face or device credentials, and only reports success or failure. The app never sees biometric data.",
      "**Interceptor**: `BearerInterceptor` adds the token to each request, so screens never handle it.",
      "**Validation on both sides**: `BankRules.canTransfer` stops obviously wrong transfers early, but the server decides.",
      "**FLAG_SECURE**: hides the screen from screenshots and the recent apps view.",
    ],
    setup: ["New Empty Activity project `Bank`, package `com.example.bank`. This project needs `FragmentActivity`, which the code uses.", "Add the biometric, Retrofit, OkHttp and serialization libraries from the Project 18 block.", "Build or use a test backend that provides `/login`, `/transactions` and `/transfer`, and set its address in `MainActivity`.", "Create the files below."],
    tree: `Bank/app/src/main/java/com/example/bank/
  TokenVault.kt      Keystore encryption of the token
  BankModels.kt      data classes + BankRules + money format
  BankApi.kt         Retrofit interface + Bearer interceptor
  BankViewModel.kt   login, refresh, transfer, logout
  BankScreen.kt      login, locked, home
  MainActivity.kt    FragmentActivity, biometric prompt
app/src/test/.../BankTest.kt`,
    files: [...kt('p18', 'TokenVault.kt', 'bank'), ...kt('p18', 'BankModels.kt', 'bank'), ...kt('p18', 'BankApi.kt', 'bank'), ...kt('p18', 'BankViewModel.kt', 'bank'), ...kt('p18', 'BankScreen.kt', 'bank'), ...kt('p18', 'MainActivity.kt', 'bank'), ...file('p18/BankTest.kt', 'app/src/test/java/com/example/bank/BankTest.kt')],
    how: [
      "At start, the app checks whether an encrypted token exists. If it does, the screen is **locked** until the user passes the biometric prompt. If not, the login screen shows.",
      "Login validates the fields, calls the API, saves the token through `TokenVault` and loads the transactions.",
      "The balance is the sum of the transactions in cents, formatted with two decimals. Money out is negative.",
      "A transfer is checked with `BankRules.canTransfer`, sent to the server, and the list is refreshed. Server errors show a generic message that reveals no details.",
      "Logout clears the vault and the state.",
    ],
    expected: "With a working test backend: the first screen asks for a user name and password. A short password shows \"Enter your user name and a password of 8 or more characters\". After a successful sign in you see your balance, a transfer form and the recent transactions. Close the app and reopen it: the screen is locked, and the unlock button opens the system fingerprint or face dialog. After a successful check you see your account again. Entering an amount above your balance shows \"Enter an amount up to your balance\". Screenshots of the app are blocked by the system. Without a backend, sign in shows a failure message and nothing crashes.",
    tasks: ["Build the app against a small test backend of your own.", "Add auto-lock after one minute in the background using the lifecycle.", "Add a Retrofit interceptor that logs out when the server answers 401.", "Review the app against the security checklist in lesson 25 and write down three improvements."],
    checks: ["The token is never stored in plain text.", "Biometric success is required after restarting the app.", "The server, not the app, enforces transfer limits."],
    anim: A('Unlock the encrypted token', [
      n('login', 'Sign in', 'server returns token', 0, 0, 'user'), n('vault', 'TokenVault', 'AES key in Keystore', 1, 0, 'check'),
      n('bio', 'Biometric', 'fingerprint or face', 2, 0, 'tool'), n('api', 'API calls', 'Bearer token', 3, 0, 'cloud'),
    ], [
      { say: 'The user signs in and the server returns a token.', on: ['login'] },
      { say: 'The vault encrypts the token with a Keystore key and stores only the encrypted bytes.', flow: ['login>vault:encrypt'] },
      { say: 'On the next start the user must pass the biometric check.', flow: ['vault>bio:locked'] },
      { say: 'After success the interceptor adds the token to API requests.', flow: ['bio>api:authorized'] },
    ]),
    faqs: [
      faq('Is this safe for real banking?', 'No. It is a teaching example. Real banking apps need a regulated backend, security reviews, device integrity checks and much more.'),
      faq('Why store an IV with the encrypted token?', 'AES-GCM needs a unique initialisation vector for each encryption. It is not secret, but it is required to decrypt, so you save it with the data.'),
      faq('Can biometrics replace the password?', 'They are a convenient local unlock. The server still needs a proper session, and sensitive actions may ask for the password again.'),
    ],
  }),

  project({
    slug: 'project-19-ai-chatbot-app-streaming-replies-history-and-safe-api-design',
    title: 'Project 19: AI Chatbot App with Streaming Replies',
    meta: 'Project 19: AI Chatbot with Streaming',
    desc: 'Build an AI chatbot app with streaming replies, Room history, a stop button, a fake service for testing and a safe design that keeps API keys on a server.',
    intro: [
      "AI chat is now a normal app feature. The user types a question and the answer appears word by word. Building the screen is mostly about state: a list of stored messages, plus one message that is still being written. Building it safely is about design: the AI key must stay on a server, history must be limited, and the user must be able to stop a long answer.",
      "To let you build and test the whole app without a key or a server, the project uses two classes behind one interface. `FakeAiService` creates a pretend answer slowly, and `ServerAiService` calls your own backend. You start with the fake one, and switch to the real one when your server is ready.",
    ],
    concepts: [
      "**Interface with two implementations**: `AiService.reply(history)` returns a `Flow<String>` that emits the growing text.",
      "**Streaming state**: stored messages come from Room. The partial reply lives in a separate `StateFlow`, and is saved only when it is complete (or when the user stops it).",
      "**Cancellation**: the Stop button cancels the coroutine job. The code catches `CancellationException`, saves what was written and rethrows it.",
      "**History window**: `recentHistory` sends only the last messages, because the model has no memory and long requests cost more.",
      "**Server-side key**: the app sends messages to your server. The server adds the secret key, checks the user, limits use and calls the model.",
      "**Honest UI**: a notice tells users that AI answers can be wrong.",
    ],
    setup: ["New Empty Activity project `AiChat`, package `com.example.aichat`.", "Add Room, KSP, OkHttp, serialization and the coroutines test library from the Project 19 block.", "Create the files below. Start with `FakeAiService`.", "When your own server exists, switch to `ServerAiService` in `MainActivity`."],
    tree: `AiChat/app/src/main/java/com/example/aichat/
  ChatModels.kt        stored and wire messages, history window
  ChatDb.kt            Room DAO and database
  AiService.kt         interface, FakeAiService, ServerAiService
  AiChatViewModel.kt   send, stop, streaming state
  AiChatScreen.kt      messages, input, stop button
  MainActivity.kt
app/src/test/.../AiChatTest.kt`,
    files: [...kt('p19', 'ChatModels.kt', 'aichat'), ...kt('p19', 'ChatDb.kt', 'aichat'), ...kt('p19', 'AiService.kt', 'aichat'), ...kt('p19', 'AiChatViewModel.kt', 'aichat'), ...kt('p19', 'AiChatScreen.kt', 'aichat'), ...kt('p19', 'MainActivity.kt', 'aichat'), ...file('p19/AiChatTest.kt', 'app/src/test/java/com/example/aichat/AiChatTest.kt')],
    how: [
      "`send` stores the user's message, builds the recent history and starts collecting the reply flow on the IO dispatcher.",
      "Every emitted text replaces the `streaming` state, so the screen shows the growing answer with a cursor mark.",
      "When the flow finishes, the full answer is stored as an assistant message and the streaming state is cleared.",
      "If the request fails, an error line appears and the app stays usable. The Send button turns into Stop while a reply is running.",
      "`ServerAiService` reads the response body line by line and emits the growing text. Your server decides how it streams.",
    ],
    expected: "The screen shows the title Assistant, the notice \"AI answers can be wrong. Check important facts.\" and an input box. Type \"What is Kotlin?\" and press Send: your message appears on the right. Below it an answer begins to appear on the left word by word, ending with \"Connect the app to your own server to get real AI replies.\" while the Send button shows Stop. Press Stop in the middle: the partial text stays as a message. Close and reopen the app: the conversation is still there. Clear removes it.",
    tasks: ["Build the app with the fake service and chat with it.", "Write the server contract for your own backend: input messages, output streamed text.", "Add a system prompt on the server (not in the app) that sets the assistant's role.", "Add a daily message limit on the server and show a friendly message when it is reached."],
    checks: ["No AI key exists anywhere in the app or repository.", "Stop keeps the partial answer.", "Only recent messages are sent."],
    anim: A('Stored messages plus a live one', [
      n('user', 'User message', 'saved in Room', 0, 0, 'user'), n('svc', 'AiService', 'fake or your server', 1, 0, 'tool'),
      n('live', 'Streaming state', 'growing text', 2, 0, 'store'), n('db', 'Room history', 'saved when complete', 3, 0, 'out'),
    ], [
      { say: 'The user\'s message is saved and the recent history is prepared.', on: ['user'] },
      { say: 'The service returns a Flow that emits the reply as it grows.', flow: ['user>svc:history'] },
      { say: 'Each emission updates the live message on screen.', flow: ['svc>live:chunks'] },
      { say: 'When it finishes, or the user stops it, the text is saved to Room.', flow: ['live>db:save'] },
    ]),
    faqs: [
      faq('Why use a fake service?', 'It lets you build and test the screen, streaming, stopping and history without a key, a server or any cost.'),
      faq('Why send only recent messages?', 'The model has no memory, so you send context each time. Long histories cost more and can exceed limits, so send a recent window or a summary.'),
      faq('How do I stop a reply?', 'Cancel the coroutine job that collects the flow. Save the partial text in the cancellation handler and rethrow the exception.'),
    ],
  }),

  project({
    slug: 'project-20-video-streaming-app-media3-exoplayer-hls-and-playlist',
    title: 'Project 20: Video Streaming App with Media3 and HLS',
    meta: 'Project 20: Video Streaming with Media3',
    desc: 'Build a video streaming app with Media3 ExoPlayer and HLS, a PlayerView in Compose, lifecycle-safe playback, buffering and error states and a video list.',
    intro: [
      "Streaming video is harder than playing a file. Viewers have different networks, so a good service offers the same video at several qualities and lets the player switch between them as the connection changes. This is **adaptive streaming**, and the most common format on Android is **HLS**, recognised by the `.m3u8` address. ExoPlayer from Media3 supports it with one extra library.",
      "The screen part is also interesting. The player is a classic Android view, `PlayerView`, so you place it in Compose with `AndroidView`. The player holds heavy resources, so its lifecycle matters: it must pause when the app goes to the background and be released when the screen goes away. A `DisposableEffect` is the right tool.",
    ],
    concepts: [
      "**Adaptive streaming**: the player downloads small pieces of video and chooses a quality for each from your current speed.",
      "**ExoPlayer**: `setMediaItem`, `prepare`, `playWhenReady`. It picks the right media source from the address.",
      "**PlayerView in Compose**: `AndroidView` with a factory that creates the view and attaches the player.",
      "**DisposableEffect**: registers the player listener and a lifecycle observer, and releases both in `onDispose`.",
      "**States**: buffering shows a progress indicator, and an error shows a plain message.",
      "**Video list**: tapping a card changes the selected video, which recreates the player for the new address.",
    ],
    setup: ["New Empty Activity project `Video`, package `com.example.video`.", "Add the Media3 libraries, including the HLS one, from the Project 20 block, and the INTERNET permission.", "Replace the addresses in `Videos.kt` with streams you have the right to play.", "Create the files below."],
    tree: `Video/app/src/main/java/com/example/video/
  Videos.kt         list of videos + duration format
  VideoPlayer.kt    ExoPlayer inside Compose, lifecycle safe
  VideoApp.kt       player, title, list
  MainActivity.kt
app/src/test/.../VideoTest.kt`,
    files: [...kt('p20', 'Videos.kt', 'video'), ...kt('p20', 'VideoPlayer.kt', 'video'), ...kt('p20', 'VideoApp.kt', 'video'), ...kt('p20', 'MainActivity.kt', 'video'), ...file('p20/VideoTest.kt', 'app/src/test/java/com/example/video/VideoTest.kt')],
    how: [
      "`remember(url)` creates a new player for each selected video, so switching videos starts fresh.",
      "The listener reports buffering and errors up to `VideoApp`, which shows a spinner or a message.",
      "The lifecycle observer pauses the player when the activity pauses, so video does not keep playing with the screen off.",
      "`onDispose` removes the listeners and releases the player, which frees the decoder and memory.",
    ],
    expected: "The top of the screen shows the video player with the standard controls. The first video starts automatically after a moment of buffering with a small spinner. Drag the progress bar to jump. Tap another card in the list: the title changes and the new video starts. Press Home: the video pauses. If an address cannot be played, the message \"This video cannot be played right now.\" appears in the error colour and the app stays usable. On a slow network the picture quality drops by itself instead of stopping, if the stream has several qualities.",
    tasks: ["Build the app and play the HLS sample, then try your own address.", "Add a full-screen mode using a landscape activity or a `Dialog`.", "Remember the playback position for each video with DataStore.", "Add picture-in-picture support for the activity."],
    checks: ["Video pauses when the app goes to the background.", "Leaving the screen releases the player.", "You can explain what HLS and adaptive streaming are."],
    anim: A('Adaptive streaming', [
      n('srv', 'Server', 'same video, many qualities', 0, 0, 'cloud'), n('m3u8', 'HLS playlist', '.m3u8 lists the pieces', 1, 0, 'data'),
      n('exo', 'ExoPlayer', 'picks quality per piece', 2, 0, 'tool'), n('view', 'PlayerView', 'shows the video', 3, 0, 'out'),
    ], [
      { say: 'The server stores the video as small pieces at several qualities.', on: ['srv'] },
      { say: 'The player first reads the playlist that lists them.', flow: ['srv>m3u8:playlist'] },
      { say: 'ExoPlayer downloads each piece in the best quality your speed allows.', flow: ['m3u8>exo:pieces'] },
      { say: 'The PlayerView draws the frames. If your network slows, quality drops instead of stopping.', flow: ['exo>view:frames'] },
    ]),
    faqs: [
      faq('HLS or DASH?', 'Both are adaptive formats. HLS is very common and works on Android and iOS. ExoPlayer supports both.'),
      faq('Why is the player created with remember(url)?', 'A player is tied to one video. Keying remember on the address creates a fresh player when the user picks another video.'),
      faq('Why release the player?', 'It holds decoders and memory. If you forget, the video may keep using resources, and the next player may fail to start.'),
    ],
  }),

  project({
    slug: 'project-21-job-portal-app-search-filters-resume-upload-and-backend',
    title: 'Project 21: Job Portal App with Search, Filters and Resume Upload',
    meta: 'Project 21: Job Portal App with Filters',
    desc: 'Build a job portal client with a job list, search and filter chips, a detail screen, resume upload with file checks and a multipart application request.',
    intro: [
      "A job portal is a good last project because it joins list screens, filtering, forms, file handling and backend calls. It is also close to this platform's own purpose. The app has two main screens: a searchable, filterable list of jobs, and a detail screen where the user attaches a resume and applies.",
      "The app needs a backend that you provide: `GET /jobs` returns a list and `POST /jobs/{id}/apply` accepts a multipart request with a cover note and a file. Authentication is left out here to keep the lesson focused. A real portal would use the sign-in pattern from projects 13 and 18 and attach the token to every request.",
    ],
    concepts: [
      "**Filtering in plain Kotlin**: `List<Job>.filtered(JobFilter)` combines a text search, a remote-only switch and a job type. It is a pure function with unit tests.",
      "**Derived list**: `JobsState.shown` is computed from the full list and the filter, so the list and filters can never disagree.",
      "**Filter chips**: `FilterChip` for remote and job types, toggled on and off.",
      "**Storage Access Framework**: `ActivityResultContracts.OpenDocument` lets the user pick a file without any storage permission.",
      "**File checks before upload**: `resumeProblem` rejects the wrong type, an empty file and a file over 5 MB. The server must check again.",
      "**Multipart upload**: a text part for the cover note and a file part for the resume, sent with Retrofit.",
    ],
    setup: ["New Empty Activity project `Jobs`, package `com.example.jobs`.", "Add Retrofit and serialization from the Project 21 block and the INTERNET permission.", "Prepare a backend (or a mock server) that returns the JSON for `Job` and accepts the upload.", "Create the files below."],
    tree: `Jobs/app/src/main/java/com/example/jobs/
  JobModels.kt      Job, filter logic, resume rules
  JobApi.kt         Retrofit interface (list, apply)
  JobViewModel.kt   state, filters, upload
  JobScreens.kt     list with chips, detail with upload
  MainActivity.kt
app/src/test/.../JobTest.kt`,
    files: [...kt('p21', 'JobModels.kt', 'jobs'), ...kt('p21', 'JobApi.kt', 'jobs'), ...kt('p21', 'JobViewModel.kt', 'jobs'), ...kt('p21', 'JobScreens.kt', 'jobs'), ...kt('p21', 'MainActivity.kt', 'jobs'), ...file('p21/JobTest.kt', 'app/src/test/java/com/example/jobs/JobTest.kt')],
    how: [
      "The ViewModel loads the first page of jobs and keeps the filter in state. Every change to the filter recalculates `shown`.",
      "The list screen shows a spinner while loading, an error with Try again on failure, a message when nothing matches, and the cards otherwise.",
      "The detail screen opens the system file picker for PDF and Word files. The Apply button is disabled until a file is chosen and while sending.",
      "Before upload, the ViewModel reads the file's type and size, applies `resumeProblem`, and shows a clear message if it fails. Otherwise it reads the bytes and sends a multipart request.",
    ],
    expected: "The list shows a search box, chips for Remote, Full-time, Internship and Contract, and a card for each job with title, company, place and type. Type \"kotlin\": the list narrows to matching jobs. Turn on Remote and Contract together: only jobs that are both remain. Open a job: you see the description, a cover note box, Choose resume and Apply. Choose a PNG file and press Apply: the message \"Choose a PDF or Word file.\" appears. Choose a PDF under 5 MB: Apply sends it and shows \"Application sent\". Without a backend, the list shows \"Could not load jobs. Pull to try again.\" with a Try again button.",
    tasks: ["Build the app and test the filters with sample data from a mock server.", "Add sign-in and send the token in an interceptor.", "Add paging with Paging 3 and a page parameter.", "Save jobs for later in Room and add a Saved tab."],
    checks: ["Filters combine correctly.", "Wrong file types and big files are refused before upload.", "You can explain why the server must validate the resume again."],
    anim: A('Filter, choose, apply', [
      n('list', 'Job list', 'search + chips', 0, 0, 'app'), n('detail', 'Detail', 'cover note', 1, 0, 'app'),
      n('check', 'File checks', 'type and size', 2, 0, 'check'), n('srv', 'Your server', 'stores the application', 3, 0, 'cloud'),
    ], [
      { say: 'The user searches and filters the job list. The shown list is calculated from the filter.', on: ['list'] },
      { say: 'Opening a job shows its details and a resume picker.', flow: ['list>detail:open'] },
      { say: 'Before upload, the app checks the file type and size.', flow: ['detail>check:resume'] },
      { say: 'A multipart request sends the note and file. The server validates again and stores the application.', flow: ['check>srv:multipart'] },
    ]),
    faqs: [
      faq('Why does OpenDocument need no permission?', 'The system file picker runs outside your app and returns access only to the file the user chose, which is safer than broad storage access.'),
      faq('Why validate the file twice?', 'The app check gives quick feedback, but anyone can bypass the app. The server must check type, size and content itself.'),
      faq('Where should filtering happen?', 'On the server for large lists, since you cannot download everything. For small lists, a pure Kotlin function on the device is fine and easy to test.'),
    ],
  }),
];
