import 'jsdom-global/register'
import React from 'react'
import { mount } from 'enzyme'
import config from './utils/enzymeConfig'

import {
  createSchema,
  Autoform
} from '../src/index'

const erroring = createSchema('erroring', {
  username: { type: 'string' },
  password: { type: 'password' }
})

const nested = createSchema('nested', {
  errors: {
    type: [erroring]
  }
})

test('Allows you to specify arbitrary errors', async () => {
  const errors = {
    username: {
      message: 'bad username'
    },
    password: {
      message: 'bad password'
    }
  }

  const app = mount(
    <Autoform schema={erroring} forceErrors={errors} />
  )

  expect(app.text()).toMatch(errors.username.message)
  expect(app.text()).toMatch(errors.password.message)
})

test('Allows you to specify arbitrary errors in nested fields', async () => {
  const badText = 'bad nested username'
  const errors = {
    'errors.0.username': {
      message: badText
    }
  }

  const app = mount(
    <Autoform schema={nested} forceErrors={errors} />
  )

  expect(app.text()).toMatch(badText)
})
