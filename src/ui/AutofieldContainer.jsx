import React from 'react'
import { useController } from 'react-hook-form'
import { Autofield } from './Autofield'

export const AutofieldContainer = (props) => {
  const {
    id,
    name,
    fieldSchema,
    defaultValue,
    schemaTypeName,
    skinElement,
    formHook: { control },
    register,
    rules,
    overrides,
    skin
  } = props

  let baseProps = Object.assign({}, props)

  const { controlled } = skinElement

  if (controlled) {
    const { field } = useController({
      name, 
      control: control,
      rules
    })

    baseProps.onChange = field.onChange
    baseProps.onBlur = field.onBlur
    baseProps.value = field.value
  } else {
    if (!skinElement.skipRegister) {
      const registerProps = register(name, rules)
      baseProps.onBlur = registerProps.onBlur
      baseProps.onChange = registerProps.onChange
    }
  }

  const { render } = skinElement
  
  let transformedProps
  if (typeof render == 'function')
    transformedProps = render ? render(baseProps) : baseProps
  else
    transformedProps = { ...baseProps, ...render }
  transformedProps = { ...transformedProps, ...overrides }

  if (transformedProps.component) {
    return (
      <Autofield
        {...transformedProps}
      />
    )
  } else {
    return null
  }
}
