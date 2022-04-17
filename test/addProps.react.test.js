import 'jsdom-global/register'
import React from 'react'
import { mount } from 'enzyme'

import config from './utils/enzymeConfig'
import { createSchema } from '../src/index'

import { Autoform } from './utils/buttonHack'
import { InputWrap } from '../src/ui/components/InputWrap'

const pass = createSchema('passStuff', {
  addProps: {
    type: 'string',
    addWrapperProps: { thing: 'wrap' },
    addInputProps: { thing: 'input' }
  }
})

test('Be able to pass props to wrapper and input', () => {
  const app = mount(
    <Autoform schema={pass} />
  )

  // console.log(app.debug())

  const wrap = app.find('div[thing="wrap"]')
  expect(wrap.prop('thing')).toBe('wrap')

  const input = app.find('input[name="addProps"]')
  expect(input.prop('thing')).toBe('input')
})
