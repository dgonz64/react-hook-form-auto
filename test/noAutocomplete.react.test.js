import 'jsdom-global/register'
import React from 'react'
import { mount } from 'enzyme'

import config from './utils/enzymeConfig'
import { createSchema } from '../src/index'

import { Autoform } from './utils/buttonHack'

const noAutocompleter = createSchema('noAutocompleter', {
  allows: {
    type: 'string'
  },
  doesntAllow: {
    type: 'string',
    noAutocomplete: true
  }
})

const checkNoAutocomplete = (app, name, expected) => {
  const input = app.find(`input[name="${name}"]`)
  if (expected)
    expect(input.prop('autoComplete')).toBe('off')
  else
    expect(input.prop('autoComplete')).toBeUndefined()
}

test('Everything has autocomplete="off" if set in Autoform', () => {
  const app = mount(
    <Autoform schema={noAutocompleter} noAutocomplete />
  )

  // console.log('general', app.debug())

  checkNoAutocomplete(app, 'allows', true)
  checkNoAutocomplete(app, 'doesntAllow', true)
})

test('Specific inputs have autocomplete="off"', () => {
  const app = mount(
    <Autoform schema={noAutocompleter} />
  )

  // console.log('specific', app.debug())

  checkNoAutocomplete(app, 'allows', false)
  checkNoAutocomplete(app, 'doesntAllow', true)
})
