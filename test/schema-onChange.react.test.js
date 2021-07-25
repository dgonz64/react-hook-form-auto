import React from 'react'
import { mount } from 'enzyme'
import config from './utils/enzymeConfig'
import { act } from 'react-dom/test-utils'

import {
  createSchema,
  Autoform,
  setLanguageByName
} from '../src/index'
import {
  changeInput,
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

test('Hides according to initiallyVisible', async () => {
  const app = mount(
    <Autoform schema={owner} />
  )

  const usesHat = app.find('input[name="name"]')
  expect(usesHat).toHaveLength(1)

  const color = app.find('input[name="hatColor"]')
  expect(color).toHaveLength(0)

  // await act(async () => {
  //   await changeInput(usesHat, true)
  // })

  // const nowColor = app.find('input[name="hatColor"]')
  // expect(nowColor).toHaveLength(1)
})

// test('Hides things according to schema\'s initiallyVisible', () => {
//   const app = mount(
//     <Autoform schema={owner} />
//   )

//   const name = app.find('input[name="name"]')
//   expect(name).toHaveLength(1)

//   const color = app.find('input[name="hatColor"]')
//   expect(color).toHaveLength(0)

//   const pet0Heads = app.find('input[name="pets.0.heads"]')
//   expect(pet0Heads).toHaveLength(1)
// })
