import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from '../enzymeConfig'
import {
  createSchema,
  Autoform,
} from '../../src/index'

const custom = createSchema('ranger', {
  range: {
    type: 'range'
  }
})

test('Allows number fields', () => {
  const app = mount(
    <Autoform schema={custom} />
  )

  const input = app.find('input[name="range"]')
  expect(input.prop('type')).toBe('range')
})

