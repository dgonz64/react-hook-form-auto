import React from 'react'
import { mount } from 'enzyme'

import config from './utils/enzymeConfig'

import { Autoform } from './utils/buttonHack'
import { createParenter } from './utils/createParenter'

const parent = createParenter()

test('Allows to add in an arrayPanel', () => {
  const app = mount(
    <Autoform schema={parent} />
  )

  const findInput = (app, idx) =>
    app.find(`input[name="childs[${idx}].name"]`)

  const button = app.find('button').first()
  button.simulate('click')

  const first = findInput(app, 0)
  first.instance().value = '111'

  const second = findInput(app, 1)
  second.instance().value = '222'

  const buttons = app.find('button')
  expect(buttons).toHaveLength(3)
  buttons.at(1).simulate('click')

  const firstNew = findInput(app, 0)
  expect(firstNew).toHaveLength(0)

  const secondNew = findInput(app, 1)
  expect(secondNew).toHaveLength(1)
  expect(secondNew.instance().value).toBe('222')
})
