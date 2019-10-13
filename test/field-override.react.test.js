import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import config from './enzymeConfig'
import {
  createSchema,
  Autoform,
  InputWrap,
  FieldPropsOverride
} from '../src/index'

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
