import 'jsdom-global/register'
import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from '../utils/enzymeConfig'
import {
  createSchema,
  Autoform,
} from '../../src/index'

const custom = createSchema('passworder', {
  pass: {
    type: 'password'
  }
})

test('Allows password fields', () => {
  const app = mount(
    <Autoform schema={custom} />
  )

  const input = app.find('input[name="pass"]')
  expect(input.prop('type')).toBe('password')
})

