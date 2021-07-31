import React from 'react'
import { useFormState } from 'react-hook-form'
import { objectTraverse } from '../utils'
import { tr, stringExists } from '../translate'
import { trPath } from '../translation_utils'
import classnames from 'classnames'

export const Autofield = (props) => {
  const {
    id,
    name,
    wrapper = props.skin.defaultWrap,
    component,
    field,
    formHook: { control },
    formHook,
    defaultValue,
    fieldSchema,
    helperText,
    inputRef,
    type,
    option,
    inline,
    styles,
    skinElement,
    noRef,
    noAutocomplete,
    onChange,
    onBlur,
    ...rest
  } = props

  const nameForErrors = skinElement.nameForErrors ?
    skinElement.nameForErrors(name) : name

  const { errors } = useFormState({ control, name: nameForErrors })
  const fieldErrors = objectTraverse(errors, nameForErrors, {
    returnValue: true
  })
  const errorText = fieldErrors && fieldErrors.message

  const actualKey = option ? `${name}.${option}` : name
  const $wrapper = wrapper
  const $component = component
  const isComponent = typeof component != 'string'
  let componentBaseProps = {
    id,
    key: actualKey,
    name,
    type,
    defaultValue,
    onChange,
    onBlur,
    className: classnames(styles.input, styles.standard, {
      [styles.errored]: fieldErrors
    }),
    ...fieldSchema.addInputProps
  }

  if (option)
    componentBaseProps.value = option
  
  let finalHelperText = helperText || fieldSchema.helperText
  if (!finalHelperText) {
    const helperId = trPath(props.schemaTypeName, field, '_helper')
    if (stringExists(helperId))
      finalHelperText = tr(helperId)
  }

  let componentProps
  if (isComponent) {
    componentProps = {
      ...rest,
      ...componentBaseProps,
      field,
      errorText,
      fieldSchema,
      formHook,
      styles,
      skinElement,
      inputRef,
      helperText: finalHelperText
    }
  } else {
    componentProps = {
      ...componentBaseProps,
      ref: inputRef
    }
  }

  if (noAutocomplete || fieldSchema.noAutocomplete)
    componentProps.autoComplete = 'off'

  return (
    <$wrapper
      {...rest}
      id={id}
      key={actualKey}
      name={name}
      field={field}
      styles={styles}
      fieldSchema={fieldSchema}
      errorText={errorText}
      helperText={finalHelperText}
      inline={inline}
      addWrapperProps={fieldSchema.addWrapperProps}
    >
      <$component
        {...componentProps}
      />
    </$wrapper>
  )
}
