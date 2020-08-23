import React, { useRef, useImperativeHandle, forwardRef } from 'react'
import { objectTraverse, isObject, deepmerge } from '../utils'
import { useForm } from 'react-hook-form'
import { getComponents, renderInputs } from './componentRender'
import { createCoercers } from '../coercing'

import baseSkin from './baseSkin'

/**
 * Creates a form using the provided skin. The form
 * has all the needed fields, styles and validation
 * errors in order to work.
 */
export let AutoformBase = (props, ref) => {
  const {
    schema,
    elementProps,
    initialValues = {},
    children,
    onSubmit,
    onErrors,
    styles,
    submitButton,
    submitButtonText,
    skin,
    skinOverride,
    skipManualReset,
    ...rest
  } = props

  if (!schema) {
    throw new Error('<Autoform /> was rendered without schema.')
  }

  const coerceRef = useRef({})

  const initial = initialValues && isObject(initialValues) ?
    initialValues : {}

  const formHook = useForm({
    defaultValues: initial
  })
  const {
    formState,
    register,
    unregister,
    handleSubmit,
    errors,
    watch,
    reset,
    getValues
  } = formHook

  const finalSkin = { ...baseSkin, ...skin, ...skinOverride }

  const setValue = (name, value, options, skipSetInput) => {
    const [ container, attr ] = objectTraverse(coerceRef.current, name, {
      createIfMissing: true
    })
    if (container && attr)
      container[attr] = value

    if (!skipSetInput)
      formHook.setValue(name, value, options)
  }

  if (onErrors && Object.keys(errors).length > 0)
    onErrors(errors)

  const coercedSubmit = createCoercers({
    initialValues: initial,
    coerceRef,
    skin: finalSkin,
    onSubmit,
    schema
  })

  const resetAlsoCoercers = (values, omit) => {
    coerceRef.current = {}
    deepmerge(coerceRef.current, values || {})

    const currentValues = getValues()

    if (!skipManualReset) {
      // Reset by setting everything to initialValues or null.
      function resetValues(obj, initials = {}, path = '', isArray = false) {
        const fields = Object.keys(obj)
        fields.forEach((field, idx) => {
          const value = obj[field]
          const elPath = isArray ?
            `${path}[${idx}]` : (path ? `${path}.${field}` : field)
          const initial = initials[field]
          if (typeof value == 'object')
            resetValues(value, initial, elPath, Array.isArray(value))
          else {
            const initialOrNull = typeof initial == 'undefined' ? null : initial
            formHook.setValue(elPath, initialOrNull)
          }
        })
      }

      resetValues(currentValues, initialValues)
    }

    reset(values, omit)
  }

  const submit = handleSubmit(coercedSubmit)

  useImperativeHandle(ref, () => ({
    submit,
    formHook: () => formHook,
    setValue,
    reset: resetAlsoCoercers
  }))

  const inputProps = {
    ...rest,
    ...elementProps,
    reset,
    setValue,
    children,
    initialValues: initial,
    schema,
    register,
    unregister,
    styles,
    errors,
    coerceRef,
    skin: finalSkin,
    formHook,
    autoformProps: props
  }

  const Button = finalSkin.button.render
  const Form = finalSkin.form.render

  return (
    <Form onSubmit={submit}>
      {renderInputs(inputProps)}
      {
        submitButton &&
          <Button
            styles={styles}
            onClick={submit}
            type="submit"
          >
            {submitButtonText}
          </Button>
      }
      {children}
    </Form>
  )
}

AutoformBase = forwardRef(AutoformBase)
