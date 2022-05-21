import 'jsdom-global/register'
import { useRef } from 'react'
import { mount } from 'enzyme'
import config from './utils/enzymeConfig'
import { changeInput } from './utils/changeField'
import { act } from 'react-dom/test-utils'

import {
  createSchema,
  Autoform
} from '../src/index'

const some = createSchema('some', {
  name: { type: 'string' },
})

let ref

const TestAutoform = () => {
  ref = useRef()

  return (
    <Autoform
      schema={some}
      ref={ref}
    />
  )
}

test('Returns entered values at any time', async () => {
  const app = mount(
    <TestAutoform />
  )

  const input = app.find('input[name="name"]')
  changeInput(input, 'Yo')

  const doc = ref.current.getValues()
  expect(doc).toStrictEqual({ name: 'Yo' })
})

test('Changes values externally', async () => {
  const app = mount(
    <TestAutoform />
  )

  ref.current.setValue('name', 'Ey')

  const doc = ref.current.getValues()
  expect(doc).toStrictEqual({ name: 'Ey' })
})

test('Resets the form', async () => {
  const app = mount(
    <TestAutoform />
  )

  const input = app.find('input[name="name"]')
  changeInput(input, 'Delete this')

  act(() => {
    ref.current.reset()
  })

  const doc = ref.current.getValues()
  expect(doc).toStrictEqual({ name: '' })
})

test('Sets visibility', async () => {
  const app = mount(
    <TestAutoform />
  )

  const input = app.find('input[name="name"]')
  changeInput(input, 'Invisible')

  act(() => {
    ref.current.setVisible('name', false)
  })
  const doc = ref.current.getValues()
  expect(doc).toStrictEqual({})
})
