import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import config from './utils/enzymeConfig'
import { changeInput } from './utils/changeField'

import { Autoform } from './utils/buttonHack'
import { createParenter } from './utils/createParenter'

const parent = createParenter({
  arrayAdd: {
    minChildren: 1,
    maxChildren: 2
  }
})

const findNameInput = (app, idx) =>
  app.find(`input[name="childs.${idx}.name"]`)

test('Allows to add in an arrayPanel', async () => {
  const app = mount(
    <Autoform schema={parent} />
  )

  const button = app.find('button').first()
  await act(async () => {
    await button.simulate('click')
  })

  const first = findNameInput(app, 0)
  changeInput(first, '111')

  const second = findNameInput(app, 1)
  changeInput(second, '222')

  const buttons = app.find('button')
  expect(buttons).toHaveLength(3)
  await act(async () => {
    await buttons.at(1).simulate('click')
  })

  const firstNew = findNameInput(app, 0)
  expect(firstNew).toHaveLength(1)

  const secondNew = findNameInput(app, 1)
  expect(secondNew).toHaveLength(1)
  expect(secondNew.instance().value).toBe('222')

  const appText = app.text()
  expect(appText).not.toMatch('error.minChildren')
  expect(appText).not.toMatch('error.maxChildren')
})

test('Complains when lacks children', async () => {
  const app = mount(
    <Autoform schema={parent} />
  )

  const buttons = app.find('button')
  expect(buttons).toHaveLength(2)
  await buttons.at(1).simulate('click')

  expect(app.text()).toMatch('error.minChildren')
})

test('Complains when has too many children and then calms down', async () => {
  const app = mount(
    <Autoform schema={parent} />
  )

  const button = app.find('button').first()
  await button.simulate('click')
  await button.simulate('click')

  expect(app.text()).toMatch('error.maxChildren')

  const buttons = app.find('button')
  expect(buttons).toHaveLength(4)
  await buttons.at(1).simulate('click')

  expect(app.text()).not.toMatch('error.maxChildren')
  expect(app.text()).not.toMatch('error.minChildren')
})
