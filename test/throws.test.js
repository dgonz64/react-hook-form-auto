import 'jsdom-global/register'
import React from 'react'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from './utils/enzymeConfig'
import { ErrorBoundary, consoleMock } from './utils/ErrorBoundary'
import {
  createSchema,
  Autoform,
} from '../src/index'

test('Throws error when you forgot to pass schema', async () => {
  const spy = jest.fn()

  const oldError = console.error
  console.error = jest.fn()

  const app = mount(
    <ErrorBoundary spy={spy}>
      <Autoform />
    </ErrorBoundary>
  )
  console.error = oldError

  const { calls } = spy.mock

  expect(app.state()).toHaveProperty('hasError', true)
  expect(calls).toHaveLength(1)
  expect(calls[0][0].message).toBe(
    '<Autoform /> was rendered without schema.'
  )
})

test('Throws error when field lacks type', async () => {
  const spy = jest.fn()

  const schema = createSchema('fail', {
    notype: {}
  })

  const oldError = console.error
  console.error = jest.fn()

  const app = mount(
    <ErrorBoundary spy={spy}>
      <Autoform schema={schema} />
    </ErrorBoundary>
  )
  console.error = oldError

  const { calls } = spy.mock

  expect(app.state()).toHaveProperty('hasError', true)
  expect(calls).toHaveLength(1)
  expect(calls[0][0]).toBe(
    'Schema "fail" has field "notype" that lacks type description.'
  )
})

test('Throws error when type doesn\'t exist in skin', async () => {
  const spy = jest.fn()

  const schema = createSchema('fail', {
    notype: { type: 'some-shit' }
  })

  const oldError = console.error
  console.error = jest.fn()

  const app = mount(
    <ErrorBoundary spy={spy}>
      <Autoform schema={schema} />
    </ErrorBoundary>
  )
  console.error = oldError

  const { calls } = spy.mock

  expect(app.state()).toHaveProperty('hasError', true)
  expect(calls).toHaveLength(1)
  expect(calls[0][0]).toBe(
    'Schema "fail" has field "notype" with type "some-shit" that doesn\'t exist in skin.'
  )
})
