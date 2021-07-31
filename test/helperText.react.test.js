import React from 'react'
import { mount } from 'enzyme'
import config from './utils/enzymeConfig'
import { act } from 'react-dom/test-utils'

import {
  createSchema,
  Autoform,
  addTranslations
} from '../src/index'
import {
  changeInput,
} from './utils/changeField'

addTranslations({
  models: {
    helping: {
      name: {
        _helper: 'Translated helper'
      }
    }
  }
})

const notHelped = createSchema('helping', {
  name: {
    type: 'string',
  }
})

const helped = createSchema('helping', {
  name: {
    type: 'string',
    helperText: 'Schema helper',
    onChange: (value, { name, setHelperText }) => {
      if (value == 'help')
        setHelperText(name, 'Forced by onChange')
    }
  }
})

test('Uses automatically translated helper', async () => {
  const app = mount(
    <Autoform schema={notHelped} />
  )

  expect(app.text()).toMatch('Translated helper')
})

test('setHelperText over helperText over _helper', async () => {
  const app = mount(
    <Autoform schema={helped} />
  )

  expect(app.text()).toMatch('Schema helper')

  const name = app.find('input[name="name"]')

  await changeInput(name, 'help')
  await app.update()

  expect(app.text()).toMatch('Forced by onChange')
})
