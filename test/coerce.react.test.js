import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from './utils/enzymeConfig'
import {
  createSchema,
  Autoform,
} from '../src/index'

const sub = createSchema('sub', {
  amount: {
    type: 'number'
  }
})

const custom = createSchema('complex', {
  name: {
    type: 'string',
  },
  subs: {
    type: [sub]
  },
  sub: {
    type: sub
  }
})

test('Coerces', async () => {
  let doSubmit
  const wasSubmitted = new Promise((resolve, reject) => {
    doSubmit = resolve 
  })
  const mockSubmit = jest.fn(() => {
    doSubmit()
  })

  const app = mount(
    <Autoform schema={custom} onSubmit={mockSubmit} />
  )

  const input = app.find('input[name="name"]')
  input.instance().value = 'Hello'

  const amount0 = app.find('input[name="subs[0].amount"]')
  amount0.instance().value = '42'

  const amount = app.find('input[name="sub.amount"]')
  amount.instance().value = '666'

  const Form = app.find(Autoform)
  await act(async () => {
    await Form.simulate('submit')
  })

  expect.assertions(2)
  const { calls } = mockSubmit.mock
  return wasSubmitted.then(() => {
    expect(calls.length).toBe(1)
    expect(calls[0][0]).toStrictEqual({
      name: 'Hello',
      subs: [
        {
          amount: 42
        }
      ],
      sub: {
        amount: 666
      }
    })
  })
})
