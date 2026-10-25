// Step-by-step animations for the React course (format: server/utils/lessonAnimation.js), keyed by lesson slug.
const n = (id, label, sub, col, row, kind) => ({ id, label, sub, col, row, kind });
const A = (title, nodes, steps) => ({ title, nodes, steps });

export const animations = {
  'what-is-react-and-why-use-it': A('How React updates the screen', [
    n('data', 'Data', 'state and props', 0, 0, 'data'), n('comp', 'Components', 'describe the screen', 1, 0, 'app'),
    n('vdom', 'Virtual DOM', 'a light copy', 2, 0, 'tool'), n('page', 'Real page', 'only changes update', 3, 0, 'out'),
  ], [
    { say: 'Your app has data, such as a list of items in a cart.', on: ['data'] },
    { say: 'Components describe what the screen should look like for that data.', flow: ['data>comp:describe'] },
    { say: 'React builds a light copy of the page in memory, called the virtual DOM.', flow: ['comp>vdom:new copy'] },
    { say: 'React compares the new copy with the old one and finds what is different.', on: ['vdom'] },
    { say: 'Only the differences change in the real page. You describe the result, and React does the work.', flow: ['vdom>page:changes only'] },
  ]),
  'set-up-react-with-vite-first-project': A('From files to the browser', [
    n('code', 'Your files', 'App.jsx, main.jsx', 0, 0, 'app'), n('vite', 'Vite', 'dev server', 1, 0, 'tool'),
    n('js', 'Plain JavaScript', 'JSX turned into JS', 2, 0, 'check'), n('browser', 'Browser', 'shows the page', 3, 0, 'out'),
  ], [
    { say: 'You write components in JSX files, such as App.jsx.', on: ['code'] },
    { say: 'npm run dev starts Vite, a fast development server.', flow: ['code>vite:save a file'] },
    { say: 'Vite turns your JSX into plain JavaScript that browsers understand.', flow: ['vite>js:convert'] },
    { say: 'The browser loads index.html, which runs main.jsx and draws App inside the root div.', flow: ['js>browser:run'] },
    { say: 'When you save again, Vite updates the page at once with no full reload.', on: ['vite', 'browser'] },
  ]),
  'jsx-explained-simply': A('What JSX becomes', [
    n('jsx', 'JSX', '<h1>{name}</h1>', 0, 0, 'app'), n('tool', 'Vite', 'compiles it', 1, 0, 'tool'),
    n('js', 'JavaScript', 'function calls', 2, 0, 'check'), n('dom', 'Screen', 'a heading shows', 3, 0, 'out'),
  ], [
    { say: 'JSX looks like HTML but lives inside JavaScript.', on: ['jsx'] },
    { say: 'The build tool changes JSX into normal JavaScript function calls. The browser cannot read JSX itself.', flow: ['jsx>tool:compile'] },
    { say: 'Curly braces run JavaScript, so {name} is replaced by its value.', flow: ['tool>js:values'] },
    { say: 'React uses the result to draw real elements on the screen.', flow: ['js>dom:render'] },
    { say: 'Remember the rules: one parent, close every tag, use className, and capital letters for components.', on: ['jsx', 'dom'] },
  ]),
  'react-components-and-props-explained': A('Props flow down', [
    n('app', 'App', 'owns the data', 0, 0, 'app'), n('list', 'TeamList', 'receives people', 1, 0, 'tool'),
    n('person', 'Person', 'receives name, role', 2, 0, 'check'), n('out', 'Screen', 'one line per person', 3, 0, 'out'),
  ], [
    { say: 'The App component owns the data: a list of people.', on: ['app'] },
    { say: 'It passes the list down to TeamList as a prop called people.', flow: ['app>list:people'] },
    { say: 'TeamList goes through the list and gives each Person a name and a role.', flow: ['list>person:name, role'] },
    { say: 'Each Person shows its own line. Props are read-only, so the child never changes them.', flow: ['person>out:shows'] },
    { say: 'Data goes down, one level at a time, so it is easy to find where a value came from.', on: ['app', 'out'] },
  ]),
  'react-usestate-hook-explained': A('What happens on a click', [
    n('click', 'Click', 'user event', 0, 0, 'user'), n('set', 'setCount', 'asks for new value', 1, 0, 'tool'),
    n('react', 'React', 'stores it, redraws', 2, 0, 'model'), n('ui', 'Screen', 'shows new count', 3, 0, 'out'),
  ], [
    { say: 'The person clicks the button.', on: ['click'] },
    { say: 'The handler calls setCount with a new value. It never changes count directly.', flow: ['click>set:handler'] },
    { say: 'React saves the new state and plans a new draw.', flow: ['set>react:new state'] },
    { say: 'React calls your component again. This time useState gives back the new value.', on: ['react'] },
    { say: 'The screen updates to show the new count.', flow: ['react>ui:re-render'] },
  ]),
  'handling-events-in-react': A('An event travels up', [
    n('user', 'User', 'clicks Like', 0, 0, 'user'), n('child', 'LikeButton', 'calls onLike', 1, 0, 'check'),
    n('parent', 'Post', 'changes state', 2, 0, 'app'), n('ui', 'Screen', 'likes go up', 3, 0, 'out'),
  ], [
    { say: 'The person clicks the Like button.', on: ['user'] },
    { say: 'The click event reaches the onClick handler of the button.', flow: ['user>child:onClick'] },
    { say: 'The child calls the onLike function that its parent gave it as a prop.', flow: ['child>parent:onLike()'] },
    { say: 'The parent changes its own state with a new value.', on: ['parent'] },
    { say: 'React draws again and the screen shows one more like. Remember: pass the function, do not call it.', flow: ['parent>ui:re-render'] },
  ]),
  'conditional-rendering-in-react': A('Show the right screen', [
    n('data', 'Request', 'loading, error, data', 0, 0, 'data'), n('load', 'Loading?', 'show a message', 1, 0, 'check'),
    n('err', 'Error?', 'show a retry', 2, 0, 'tool'), n('list', 'Data list', 'or an empty note', 3, 0, 'out'),
  ], [
    { say: 'A page that loads data is always in one of three situations.', on: ['data'] },
    { say: 'First check loading. If it is loading, return early with a loading message.', flow: ['data>load:check'] },
    { say: 'Next check for an error. If there is one, show a clear message and a way to retry.', flow: ['load>err:next'] },
    { say: 'Otherwise show the data. If the list is empty, show a helpful empty message.', flow: ['err>list:happy path'] },
    { say: 'Early returns keep the code flat. Remember to make the left side of && a real true or false.', on: ['list'] },
  ]),
  'react-lists-and-keys-explained': A('From data to a list', [
    n('data', 'Array', 'objects with an id', 0, 0, 'data'), n('map', 'map()', 'one element each', 1, 0, 'tool'),
    n('key', 'key = id', 'stable and unique', 2, 0, 'check'), n('ul', 'The list', 'shown in order', 3, 0, 'out'),
  ], [
    { say: 'Start with an array of objects. Each one has a unique id.', on: ['data'] },
    { say: 'map turns each object into an element, such as an li or a card.', flow: ['data>map:each item'] },
    { say: 'Give each element a key from your data. Never use a random key.', flow: ['map>key:key={id}'] },
    { say: 'React uses the keys to know which item is which, so it updates the right ones and keeps their state.', flow: ['key>ul:render'] },
    { say: 'To change the list, make a new array with spread, filter or map. Never change the old one.', on: ['data'] },
  ]),
  'react-forms-and-controlled-inputs': A('A controlled input', [
    n('type', 'Typing', 'a key press', 0, 0, 'user'), n('change', 'onChange', 'reads the value', 1, 0, 'tool'),
    n('state', 'State', 'the single truth', 2, 0, 'app'), n('input', 'Input', 'shows the state', 3, 0, 'out'),
  ], [
    { say: 'The person types a letter in the field.', on: ['type'] },
    { say: 'The onChange handler runs and reads event.target.value.', flow: ['type>change:new text'] },
    { say: 'The handler saves the text in state with the setter.', flow: ['change>state:setName'] },
    { say: 'React draws again, and the input shows the value from state.', flow: ['state>input:value'] },
    { say: 'State is the single source of truth, so the screen and the data can never disagree.', on: ['state', 'input'] },
  ]),
  'styling-react-apps-css-modules-tailwind': A('Ways to style React', [
    n('css', 'Plain CSS', 'global classes', 0, 0, 'tool'), n('mod', 'CSS Modules', 'unique class names', 1, 0, 'check'),
    n('tw', 'Tailwind', 'small utility classes', 2, 0, 'app'), n('ui', 'Your page', 'responsive, dark mode', 3, 0, 'out'),
  ], [
    { say: 'A plain CSS file is simple, but its classes are global and can clash.', on: ['css'] },
    { say: 'CSS Modules give each class a unique name, so styles stay inside one component.', flow: ['css>mod:safer'] },
    { say: 'Tailwind puts small ready-made classes straight in your JSX.', flow: ['mod>tw:or'] },
    { say: 'Whatever you pick, design for phones first and add rules for bigger screens.', flow: ['tw>ui:mobile first'] },
    { say: 'CSS variables and prefers-color-scheme give you dark mode with very little code.', on: ['ui'] },
  ]),
  'react-useeffect-hook-explained': A('The life of an effect', [
    n('render', 'Render', 'screen is drawn', 0, 0, 'app'), n('eff', 'Effect runs', 'after drawing', 1, 0, 'tool'),
    n('dep', 'Dependency', 'value changed?', 2, 0, 'check'), n('clean', 'Cleanup', 'stops the old one', 3, 0, 'out'),
  ], [
    { say: 'React draws your component and puts it on the screen first.', on: ['render'] },
    { say: 'Then it runs your effect, for example to fetch data or start a timer.', flow: ['render>eff:after draw'] },
    { say: 'On the next draw React checks the dependency array. If nothing changed, it skips the effect.', flow: ['eff>dep:next draw'] },
    { say: 'If a dependency changed, React first runs the cleanup of the old effect, then the effect again.', flow: ['dep>clean:changed'] },
    { say: 'When the component is removed, the last cleanup runs, so timers and listeners never leak.', on: ['clean'] },
  ]),
  'fetch-data-in-react-loading-error-states': A('Loading data safely', [
    n('comp', 'Component', 'loading = true', 0, 0, 'app'), n('fetch', 'fetch()', 'with abort signal', 1, 0, 'tool'),
    n('api', 'API', 'the server', 2, 0, 'store'), n('ui', 'Screen', 'data or error', 3, 0, 'out'),
  ], [
    { say: 'The component starts in a loading state and shows a loading message.', on: ['comp'] },
    { say: 'An effect starts the request with fetch and an abort signal.', flow: ['comp>fetch:in an effect'] },
    { say: 'The server answers. We check response.ok, because fetch does not throw on a 404.', flow: ['fetch>api:request'] },
    { say: 'On success the data goes in state. On failure a friendly error message goes in state.', flow: ['api>ui:data or error'] },
    { say: 'If the inputs change, the cleanup aborts the old request, so old data can never replace new data.', on: ['fetch'] },
  ]),
  'react-useref-hook-dom-access': A('A ref is a private notebook', [
    n('ref', 'useRef', 'holds current', 0, 0, 'data'), n('el', 'Input element', 'ref={inputRef}', 1, 0, 'app'),
    n('click', 'Button click', 'event handler', 2, 0, 'user'), n('focus', 'focus()', 'cursor in the field', 3, 0, 'out'),
  ], [
    { say: 'useRef makes a box with a current value. React keeps it between draws.', on: ['ref'] },
    { say: 'Put ref on an element, and after drawing React fills current with the real element.', flow: ['ref>el:ref prop'] },
    { say: 'Later, the person clicks a button.', on: ['click'] },
    { say: 'The handler uses ref.current to call a browser method on the real element.', flow: ['click>focus:handler'] },
    { say: 'Changing a ref never redraws the screen. If the screen must change, use state instead.', on: ['ref'] },
  ]),
  'lifting-state-up-and-component-composition': A('One source of truth', [
    n('parent', 'Parent', 'owns the state', 1, 0, 'app'), n('input', 'CelsiusInput', 'value + onChange', 0, 1, 'tool'),
    n('show', 'Fahrenheit', 'calculated from it', 2, 1, 'check'), n('screen', 'Screen', 'always in step', 3, 0, 'out'),
  ], [
    { say: 'Two components need the same number, so we move the state to their closest shared parent.', on: ['parent'] },
    { say: 'The parent passes the value and a change function down to the input.', flow: ['parent>input:value, onChange'] },
    { say: 'The person types. The input calls onChange, and the parent changes its state.', flow: ['input>parent:onChange'] },
    { say: 'The parent passes the same value to the display, which calculates Fahrenheit from it.', flow: ['parent>show:celsius'] },
    { say: 'Both parts show the same data, because there is only one copy. Data goes down, events go up.', flow: ['show>screen:shows'] },
  ]),
  'react-usereducer-hook-explained': A('Actions and a reducer', [
    n('ui', 'Component', 'dispatches', 0, 0, 'app'), n('act', 'Action', "{ type: 'added' }", 1, 0, 'data'),
    n('red', 'Reducer', '(state, action)', 2, 0, 'tool'), n('state', 'New state', 'new array', 3, 0, 'out'),
  ], [
    { say: 'The component does not change the data itself. It sends a note describing what happened.', on: ['ui'] },
    { say: 'The note is an action, a small object such as { type: "added", text: "Buy milk" }.', flow: ['ui>act:dispatch'] },
    { say: 'React gives the current state and the action to the reducer function.', flow: ['act>red:run'] },
    { say: 'The reducer follows its rules and returns a new state. It never changes the old state.', flow: ['red>state:new state'] },
    { say: 'React draws again with the new state. All the rules live in one place.', on: ['state', 'ui'] },
  ]),
  'react-context-api-usecontext-explained': A('Context skips the middle', [
    n('prov', 'Provider', 'holds the value', 0, 0, 'app'), n('mid', 'Middle layers', 'know nothing', 1, 0, 'check'),
    n('deep', 'Deep component', 'useContext()', 1, 1, 'tool'), n('ui', 'Screen', 'shows the theme', 2, 1, 'out'),
  ], [
    { say: 'A provider near the top of the app holds the value, such as the theme.', on: ['prov'] },
    { say: 'The components in the middle do not receive or pass any props for it.', on: ['mid'] },
    { say: 'A deep component calls useContext and gets the value directly from the provider.', flow: ['prov>deep:useContext'] },
    { say: 'When the provider state changes, every component that reads the context draws again.', flow: ['deep>ui:re-render'] },
    { say: 'Use context for data many components share, and wrap it in a custom hook with a helpful error.', on: ['prov', 'deep'] },
  ]),
  'react-custom-hooks-reuse-logic': A('One hook, many components', [
    n('hook', 'useDebounce', 'one hook', 1, 0, 'tool'), n('a', 'SearchBox', 'own copy of state', 0, 1, 'app'),
    n('b', 'UserFilter', 'own copy of state', 2, 1, 'app'), n('out', 'Less code', 'logic in one place', 2, 0, 'out'),
  ], [
    { say: 'You wrote the same state and effect in two places, so you move it into a custom hook.', on: ['hook'] },
    { say: 'A custom hook is a function whose name starts with use and calls other hooks.', on: ['hook'] },
    { say: 'The search box uses the hook and gets its own separate state.', flow: ['hook>a:value, delay'] },
    { say: 'The user filter uses the same hook and gets its own separate state. Hooks share logic, not data.', flow: ['hook>b:value, delay'] },
    { say: 'If you improve the hook, every component gets the improvement.', flow: ['hook>out:one place'] },
  ]),
  'react-router-pages-links-navigation': A('A page change without reload', [
    n('url', 'Address', '/products/2', 0, 0, 'user'), n('router', 'Router', 'matches a route', 1, 0, 'tool'),
    n('layout', 'Layout + Outlet', 'menu stays', 2, 0, 'check'), n('page', 'Product page', 'useParams: 2', 3, 0, 'app'),
  ], [
    { say: 'The person clicks a Link. The address changes, but the browser does not reload.', on: ['url'] },
    { say: 'React Router compares the address with your list of routes.', flow: ['url>router:path'] },
    { say: 'The shared layout stays on the screen, and the Outlet shows the matching page.', flow: ['router>layout:render'] },
    { say: 'The page reads the id from the address with useParams and loads that product.', flow: ['layout>page:Outlet'] },
    { say: 'Unknown addresses match the * route and show a not found page.', on: ['router'] },
  ]),
  'react-forms-validation-formdata-react-hook-form': A('A form with FormData', [
    n('form', 'Form', 'inputs with names', 0, 0, 'user'), n('fd', 'FormData', 'all values at once', 1, 0, 'tool'),
    n('val', 'Validate', 'one plain function', 2, 0, 'check'), n('res', 'Errors or send', 'then the server', 3, 0, 'out'),
  ], [
    { say: 'The browser keeps the values of a form. Every input needs a name.', on: ['form'] },
    { say: 'On submit, new FormData reads all fields at once. No state for each field is needed.', flow: ['form>fd:submit'] },
    { say: 'A plain validation function checks the data and returns an object of errors.', flow: ['fd>val:data'] },
    { say: 'If there are errors, show a clear message next to each field. If not, send the data.', flow: ['val>res:result'] },
    { say: 'The server must check everything again. Browser checks can be skipped.', on: ['res'] },
  ]),
  'how-react-renders-rules-of-react-strictmode': A('Trigger, render, commit', [
    n('trig', 'Trigger', 'state changed', 0, 0, 'user'), n('rend', 'Render', 'call components', 1, 0, 'tool'),
    n('diff', 'Compare', 'old and new JSX', 2, 0, 'check'), n('commit', 'Commit', 'update real page', 3, 0, 'out'),
  ], [
    { say: 'A state change, or the first draw, triggers React to work.', on: ['trig'] },
    { say: 'Render means React calls your component functions and gets new JSX. Components must be pure.', flow: ['trig>rend:call'] },
    { say: 'React compares the new result with the old one.', flow: ['rend>diff:compare'] },
    { say: 'Commit: only the real differences are changed in the page.', flow: ['diff>commit:changes only'] },
    { say: 'If nothing is different, the page is left alone, even though your function ran.', on: ['diff'] },
  ]),
  'react-performance-memo-usememo-usecallback': A('Skip needless renders', [
    n('type', 'Typing', 'parent state changes', 0, 0, 'user'), n('move', 'Move state down', 'simplest fix', 1, 0, 'tool'),
    n('memo', 'memo', 'skips same props', 2, 0, 'check'), n('steady', 'useMemo/useCallback', 'steady props', 3, 0, 'app'),
  ], [
    { say: 'Typing in a parent redraws a big child every time, even if the child did not change.', on: ['type'] },
    { say: 'First measure with the Profiler. Then try the simplest fix: move the state down into a small component.', flow: ['type>move:fix 1'] },
    { say: 'If the child is still slow, wrap it in memo so React skips it when its props are the same.', flow: ['move>memo:fix 2'] },
    { say: 'Objects and functions are new on every render, so keep them steady with useMemo and useCallback.', flow: ['memo>steady:fix 3'] },
    { say: 'Do not add these everywhere. Measure first, and fix only what is really slow.', on: ['memo', 'steady'] },
  ]),
  'react-lazy-suspense-code-splitting': A('Load code only when needed', [
    n('home', 'Home page', 'small first bundle', 0, 0, 'app'), n('click', 'Visit /admin', 'user goes there', 1, 0, 'user'),
    n('lazy', 'lazy import', 'downloads the file', 2, 0, 'tool'), n('sus', 'Suspense', 'fallback, then page', 3, 0, 'out'),
  ], [
    { say: 'The first visit downloads only the code of the home page, so it loads fast.', on: ['home'] },
    { say: 'Later the person opens the admin page.', flow: ['home>click:navigate'] },
    { say: 'lazy starts a dynamic import and downloads the admin code only now.', flow: ['click>lazy:import()'] },
    { say: 'Suspense shows a fallback while the file loads, then shows the page.', flow: ['lazy>sus:ready'] },
    { say: 'Split by route first, then heavy libraries. Preload on hover to hide the wait.', on: ['lazy'] },
  ]),
  'react-error-boundaries-portals-modals': A('A crash stays small', [
    n('app', 'Page', 'keeps working', 0, 0, 'app'), n('bound', 'Error boundary', 'catches the error', 1, 0, 'check'),
    n('widget', 'Chart widget', 'throws an error', 2, 0, 'tool'), n('fall', 'Fallback', 'friendly message', 1, 1, 'out'),
  ], [
    { say: 'Without a plan, an error while rendering turns the whole page white.', on: ['widget'] },
    { say: 'A widget throws an error while it renders.', flow: ['widget>bound:error'] },
    { say: 'The error boundary above it catches the error and reports it.', on: ['bound'] },
    { say: 'It shows a fallback message in place of the widget, with a retry button.', flow: ['bound>fall:fallback'] },
    { say: 'The rest of the page keeps working. Remember boundaries do not catch errors in click handlers or fetch.', flow: ['bound>app:page is safe'] },
  ]),
  'react-state-management-redux-toolkit-zustand': A('Store, actions, components', [
    n('comp', 'Component', 'clicks Add', 0, 0, 'user'), n('act', 'Action', 'cart/added', 1, 0, 'data'),
    n('store', 'Store', 'reducer or set()', 2, 0, 'store'), n('sel', 'Selectors', 'read small pieces', 3, 0, 'out'),
  ], [
    { say: 'Many far-apart components need the cart, so it lives in one central store.', on: ['store'] },
    { say: 'A component sends an action, or calls a store function, to add a product.', flow: ['comp>act:dispatch'] },
    { say: 'The store updates its state by the rules, as a new copy.', flow: ['act>store:reducer'] },
    { say: 'Components read only what they need with selectors, so only those redraw.', flow: ['store>sel:select'] },
    { say: 'Use a store only for shared client state. Keep local state local and use a data library for server data.', on: ['store'] },
  ]),
  'tanstack-query-react-data-fetching': A('A query with a cache', [
    n('comp', 'Component', 'useQuery(key)', 0, 0, 'app'), n('cache', 'Query cache', 'by query key', 1, 0, 'store'),
    n('api', 'Server', 'queryFn fetches', 2, 0, 'tool'), n('mut', 'Mutation', 'invalidate the key', 3, 0, 'check'),
  ], [
    { say: 'A component asks for data with a query key, such as ["posts"].', on: ['comp'] },
    { say: 'The library checks its cache. Cached data shows at once, and stale data refreshes in the background.', flow: ['comp>cache:key'] },
    { say: 'If it needs fresh data, it calls your queryFn, with retries and cancelling built in.', flow: ['cache>api:fetch'] },
    { say: 'Later a mutation saves a new post. It then invalidates the key.', flow: ['api>mut:POST'] },
    { say: 'The list reloads by itself and shows the new post, with no manual state code.', on: ['cache'] },
  ]),
  'testing-react-vitest-testing-library': A('A test acts like a user', [
    n('render', 'render()', 'draw the component', 0, 0, 'app'), n('find', 'getByRole', 'find like a user', 1, 0, 'tool'),
    n('user', 'user.click', 'click and type', 2, 0, 'user'), n('expect', 'expect()', 'check the screen', 3, 0, 'check'),
  ], [
    { say: 'A test draws your component in a fake browser.', on: ['render'] },
    { say: 'It finds elements the way people do: by role, label and text, not by internal names.', flow: ['render>find:query'] },
    { say: 'It clicks and types, with user-event, like a real person.', flow: ['find>user:act'] },
    { say: 'Then it checks what is on the screen with expect.', flow: ['user>expect:assert'] },
    { say: 'Test the user, not the code inside. Then you can tidy the code without breaking tests.', on: ['expect'] },
  ]),
  'react-accessibility-a11y-guide': A('Everyone can use it', [
    n('html', 'Semantic HTML', 'button, nav, h1', 0, 0, 'app'), n('label', 'Labels and alt', 'names for all', 1, 0, 'tool'),
    n('key', 'Keyboard', 'focus visible', 2, 0, 'check'), n('test', 'Test it', 'tools and a reader', 3, 0, 'out'),
  ], [
    { say: 'Start with the right HTML elements. A real button works with keyboard and screen reader for free.', on: ['html'] },
    { say: 'Add a label to every field and alt text to every meaningful image.', flow: ['html>label:name it'] },
    { say: 'Make everything work with the keyboard only, and keep the focus ring visible.', flow: ['label>key:Tab, Enter'] },
    { say: 'Check contrast, do not use colour alone, and announce changes with live regions.', on: ['key'] },
    { say: 'Test with only the keyboard, Lighthouse or axe, and a screen reader. Tools find only part of the problems.', flow: ['key>test:check'] },
  ]),
  'react-19-new-features-actions-use-optimistic': A('A form action in React 19', [
    n('form', 'Form action', 'action={fn}', 0, 0, 'user'), n('act', 'useActionState', 'result and pending', 1, 0, 'tool'),
    n('opt', 'useOptimistic', 'show it at once', 2, 0, 'check'), n('srv', 'Server', 'real answer', 3, 0, 'store'),
  ], [
    { say: 'You pass a function to the form action. React gives it the FormData.', on: ['form'] },
    { say: 'useActionState keeps the result, an error message and the pending flag for you.', flow: ['form>act:submit'] },
    { say: 'useOptimistic shows the expected result on screen right away.', flow: ['act>opt:show now'] },
    { say: 'Meanwhile the real request goes to the server.', flow: ['opt>srv:request'] },
    { say: 'If it works, the real data replaces the guess. If it fails, the guess disappears and you show an error.', on: ['srv'] },
  ]),
  'react-with-typescript-beginners-guide': A('Types catch mistakes early', [
    n('type', 'Type User', 'id, name, role', 0, 0, 'data'), n('comp', 'Component', 'props: User', 1, 0, 'app'),
    n('ed', 'Editor', 'red line at once', 2, 0, 'check'), n('build', 'Build', 'types removed', 3, 0, 'out'),
  ], [
    { say: 'You describe the shape of your data with a type, such as User.', on: ['type'] },
    { say: 'Components use the type for their props and state.', flow: ['type>comp:props'] },
    { say: 'If you pass a wrong field or forget a prop, the editor shows a red line right away.', flow: ['comp>ed:check'] },
    { say: 'When you build the app, the types are removed and plain JavaScript is left.', flow: ['ed>build:compile'] },
    { say: 'Remember: a type cannot check what the server really sends at run time. Avoid any.', on: ['type'] },
  ]),
  'react-project-structure-best-practices-deploy-next-steps': A('From code to a live site', [
    n('src', 'Organised src', 'features, hooks', 0, 0, 'app'), n('check', 'Checks', 'tests, Lighthouse', 1, 0, 'check'),
    n('build', 'npm run build', 'the dist folder', 2, 0, 'tool'), n('live', 'Live site', 'HTTPS + fallback', 3, 0, 'out'),
  ], [
    { say: 'Organise your code in clear folders and keep components small.', on: ['src'] },
    { say: 'Before shipping, test the real build, run Lighthouse, and use only the keyboard for a minute.', flow: ['src>check:review'] },
    { say: 'npm run build makes the dist folder with plain static files.', flow: ['check>build:build'] },
    { say: 'Upload dist to a host. Turn on HTTPS and a fallback to index.html for React Router.', flow: ['build>live:deploy'] },
    { say: 'Never put secrets in React code. Keep building projects, then learn Next.js and a backend.', on: ['live'] },
  ]),
};
