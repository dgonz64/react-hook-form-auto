import React from 'react'
import { mount } from 'enzyme'
import config from './utils/enzymeConfig'

import {
  createSchema,
  Autoform,
  setLanguageByName
} from '../src/index'

const pet = createSchema('pet', {
  name: {
    type: String,
    error: {
      maxLength: 4
    }
  }
})

const owner = createSchema('owner', {
  pet: {
    type: pet,
  },
  pets: {
    type: [pet]
  },
  carSize: {
    type: 'select',
    options: ['single', 'normal', 'bus driver']
  },
  gender: {
    type: 'radios',
    options: ['male', 'female', 'both']
  },
  goodBoy: {
    type: 'boolean'
  }
})

test('basic tests in input', () => {
  const initially = {
    pet: {
      name: 'Print Screen'
    },
    pets: [{
      name: 'Bobo'
    }]
  }

  const app = mount(
    <Autoform schema={owner} initialValues={initially} />
  )

  // Some random lazy-fuck tests
  const form = app.find('form')
  const labels = form.find('label')
  const inputs = form.find('input')
  const petName = form.find('input[name="pet.name"]')

  expect(form).toHaveLength(1)
  expect(labels).toHaveLength(8)
  expect(inputs).toHaveLength(6)

  const label = labels.at(1)
  expect(label.contains('models.pet.name._field')).toBe(true)
  expect(petName.prop('name')).toBe('pet.name')
  expect(petName.prop('defaultValue')).toBe('Print Screen')

  const pet0Name = form.find('input[name="pets.0.name"]')
  expect(pet0Name).toHaveLength(1)

  const carSizes = form.find('select[name="carSize"] option')
  expect(carSizes).toHaveLength(4)

  const genders = form.find('input[name="gender"]')
  expect(genders).toHaveLength(3)

  const gender = genders.first()
  expect(gender.prop('type')).toBe('radio')

  const good = form.find('input[name="goodBoy"]')
  expect(good).toHaveLength(1)
  expect(good.prop('type')).toBe('checkbox')
})
