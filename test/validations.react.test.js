import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from './utils/enzymeConfig'
import {
  createSchema,
  Autoform,
  tr,
  addTranslations
} from '../src/index'
import { createSubmitMocks } from './utils/createSubmitMocks'

addTranslations({
  error: {
    contains: 'Wrong, should be __pattern__',
    maxWeight: 'Too heavy'
  }
})

const custom = createSchema('validator', {
  name: {
    type: 'string',
    pattern: {
      value: /abcd/,
      message: fieldSchema => tr('error.contains', {
        pattern: fieldSchema.pattern.value.toString()
      })
    }
  },
  weight: {
    type: 'number',
    validate: {
      value: value => value < 100 || tr('error.maxWeight')
    }
  }
})

test('Passes with pattern', async () => {
  const { wasSubmitted, mockSubmit } = createSubmitMocks()

  const app = mount(
    <Autoform schema={custom} onSubmit={mockSubmit} />
  )

  const input = app.find('input[name="name"]')
  input.instance().value = 'abcd'

  const inputWeight = app.find('input[name="weight"]')
  inputWeight.instance().value = 15

  const form = app.find(Autoform)
  await act(async () => {
    await form.simulate('submit')
  })

  expect.assertions(1)
  const { calls } = mockSubmit.mock
  return wasSubmitted.then(() => {
    expect(calls[0][0]).toStrictEqual({ name: 'abcd', weight: 15 })
  })
})

test('Gives error with message when pattern is bad', async () => {
  const { wasSubmitted, mockSubmit } = createSubmitMocks()

  const app = mount(
    <Autoform schema={custom} onErrors={mockSubmit} />
  )

  const input = app.find('input[name="name"]')
  input.instance().value = 'abcx'

  const form = app.find(Autoform)
  await act(async () => {
    await form.simulate('submit')
    form.update()
  })

  expect.assertions(1)
  const { calls } = mockSubmit.mock
  return wasSubmitted.then(() => {
    expect(calls[0][0]).toMatchObject({
      name: {
        type: 'pattern',
        message: 'Wrong, should be /abcd/'
      }
    })
  })
})

test('Passes with validation function', async () => {
  const { wasSubmitted, mockSubmit } = createSubmitMocks()

  const app = mount(
    <Autoform schema={custom} onSubmit={mockSubmit} />
  )

  const name = app.find('input[name="name"]')
  name.instance().value = 'abcd'
  const weight = app.find('input[name="weight"]')
  weight.instance().value = 15

  const form = app.find(Autoform)
  await act(async () => {
    await form.simulate('submit')
  })

  expect.assertions(1)

  const { calls } = mockSubmit.mock
  return wasSubmitted.then(() => {
    expect(calls[0][0]).toStrictEqual({ name: 'abcd', weight: 15 })
  })
})

test('Fails successfuly with validation function', async () => {
  const { wasSubmitted, mockSubmit } = createSubmitMocks()

  const app = mount(
    <Autoform schema={custom} onErrors={mockSubmit} />
  )

  const name = app.find('input[name="name"]')
  name.instance().value = 'abcd'
  const weight = app.find('input[name="weight"]')
  weight.instance().value = 150

  const form = app.find(Autoform)
  await act(async () => {
    await form.simulate('submit')
  })

  expect.assertions(1)

  const { calls } = mockSubmit.mock
  return wasSubmitted.then(() => {
    expect(calls[0][0]).toMatchObject({ weight: { message: 'Too heavy' } })
  })
})
