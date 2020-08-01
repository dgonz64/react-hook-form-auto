import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from '../utils/enzymeConfig'
import {
  createSchema,
  Autoform,
} from '../../src/index'

const custom = createSchema('radiator', {
  radios: {
    type: 'radios',
    options: ['op1', 'op2']
  }
})

test('Allows radios', () => {
  const app = mount(
    <Autoform schema={custom} />
  )

  const labels = app.find('label')
  expect(labels).toHaveLength(3)
  const firstLabel = labels.first()
  expect(firstLabel.contains('models.radiator.radios._field')).toBe(true)

  const op1 = app.find('#radios-op1')
  expect(op1.prop('type')).toBe('radio')
  expect(op1.prop('value')).toBe('op1')

  const ops = app.find('input[type="radio"]')
  expect(ops).toHaveLength(2)
})

