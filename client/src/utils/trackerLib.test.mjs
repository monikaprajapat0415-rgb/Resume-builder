// Run: node --test client/src/utils/trackerLib.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { COLUMNS, dueState, dueCount, groupByStatus, dayValue, prettyDay, todayLocal } from './trackerLib.js'

const card = (o) => ({ _id: Math.random().toString(), status: 'applied', updatedAt: '2026-11-01T00:00:00Z', ...o })

test('dueState: overdue, today, later, and cards that never nag', () => {
  assert.equal(dueState(card({ followUpOn: '2026-11-27T00:00:00.000Z' }), '2026-11-28'), 'overdue')
  assert.equal(dueState(card({ followUpOn: '2026-11-28' }), '2026-11-28'), 'today')
  assert.equal(dueState(card({ followUpOn: '2026-11-29' }), '2026-11-28'), null)
  assert.equal(dueState(card({}), '2026-11-28'), null)
  assert.equal(dueState(card({ status: 'closed', followUpOn: '2026-01-01' }), '2026-11-28'), null)
  assert.equal(dueState(card({ status: 'offer', followUpOn: '2026-01-01' }), '2026-11-28'), null)
  assert.equal(dueState(card({ status: 'interview', followUpOn: '2026-01-01' }), '2026-11-28'), 'overdue')
})

test('groupByStatus puts every card in a column, due cards first', () => {
  const a = card({ company: 'A', updatedAt: '2026-11-20T00:00:00Z' })
  const b = card({ company: 'B', updatedAt: '2026-11-10T00:00:00Z', followUpOn: '2026-11-20' })
  const c = card({ company: 'C', status: 'offer' })
  const d = card({ company: 'D', status: 'weird' })
  const g = groupByStatus([a, b, c, d], '2026-11-28')
  assert.deepEqual(Object.keys(g), COLUMNS.map((x) => x.id))
  assert.deepEqual(g.applied.map((x) => x.company), ['B', 'A', 'D'])
  assert.deepEqual(g.offer.map((x) => x.company), ['C'])
  assert.equal(dueCount([a, b, c], '2026-11-28'), 1)
})

test('dates', () => {
  assert.equal(dayValue('2026-11-28T00:00:00.000Z'), '2026-11-28'); assert.equal(dayValue(null), '')
  assert.equal(prettyDay('2026-11-28T00:00:00.000Z'), '28 Nov 2026'); assert.equal(prettyDay(''), '')
  assert.equal(todayLocal(new Date(2026, 10, 5)), '2026-11-05')
})
