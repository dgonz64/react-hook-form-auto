import 'jsdom-global/register'
import React from 'react'
import { mount } from 'enzyme'
import config from './utils/enzymeConfig'

import {
  createSchema,
  Autoform
} from '../src/index'

test('allows option as object with keys', () => {
  const colors = createSchema('colors', {
    color: {
      type: 'select',
      options: [
        { value: 'r', key: 'red' },
        { value: 'g', key: 'green' }
      ]
    }
  })

  const app = mount(
    <Autoform schema={colors} />
  )

  const defOption = app.find('option[value=""]')
  expect(defOption).toHaveLength(1)
  expect(defOption.contains('models.colors.color._default')).toBe(true)

  const red = app.find('option[value="r"]')
  expect(red).toHaveLength(1)
  expect(red.contains('models.colors.color.red')).toBe(true)

  const green = app.find('option[value="g"]')
  expect(green).toHaveLength(1)
  expect(green.contains('models.colors.color.green')).toBe(true)
})

test('allows option function that produces object with labels', () => {
  const colors = createSchema('colors', {
    color: {
      type: 'select',
      options: () => [
        { value: 'r', label: 'My red' },
        { value: 'g', label: 'Some green' }
      ]
    }
  })

  const app = mount(
    <Autoform schema={colors} />
  )

  const defOption = app.find('option[value=""]')
  expect(defOption).toHaveLength(1)
  expect(defOption.contains('models.colors.color._default')).toBe(true)

  const red = app.find('option[value="r"]')
  expect(red).toHaveLength(1)
  expect(red.contains('My red')).toBe(true)

  const green = app.find('option[value="g"]')
  expect(green).toHaveLength(1)
  expect(green.contains('Some green')).toBe(true)
})
