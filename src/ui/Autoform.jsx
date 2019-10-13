import React, { useRef, useImperativeHandle, forwardRef } from 'react'
import { objectTraverse, isObject } from '../utils'
import useForm from 'react-hook-form'
import { getComponents, renderInputs } from './componentRender'
import { Button } from './components/Button'
import defaultSkin from './defaultSkin'
import { createCoercers } from '../coercing'

/**
 * Creates a form using the current skin. The form
 * has all the needed fields, styles and validation
 * errors in order to work.
 */
export let Autoform = ({
  schema,
  elementProps,
  initialValues,
  children,
  onSubmit,
  onErrors,
  styles,
  submitButton,
  submitButtonText,
  skin = defaultSkin,
  skinOverride,
  ...rest
}, ref) => {
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
    reset
  } = formHook

  const finalSkin = { ...skin, ...skinOverride }

  const setValue = (name, value, validate, skipSetInput) => {
    const [ container, attr ] = objectTraverse(coerceRef.current, name, {
      createIfMissing: true
    })
    if (container && attr)
      container[attr] = value

    if (!skipSetInput)
      formHook.setValue(name, value, validate)
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

  const submit = handleSubmit(coercedSubmit)

  useImperativeHandle(ref, () => ({
    submit,
    formHook: () => formHook
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
    skin: finalSkin
  }

  return (
    <form onSubmit={submit}>
      {renderInputs(inputProps)}
      {
        submitButton &&
          <Button
            styles={styles}
            text={submitButtonText}
            type="submit"
          />
      }
      {children}
    </form>
  )
}

Autoform = forwardRef(Autoform)
