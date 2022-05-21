import 'jsdom-global/register'
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

const ControlledString = ({
  name,
  onChange,
  onBlur,
  value
}) => {
  return (
    <input
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
    />
  )
}

const skin = {
  string: {
    controlled: true,
    component: ControlledString
  }
}

test('Sets initial values on controlled components', () => {
  const app = mount(
    <Autoform
      schema={parent}
      initialValues={initial}
      skinOverride={skin}
    />
  )

  const values = app.find(ControlledString)
  expect(app.find(ControlledString)).toHaveLength(4)

  const child1Name = app.find('input[name="childs.0.name"]')
  expect(child1Name.prop('value')).toBe('One')

  const child2Name = app.find('input[name="childs.1.name"]')
  expect(child2Name.prop('value')).toBe('Two')

  const aloneName = app.find('input[name="child.name"]')
  expect(aloneName.prop('value')).toBe('Uniquer')
})
