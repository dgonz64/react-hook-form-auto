import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import {
  objectTraverse,
  isObject,
  deepmerge,
  getSkinComponent
} from '../utils'
import { useForm } from 'react-hook-form'
import { getComponents, renderInputs } from './componentRender'
import { useAutoformState } from '../autoform_state'

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

  const formHook = useForm({
    mode: 'all',
    defaultValues: initialValues
  })
  const {
    control,
    formState,
    register,
    unregister,
    handleSubmit,
    reset
  } = formHook

  const finalSkin = { ...baseSkin, ...skin, ...skinOverride }

  const {
    coercedSubmit,
    coercedChange,
    setValue,
    setVisible,
    setHelperText,
    resetState,
    stateControl,
    getValues
  } = useAutoformState({
    initialValues,
    onSubmit,
    onChange: props.onChange,
    schema,
    skin: finalSkin,
    formHook,
    skipManualReset
  })

  const submit = handleSubmit(coercedSubmit, onErrors)

  useImperativeHandle(ref, () => ({
    submit,
    formHook: () => formHook,
    setValue,
    setVisible,
    getValues,
    reset: resetState
  }))

  const inputProps = {
    ...rest,
    ...elementProps,
    reset,
    children,
    initialValues,
    schema,
    register,
    unregister,
    styles,
    skin: finalSkin,
    formHook,
    autoformProps: props,
    stateControl,
    setValue,
    setVisible,
    setHelperText,
    onChange: coercedChange
  }

  const Button = getSkinComponent(finalSkin.button)
  const Form = getSkinComponent(finalSkin.form)

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
