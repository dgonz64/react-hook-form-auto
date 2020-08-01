import React from 'react'
import { mount } from 'enzyme'

import config from './utils/enzymeConfig'
import { createSchema } from '../src/index'

import { Autoform } from './utils/buttonHack'

const defaulter = createSchema('defaulter', {
  name: {
    type: 'string',
    defaultValue: 'tomato'
  }
})

const uniparenter = createSchema('parenter', {
  defaulter: {
    type: defaulter
  }
})

const multiparenter = createSchema('multiparenter', {
  defaulter: {
    type: [defaulter]
  }
})

test('fields can have default values', () => {
  const app = mount(
    <Autoform schema={defaulter} />
  )

  const form = app.find('form')
  const inputs = form.find('input')

  expect(inputs).toHaveLength(1)
  const input = inputs.first()
  expect(input.prop('defaultValue')).toBe('tomato')
})

test('embedded object can have default values', () => {
  const app = mount(
    <Autoform schema={uniparenter} />
  )

  const form = app.find('form')
  const inputs = form.find('input')

  expect(inputs).toHaveLength(1)
  const input = inputs.first()
  expect(input.prop('defaultValue')).toBe('tomato')
})

test('array objects can have default values', () => {
  const app = mount(
    <Autoform schema={multiparenter} />,
  )

  const form = app.find('form')
  const inputs = form.find('input')

  expect(inputs).toHaveLength(1)
  const input = inputs.first()
  expect(input.prop('defaultValue')).toBe('tomato')
})
