import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from './utils/enzymeConfig'
import { changeInput, changeSelect, changeCheckbox } from './utils/changeField'
import {
  createSchema,
  Autoform,
} from '../src/index'

const custom = createSchema('simple', {
  name: {
    type: 'string',
  },
  numberer: {
    type: 'number'
  },
  radiator: {
    type: 'radios',
    options: ['a', 'b']
  },
  selector: {
    type: 'select',
    options: ['c', 'd']
  },
  booler: {
    type: 'boolean'
  }
})

test('Submits', async () => {
  let doSubmit
  const wasSubmitted = new Promise((resolve) => {
    doSubmit = resolve 
  })
  const mockSubmit = jest.fn(() => {
    doSubmit()
  })
  const mockChange = jest.fn()

  const app = mount(
    <Autoform schema={custom} onSubmit={mockSubmit} onChange={mockChange} />
  )

  const input = app.find('input[name="name"]')
  changeInput(input, 'Hello')

  const radiatorB = app.find('#simple-radiator-b')
  changeCheckbox(radiatorB, true)

  const numberer = app.find('input[name="numberer"]')
  changeInput(numberer, '128')

  const selector = app.find('select[name="selector"]')
  changeSelect(selector, 'd')

  const booler = app.find('input[name="booler"]')
  changeCheckbox(booler, true)

  const wantedDoc = {
    name: 'Hello',
    numberer: 128,
    radiator: 'b',
    selector: 'd',
    booler: true
  }

  // Test onChanges
  expect(mockChange.mock.calls.length).toBe(5)
  expect(mockChange.mock.calls[4][0]).toStrictEqual(wantedDoc)

  // Test submit
  const Form = app.find(Autoform)
  await act(async () => {
    await Form.simulate('submit')
  })

  expect.assertions(4)
  const { calls } = mockSubmit.mock
  return wasSubmitted.then(() => {
    expect(calls.length).toBe(1)
    expect(calls[0][0]).toStrictEqual(wantedDoc)
  })
})
