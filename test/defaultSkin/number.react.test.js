import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from '../utils/enzymeConfig'
import {
  createSchema,
  Autoform,
} from '../../src/index'

const custom = createSchema('numberer', {
  num: {
    type: 'number'
  }
})

test('Allows number fields', () => {
  const app = mount(
    <Autoform schema={custom} />
  )

  const input = app.find('input[name="num"]')
  expect(input.prop('type')).toBe('number')
})

