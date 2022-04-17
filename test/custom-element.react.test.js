import 'jsdom-global/register'
import React, { forwardRef } from 'react'
import { mount } from 'enzyme'

import config from './utils/enzymeConfig'
import {
  createSchema,
  Autoform,
  setLanguageByName
} from '../src/index'

let MyInput = (props, ref) =>
  <div className="fancy-class" />

MyInput = forwardRef(MyInput)

const skinOverride = {
  thingy: {
    render: {
      component: MyInput
    }
  }
}

const custom = createSchema('custom', {
  name: {
    type: 'thingy',
  }
})

test('custom type with UI', () => {
  const app = mount(
    <Autoform schema={custom} skinOverride={skinOverride} />
  )

  const form = app.find('form')
  const inputs = form.find('.fancy-class')

  expect(inputs).toHaveLength(1)
})
