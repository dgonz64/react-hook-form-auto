import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from '../enzymeConfig'
import {
  createSchema,
  Autoform,
  Button
} from '../../src/index'

const subpet = createSchema('subpet', {
  name: { type: 'string' }
})

const pet = createSchema('pet', {
  name: { type: 'string' },
  subpet: { type: subpet }
})

const custom = createSchema('stacker', {
  array: { type: [pet] }
})

test('Allows field arrays', () => {
  const app = mount(
    <Autoform schema={custom} />
  )

  // console.log('-', app.html())

  const buttons = app.find(Button)
  expect(buttons).toHaveLength(2)

  const submodel = app.find('input[name="array[0].subpet.name"]')
  expect(submodel).toHaveLength(1)

  const add = buttons.first()
  add.simulate('click')

  const someFields = app.find('input[name="array[1].name"]')
  expect(someFields).toHaveLength(1)

  // console.log('+', app.html())

  const moreButtons = app.find(Button)
  expect(moreButtons).toHaveLength(3)
})

