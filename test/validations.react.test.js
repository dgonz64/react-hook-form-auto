import 'jsdom-global/register'
import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from './utils/enzymeConfig'
import { changeInput } from './utils/changeField'
import {
  createSchema,
  Autoform,
  tr,
  addTranslations,
  InputWrap
} from '../src/index'
import { createSubmitMocks } from './utils/createSubmitMocks'
import { createParenter } from './utils/createParenter'

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
  changeInput(input, 'abcd')

  const inputWeight = app.find('input[name="weight"]')
  changeInput(inputWeight, '15')

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

test('Calls onErrors with message when pattern is bad', async () => {
  const { wasSubmitted, mockSubmit } = createSubmitMocks()

  const app = mount(
    <Autoform schema={custom} onErrors={mockSubmit} />
  )

  const input = app.find('input[name="name"]')
  changeInput(input, 'abcx')

  const form = app.find(Autoform)
  await act(async () => {
    await form.simulate('submit')
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
  changeInput(name, 'abcd')
  const weight = app.find('input[name="weight"]')
  changeInput(weight, '15')

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
  changeInput(name, 'abcd')
  const weight = app.find('input[name="weight"]')
  changeInput(weight, '150')

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

test('Fails successfuly with nested components', async () => {
  const { wasSubmitted, mockSubmit } = createSubmitMocks()

  const parenter = createParenter({ everythingRequired: true })

  const app = mount(
    <Autoform schema={parenter} onErrors={mockSubmit} />
  )

  const form = app.find(Autoform)
  await act(async () => {
    await form.simulate('submit')
  })

  expect.assertions(7)

  const { calls } = mockSubmit.mock
  return wasSubmitted.then(() => {
    const doc = calls[0][0]
    expect(doc.name.message).toBe('error.required')
    expect(doc.childs).toHaveLength(1)
    expect(doc.childs[0].name.message).toBe('error.required')
    expect(doc.child.name.message).toBe('error.required')

    const fields = [
      'name',
      'childs.0.name',
      'child.name'
    ]

    const wraps = app.find(InputWrap)
    wraps.forEach(wrap => {
      const name = wrap.prop('name')
      if (fields.includes(name)) {
        const contents = wrap.text()
        expect(contents).toMatch(/error.required/)
      }
    })
  })
})
