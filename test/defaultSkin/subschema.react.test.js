import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from '../utils/enzymeConfig'
import {
  createSchema,
  Autoform,
  Button
} from '../../src/index'

const pet = createSchema('pet', {
  name: { type: 'string' }
})

const custom = createSchema('owner', {
  fav: { type: pet }
})

test('Allows submodels', () => {
  const app = mount(
    <Autoform schema={custom} />
  )

  const input = app.find('input[name="fav.name"]')
  expect(input).toHaveLength(1)

  const label = app.find('label[htmlFor="fav.name"]')
  expect(label.contains('models.pet.name._field')).toBe(true)
})

