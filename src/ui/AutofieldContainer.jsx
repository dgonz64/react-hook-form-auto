import React from 'react'
import { useController } from 'react-hook-form'
import { Autofield } from './Autofield'
import {
  objectTraverse,
  valueFromEvent
} from '../utils'
import { useAutofieldState } from '../autoform_state'

export const AutofieldContainer = (props) => {
  const {
    id,
    name,
    fieldSchema,
    defaultValue,
    schemaTypeName,
    skinElement,
    formHook: { control },
    formHook,
    register,
    rules,
    overrides,
    skin,
    stateControl,
    setVisible,
    setHelperText,
    setValue,
    arrayControl
  } = props

  const {
    visible,
    helperText
  } = useAutofieldState({ name, stateControl })

  let baseProps = Object.assign({}, props, { helperText })

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
      baseProps.inputRef = registerProps.ref
    }
  }

  // Allow field schema onChange
  if ('onChange' in fieldSchema) {
    const { onChange } = baseProps

    const onChangeArguments = {
      name,
      setVisible,
      setHelperText,
      formHook,
      setValue,
      arrayControl
    }

    baseProps.onChange = (event) => {
      const value = valueFromEvent(event)
      onChange(event)

      fieldSchema.onChange(value, onChangeArguments)
    }

    baseProps.setValue = (name, value) => {
      setValue(name, value)

      fieldSchema.onChange(value, onChangeArguments)
    }
  }

  const { render } = skinElement
  
  let transformedProps
  if (typeof render == 'function')
    transformedProps = render ? render(baseProps) : baseProps
  else
    transformedProps = { ...baseProps, ...render }
  transformedProps = { ...transformedProps, ...overrides }

  if (visible && transformedProps.component) {
    return (
      <Autofield
        {...transformedProps}
      />
    )
  } else {
    return null
  }
}
