import React from 'react'
import { mount } from 'enzyme'

import config from './utils/enzymeConfig'
import { createSchema } from '../src/index'

import { Autoform } from './utils/buttonHack'
import { createParenter } from './utils/createParenter'

const parent = createParenter()

const initial = {
  name: 'Father',
  childs: [
    {
      name: 'One'
    },
    {
      name: 'Two'
    }
  ],
  child: {
    name: 'Uniquer'
  },
  boolean: true
}

test('Sets initial values', () => {
  const app = mount(
    <Autoform schema={parent} initialValues={initial} />
  )

  const fatherName = app.find('input[name="name"]')
  expect(fatherName.prop('defaultValue')).toBe('Father')

  const numChildren = app.find('.button')
  expect(numChildren).toHaveLength(3)

  const child1Name = app.find('input[name="childs.0.name"]')
  expect(child1Name.prop('defaultValue')).toBe('One')

  const child2Name = app.find('input[name="childs.1.name"]')
  expect(child2Name.prop('defaultValue')).toBe('Two')

  const aloneName = app.find('input[name="child.name"]')
  expect(aloneName.prop('defaultValue')).toBe('Uniquer')
})

test('Radios have initial values', () => {
  const schema = createSchema('schema', {
    ops: {
      type: 'radios',
      options: ['aaa', 'bbb']
    }
  })

  const radioInitial = {
    ops: 'bbb'
  }

  const app = mount(
    <Autoform schema={schema} initialValues={radioInitial} />
  )

  const input = app.find('#schema-ops-bbb')
  expect(input.prop('defaultChecked')).toBe(true)
})

test('Checkbox initial values', () => {
  const schema = createSchema('schema', {
    boolean: {
      type: 'boolean'
    }
  })

  const booleanInitial = {
    boolean: true
  }

  const app = mount(
    <Autoform schema={schema} initialValues={booleanInitial} />
  )

  const input = app.find('input[name="boolean"]')
  expect(input.prop('defaultChecked')).toBe(true)
})
