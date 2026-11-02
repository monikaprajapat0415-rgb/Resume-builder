import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LuCheck, LuRefreshCw, LuX } from 'react-icons/lu'

// "Read the code, predict the output" for Swift. Real Swift cannot run in a browser, so this tool never runs code:
// each answer was worked out by hand and is explained. Run the snippet in Xcode or a Swift Playground to confirm.
// Admin > Free tools > "Swift code reader" switches the page off.
const Q = (title, code, options, answer, why) => ({ title, code, options, answer, why })
const BANK = [
  Q('let and var', 'var a = 1\nlet b = a\na = 5\nprint(a, b)', ['5 1', '5 5', '1 1'], 0, 'b was set to a copy of the value 1 when it was created. Changing a later does not change b.'),
  Q('Struct copy', 'struct P { var x = 0 }\nvar a = P()\nvar b = a\nb.x = 5\nprint(a.x, b.x)', ['0 5', '5 5', '0 0'], 0, 'Structs are value types. b is its own copy, so changing b.x leaves a alone.'),
  Q('Class reference', 'class P { var x = 0 }\nlet a = P()\nlet b = a\nb.x = 5\nprint(a.x, b.x)', ['5 5', '0 5', '0 0'], 0, 'Classes are reference types. a and b point to the same object, so a change through b shows in a.'),
  Q('Failing conversion', 'let n = Int("12a")\nprint(n ?? -1)', ['-1', '12', 'nil'], 0, 'Int("12a") fails because of the letter, so it is nil. The ?? operator then gives the default, -1.'),
  Q('Printing an optional', 'let n = Int("12")\nprint(n)', ['Optional(12)', '12', 'nil'], 0, 'Int(String) returns an optional. print shows it as Optional(12). You would unwrap it with if let or ?? to get 12.'),
  Q('filter then map', 'let r = [1, 2, 3, 4].filter { $0 % 2 == 0 }.map { $0 * 10 }\nprint(r)', ['[20, 40]', '[10, 20, 30, 40]', '[2, 4]'], 0, 'filter keeps 2 and 4. map multiplies each by 10, giving [20, 40].'),
  Q('reduce with a start value', 'let r = [1, 2, 3].reduce(10) { $0 + $1 }\nprint(r)', ['16', '6', '10'], 0, 'reduce starts at 10 and adds 1, 2 and 3, so the answer is 16.'),
  Q('Half-open range', 'for i in 1..<4 {\n    print(i, terminator: " ")\n}', ['1 2 3', '1 2 3 4', '0 1 2 3'], 0, 'The range 1..<4 stops before 4, so it runs for 1, 2 and 3.'),
  Q('defer', 'func f() {\n    defer { print("c") }\n    print("a")\n    print("b")\n}\nf()', ['a b c (one per line)', 'c a b (one per line)', 'a c b (one per line)'], 0, 'A defer block runs when the function is about to exit, so "c" prints last.'),
  Q('guard let', 'func g(_ s: String?) {\n    guard let s else {\n        print("none")\n        return\n    }\n    print(s.count)\n}\ng(nil)\ng("hey")', ['none, then 3', '3, then none', 'none, then none'], 0, 'g(nil) fails the guard and prints none. g("hey") passes, and "hey" has 3 characters.'),
  Q('Closure captures a variable', 'var count = 0\nlet inc = { count += 1 }\ninc()\ninc()\nprint(count)', ['2', '0', '1'], 0, 'A closure captures the variable itself, not a copy of its value. Two calls add 2 to count.'),
  Q('switch with where', 'let n = 7\nswitch n {\ncase 1...5: print("low")\ncase 6...10 where n % 2 == 0: print("even high")\ncase 6...10: print("odd high")\ndefault: print("other")\n}', ['odd high', 'even high', 'low'], 0, '7 is in 6...10 but not even, so the second case fails its where clause and the third case matches.'),
  Q('Dictionary default', 'var d = ["a": 1]\nd["b", default: 0] += 2\nprint(d["b"] ?? 0, d.count)', ['2 2', '2 1', '0 2'], 0, 'The default 0 is used because "b" is missing, then 2 is added and stored. The dictionary now has two keys.'),
  Q('String helpers', 'let s = "Swift"\nprint(s.count, s.uppercased(), s.prefix(2))', ['5 SWIFT Sw', '5 Swift Sw', '4 SWIFT Sw'], 0, '"Swift" has 5 characters, uppercased gives SWIFT, and prefix(2) gives the first two characters, Sw.'),
  Q('Enum raw values', 'enum L: Int { case a = 1, b, c }\nprint(L.c.rawValue)', ['3', '2', '0'], 0, 'a is 1, and each next case adds 1 when no value is given, so b is 2 and c is 3.'),
  Q('When an object is freed', 'class T { deinit { print("freed") } }\nvar t: T? = T()\nt = nil\nprint("end")', ['freed, then end', 'end, then freed', 'end only'], 0, 'Setting t to nil removes the only strong reference, so the object is freed at once and deinit runs before the next line.'),
  Q('Catching an error', 'enum E: Error { case bad }\nfunc f() throws { throw E.bad }\ndo {\n    try f()\n    print("ok")\n} catch {\n    print("caught")\n}', ['caught', 'ok', 'ok, then caught'], 0, 'f() throws, so the rest of the do block is skipped and the catch block runs. "ok" is never printed.'),
  Q('sorted does not change the original', 'let a = [3, 1, 2]\nprint(a.sorted(), a)', ['[1, 2, 3] [3, 1, 2]', '[1, 2, 3] [1, 2, 3]', '[3, 1, 2] [1, 2, 3]'], 0, 'sorted() returns a new array. The constant a is not changed. (sort() would change a var in place.)'),
]
const shuffle = (a) => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]] } return x }

const SwiftReader = () => {
  const [seed, setSeed] = useState(0)
  const items = useMemo(() => shuffle(BANK).slice(0, 8).map((q) => { const order = shuffle(q.options.map((_, i) => i)); return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) } }), [seed])
  const [picked, setPicked] = useState({})
  const done = Object.keys(picked).length === items.length
  const score = items.filter((q, i) => picked[i] === q.answer).length
  const again = () => { setPicked({}); setSeed((s) => s + 1) }

  return (
    <div className='max-w-3xl mx-auto'>
      <p className='text-sm text-slate-600'>Read each snippet, pick what it prints, then see why. This tool does not run any code. Each answer was worked out by hand, and you can confirm it by running the snippet in Xcode or a Swift Playground. Need the basics first? Try the <Link to='/learn/ios-development-swift-swiftui-course' className='text-brand-700 underline'>free iOS course</Link>.</p>
      <ol className='mt-6 space-y-6'>
        {items.map((q, i) => {
          const chosen = picked[i]
          const answered = chosen !== undefined
          return (
            <li key={`${seed}-${q.title}`} className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm' data-testid='swift-q'>
              <p className='text-xs font-medium text-slate-500'>{i + 1} of {items.length} · {q.title}</p>
              <pre className='mt-2 overflow-x-auto rounded-lg bg-slate-900 text-slate-100 p-3 text-xs leading-relaxed'><code>{q.code}</code></pre>
              <p className='text-sm font-medium text-slate-800 mt-3'>What does it print?</p>
              <div className='mt-2 grid gap-2' role='group' aria-label={`Answers for ${q.title}`}>
                {q.options.map((o, k) => {
                  const right = answered && k === q.answer, wrong = answered && k === chosen && k !== q.answer
                  return (
                    <button key={o} type='button' disabled={answered} onClick={() => setPicked((p) => ({ ...p, [i]: k }))}
                      className={`flex items-center justify-between gap-3 text-left rounded-lg border px-3 py-2 text-sm font-mono ${right ? 'border-green-500 bg-green-50 text-green-800' : wrong ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:hover:bg-white'}`}>
                      <span>{o}</span>{right && <LuCheck className='size-4' aria-label='Correct' />}{wrong && <LuX className='size-4' aria-label='Not correct' />}
                    </button>
                  )
                })}
              </div>
              {answered && <p className='mt-3 text-sm text-slate-700 rounded-lg bg-slate-50 border border-slate-200 p-3'><strong>{chosen === q.answer ? 'Right. ' : 'Not quite. '}</strong>{q.why}</p>}
            </li>
          )
        })}
      </ol>
      {done && (
        <div className='mt-6 rounded-2xl border border-brand-200 bg-brand-50/50 p-5 text-center' data-testid='swift-score'>
          <p className='text-lg font-semibold text-slate-800'>You got {score} of {items.length}</p>
          <button type='button' onClick={again} className='mt-3 inline-flex items-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-6 py-2.5'><LuRefreshCw className='size-4' />Try a new set</button>
        </div>
      )}
    </div>
  )
}
export default SwiftReader
