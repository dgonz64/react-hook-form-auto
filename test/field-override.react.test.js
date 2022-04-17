import 'jsdom-global/register'
import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import config from './utils/enzymeConfig'
import {
  createSchema,
  Autoform,
  InputWrap,
  FieldPropsOverride
} from '../src/index'
import { changeInput } from './utils/changeField'

const custom = createSchema('custom', {
  name: {
    type: 'string',
  }
})

test('Is able to override specific field props', () => {
  const app = mount(
    <Autoform schema={custom}>
      <FieldPropsOverride
        name="name"
        type="custom-type"
      />
    </Autoform>
  )

  const form = app.find('form')
  const inputs = form.find('input')

  expect(inputs).toHaveLength(1)
  const input = inputs.first()
  expect(input.prop('type')).toBe('custom-type')
})

test('Is able to override onChange while allowing changes', async () => {
  const handleChange = jest.fn()

  const app = mount(
    <Autoform schema={custom}>
      <FieldPropsOverride
        name="name"
        onChange={handleChange}
      />
    </Autoform>
  )

  const name = app.find('input[name="name"]')

  expect(name).toHaveLength(1)

  await changeInput(name, 'Nerea')
  
  const { calls } = handleChange.mock
  const context = calls[0][1]

  expect(context.name).toBe('name')
  expect('setVisible' in context).toBe(true)
  expect('setHelperText' in context).toBe(true)
  expect('formHook' in context).toBe(true)
  expect('setValue' in context).toBe(true)
  expect(context.arrayControl).toBe(undefined)

  expect(name.instance().value).toBe('Nerea')
})

const parent = createSchema('parent', {
  child: {
    type: [custom]
  }
})


test('Is able to reference child elements', () => {
  const app = mount(
    <Autoform schema={parent}>
      <FieldPropsOverride
        name="child[0].name"
        type="custom-type"
      />
    </Autoform>
  )

  const form = app.find('form')
  const inputs = form.find('input')

  expect(inputs).toHaveLength(1)
  const input = inputs.first()
  expect(input.prop('type')).toBe('custom-type')
})
