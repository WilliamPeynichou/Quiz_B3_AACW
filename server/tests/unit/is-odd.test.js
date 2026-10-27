import { test } from 'node:test'
import assert from 'node:assert/strict'
import isOdd from 'is-odd'

test('7 est pair', () => {
  assert.equal(isOdd(7), false)
})
