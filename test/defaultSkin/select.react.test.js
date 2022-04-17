import 'jsdom-global/register'
import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from '../utils/enzymeConfig'
import {
  createSchema,
  Autoform,
} from '../../src/index'

const custom = createSchema('selector', {
  select: {
    type: 'select',
    options: ['op1', 'op2']
  }
})

test('Allows select', () => {
  const app = mount(
    <Autoform schema={custom} />
  )

  const label = app.find('label')
  expect(label).toHaveLength(1)
  expect(label.contains('models.selector.select._field')).toBe(true)

  const op1 = app.find('option[value="op1"]')
  expect(op1.contains('models.selector.select.op1')).toBe(true)

  const ops = app.find('option')
  expect(ops).toHaveLength(3)
})

