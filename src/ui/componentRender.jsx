import React, { Children } from 'react'
import classnames from 'classnames'

import { schemaTypeEx } from '../utils'
import { tr } from '../translate'
import { trError } from '../translation_utils'

/**
 * Allows to specify extra props for a field in runtime.
 */
export const FieldPropsOverride = () => null

const validations = {
  required: ({ value, message }) => message,
  maxLength: 'maxLength',
  minLength: 'minLength',
  max: 'max',
  min: 'min',
  pattern: 'pattern',
  validate: 'validate'
}

/**
 * Passes the validation parameters to react-hook-form
 *
 * @param {object} fieldSchema Schema for the field
 * @param {function} register react-hook-form register
 */
export function registerValidation(fieldSchema, register) {
  const validationKeys = Object.keys(validations)
  const result = validationKeys.reduce((result, key) => {
    if (key in fieldSchema) {
      const validation = fieldSchema[key]
      let data
      if (typeof validation == 'object') {
        if (validation.message && typeof validation.message == 'function')
          validation.message = validation.message(fieldSchema)
        data = validation
      } else {
        data = {
          value: fieldSchema[key],
          message: trError(key, fieldSchema)
        }
      }

      result[key] = typeof validations[key] == 'function' ?
        validations[key](data) : data
    }

    return result
  }, {})

  if (Object.keys(result).length == 0)
    return register
  else
    return params => params ? register(params, result) : register(result)
}

/**
 * Searches in children to find overrides.
 */
function searchForOverrides(parent, name, children = []) {
  const childrenArr = Children.map(children, child => child)

  return childrenArr.reduce((override, child) => {
    const childName = child.props.name
    const isOverride = child.type.name == 'FieldPropsOverride'
    if (isOverride && name == childName)
      return child.props
    else
      return override
  }, {})
}

function renderSingleInput(props) {
  const {
    component,
    wrapper,
    name,
    type,
    defaultValue,
    option,
    inline,
    register,
    key,
    styles,
    fieldSchema,
    noRef,
    errors,
    noAutocomplete,
    ...rest
  } = props

  const actualKey = option ? `${key}.${option}` : key
  const $wrapper = wrapper
  const $component = component
  const isComponent = typeof component != 'string'
  const baseProps = {
    key: name,
    name: name,
    type: type,
    value: option,
    defaultValue,
    className: classnames(styles.input, styles.standard, {
      [styles.errored]: errors[name]
    })
  }

  if (!isComponent && !noRef)
    baseProps.ref = register

  const componentProps = isComponent ?
    { ...baseProps, ...rest, errors, fieldSchema, styles, register } : baseProps

  if (noAutocomplete || fieldSchema.noAutocomplete)
    componentProps.autoComplete = 'off'

  return (
    <$wrapper
      key={actualKey}
      name={name}
      styles={styles}
      fieldSchema={fieldSchema}
      errors={errors}
      inline={inline}
      {...rest}
    >
      <$component
        {...componentProps}
      />
    </$wrapper>
  )
}

/**
 * Renders a single field.
 *
 * @param {object} params
 * @param {string} params.field Name of the field
 * @param {object} params.fieldSchema Schema specification
 *    for the field
 * @param {string} params.parent Prefix of the field name
 * @param {string} params.schemaTypeName Name of the schema
 *    (first argument while instantiating a schema)
 * @param {object} params.config Form configuration
 * @param {...object} params.rest props passed to the component
 */
export function renderInput({
  field,
  fieldSchema,
  fieldSchema: {
    type,
    required,
    defaultValue
  },
  initialValue,
  register,
  parent,
  children,
  propOverrides,
  schemaTypeName,
  config = {},
  index,
  errors,
  skin,
  styles,
  ...rest
}) {
  const strType = schemaTypeEx(type)
  const skinElement = skin[strType]
  const { render, wrapper } = skinElement
  const validatedRegister = registerValidation(fieldSchema, register)
  if (render) {
    let fullField
    if (typeof index == 'undefined')
      fullField = parent ? `${parent}.${field}` : field
    else
      fullField = `${parent || ''}[${index}].${field}`

    const baseProps = {
      ...rest,
      key: fullField,
      name: fullField,
      field,
      fieldSchema,
      schemaTypeName,
      config,
      parent,
      propOverrides,
      wrapper: wrapper || skin.defaultWrap,
      register: validatedRegister,
      styles,
      skin,
      errors,
      defaultValue: initialValue ?? defaultValue,
      ...searchForOverrides(parent, fullField, propOverrides)
    }

    let allProps
    if (typeof render == 'function')
      allProps = render ? render(baseProps) : baseProps
    else
      allProps = { ...baseProps, ...render }

    if (Array.isArray(allProps))
      return allProps.map(renderSingleInput)
    else
      return renderSingleInput(allProps)
  } else
    return null
}

/**
 * Renders the inputs to make the schema work.
 *
 * @param {object} params
 * @param {Schema} params.schema Schema instance
 * @param {object} params.config Rendering configuration
 * @param {string} params.config.arrayMode 'panels' or 'table'
 * @param {...object} params.rest Props passed to every input
 *
 * @returns {array} React elements with the form and inputs.
 */
export function renderInputs({
  schema,
  config = {},
  children,
  register,
  errors,
  propOverrides,
  initialValues = {},
  styles = {},
  ...rest
}) {
  const schemaDef = schema.getSchema()
  const schemaKeys = Object.keys(schemaDef)

  return schemaKeys.map(field =>
    renderInput({
      ...rest,
      register,
      field,
      config,
      errors,
      propOverrides: propOverrides || children,
      fieldSchema: schemaDef[field],
      schemaTypeName: schema.getType(),
      initialValue: initialValues[field],
      styles
    })
  )
}
