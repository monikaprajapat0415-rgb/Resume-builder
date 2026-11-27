// Run: node --test client/src/utils/fileToolsLib.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRanges, fitRect, pickQuality, formatBytes, safeName } from './fileToolsLib.js'

test('parseRanges', () => {
  assert.deepEqual(parseRanges('1-3, 5, 8-10', 10).pages, [0, 1, 2, 4, 7, 8, 9])
  assert.deepEqual(parseRanges('3,3,2-3', 5).pages, [1, 2])
  assert.deepEqual(parseRanges(' 2 - 4 ', 4).pages, [1, 2, 3])
  for (const bad of ['', 'a', '0', '5-2', '1-20', '1,,x', '-3']) assert.ok(parseRanges(bad, 10).error, bad)
  assert.match(parseRanges('11', 10).error, /10 pages/)
})

test('fitRect crop, contain, stretch', () => {
  assert.deepEqual(fitRect(400, 200, 100, 100, 'crop'), { sx: 100, sy: 0, sw: 200, sh: 200, dx: 0, dy: 0, dw: 100, dh: 100 })
  assert.deepEqual(fitRect(400, 200, 100, 100, 'contain'), { sx: 0, sy: 0, sw: 400, sh: 200, dx: 0, dy: 25, dw: 100, dh: 50 })
  assert.deepEqual(fitRect(400, 200, 100, 100, 'stretch'), { sx: 0, sy: 0, sw: 400, sh: 200, dx: 0, dy: 0, dw: 100, dh: 100 })
})

test('pickQuality finds the highest quality that fits, and says when nothing fits', () => {
  const size = (q) => Math.round(q * 100000)            // 100 KB at q=1
  const r = pickQuality(size, 50000)
  assert.ok(r.fits && r.size <= 50000 && r.quality > 0.45 && r.quality <= 0.5, JSON.stringify(r))
  assert.equal(pickQuality(size, 200000).quality, 0.95)
  const none = pickQuality(size, 1000)
  assert.equal(none.fits, false); assert.equal(none.quality, 0.05)
})

test('formatBytes and safeName', () => {
  assert.equal(formatBytes(500), '500 B'); assert.equal(formatBytes(2048), '2.0 KB'); assert.equal(formatBytes(3 * 1024 * 1024), '3.0 MB')
  assert.equal(safeName('My Résumé (final).pdf'), 'My Rsum final'); assert.equal(safeName(''), 'file')
})
