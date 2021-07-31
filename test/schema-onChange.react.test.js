import React from 'react'
import { mount } from 'enzyme'
import config from './utils/enzymeConfig'
import { act } from 'react-dom/test-utils'

import {
  createSchema,
  Autoform,
  setLanguageByName,
  Button
} from '../src/index'
import {
  changeInput,
  changeSelect,
  changeCheckbox
} from './utils/changeField'

const pet = createSchema('pet', {
  name: {
    type: String,
    required: true,
    maxLength: 8
  },
  heads: {
    type: Number,
    onChange: (value, { arrayControl }) => {
      if (value == '42')
        arrayControl.add()
      if (value == '13')
        arrayControl.remove(arrayControl.index)
    },
    helperText: 'Enter 42 to add and 13 to remove'
  },
  hair: {
    type: 'select',
    options: ['blue', 'yellow'],
    onChange: (value, { name, setHelperText }) => {
      debugger
      setHelperText(name, `Better not choose ${value}`)
    }
  },
})

const owner = createSchema('owner', {
  name: {
    type: 'string',
    required: true,
  },
  height: {
    type: 'radios',
    options: ['tall', 'short'],
    onChange: (value, { setValue }) => {
      if (value == 'tall')
        setValue('name', 'André the Giant')
    }
  },
  usesHat: {
    type: 'boolean',
    onChange: (value, { setVisible }) => {
      setVisible('hatColor', value)
    }
  },
  hatColor: {
    type: 'select',
    options: ['black', 'red'],
    initiallyVisible: false
  },
  pets: {
    type: [pet],
    minChildren: 1,
    maxChildren: 2
  }
})

function timedPromise(time = 100) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

test('onChange: hide according to initiallyVisible and change visibility', async () => {
  const app = mount(
    <Autoform schema={owner} />
  )

  const usesHat = app.find('input[name="usesHat"]')
  expect(usesHat).toHaveLength(1)

  const color = app.find('select[name="hatColor"]')
  expect(color).toHaveLength(0)

  await changeCheckbox(usesHat, true)
  await app.update()

  const nowColor = app.find('select[name="hatColor"]')
  expect(nowColor).toHaveLength(1)
})

test('onChange: Change arbitrary input value', async () => {
  const app = mount(
    <Autoform schema={owner} />
  )

  const name = app.find('input[name="name"]')
  expect(name).toHaveLength(1)

  const height = app.find('input[name="height"][value="tall"]')
  expect(height).toHaveLength(1)

  await changeInput(height, 'tall')
  await app.update()

  expect(name.instance().value).toBe('André the Giant')
})

test('onChange: Add and remove array elements', async () => {
  const app = mount(
    <Autoform schema={owner} />
  )

  const name = app.find('input[name="pets.0.heads"]')
  expect(name).toHaveLength(1)

  const buttons = app.find(Button)
  expect(buttons).toHaveLength(2)

  await changeInput(name, '42')
  await app.update()

  const addedButtons = app.find(Button)
  expect(addedButtons).toHaveLength(3)

  await changeInput(name, '13')
  await app.update()

  const removedButtons = app.find(Button)
  expect(removedButtons).toHaveLength(2)
})

test('onChange: Change helper text', async () => {
  const app = mount(
    <Autoform schema={owner} />
  )

  const hair = app.find('select[name="pets.0.hair"]')
  expect(hair).toHaveLength(1)

  await changeSelect(hair, 'blue')
  await app.update()

  expect(app.text()).toMatch('Better not choose blue')
})
