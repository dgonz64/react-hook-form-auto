import React, { Children } from 'react'
import classnames from 'classnames'

import { schemaTypeEx } from '../utils'
import { tr } from '../translate'
import { trError } from '../translation_utils'
import { FieldPropsOverride } from './components/FieldPropsOverride'

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
 * Creates validation rules after schema
 *
 * @param {object} fieldSchema
 */
export function validationRules(fieldSchema) {
  const validationKeys = Object.keys(validations)
  return validationKeys.reduce((result, key) => {
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
}

/**
 * Passes the validation parameters to react-hook-form
 *
 * @param {object} fieldSchema Schema for the field
 * @param {function} register react-hook-form register
 */
export function registerValidation(name, fieldSchema, register) {
  const rules = validationRules(fieldSchema)
  return register(name, rules)
}

/**
 * Searches in children to find overrides.
 */
function searchForOverrides(parent, name, children = []) {
  const childrenArr = Children.map(children, child => child)

  return childrenArr.reduce((override, child) => {
    const childName = child.props.name
    const isOverride = child.type == FieldPropsOverride
    const unbracked = name.replace(/ *[\[.][^)]*[\].] */g, '')
    if (isOverride && (childName == name || childName == unbracked)) {
      const cloned = Object.assign({}, child.props)
      delete cloned.name

      return cloned
    } else {
      return override
    }
  }, {})
}

function renderSingleInput(props) {
  const {
    id,
    component,
    wrapper,
    name,
    field,
    type,
    defaultValue,
    option,
    inline,
    register,
    registerProps: {
      onChange,
      onBlur,
      ref
    },
    key,
    styles,
    fieldSchema,
    noRef,
    errors = {},
    noAutocomplete,
    ...rest
  } = props

  const actualKey = option ? `${key}.${option}` : key
  const $wrapper = wrapper
  const $component = component
  const isComponent = typeof component != 'string'
  let baseProps = {
    id,
    key: actualKey,
    name,
    type,
    onChange: (par1, par2) => {
      debugger
      onChange(par1, par2)
    },
    onBlur,
    defaultValue,
    className: classnames(styles.input, styles.standard, {
      [styles.errored]: errors[field]
    }),
    ...fieldSchema.addInputProps
  }

  if (option)
    baseProps.value = option

  let componentProps
  if (isComponent) {
    componentProps = {
      ...baseProps,
      ...rest,
      field,
      errors,
      fieldSchema,
      styles,
      register
    }
  } else {
    componentProps = baseProps
  }

  if (noAutocomplete || fieldSchema.noAutocomplete)
    componentProps.autoComplete = 'off'

  return (
    <$wrapper
      id={id}
      key={actualKey}
      name={name}
      field={field}
      styles={styles}
      fieldSchema={fieldSchema}
      errors={errors}
      inline={inline}
      addWrapperProps={fieldSchema.addWrapperProps}
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

  function describePlace() {
    return `Schema "${schemaTypeName}" has field "${field}"`
  }

  if (!strType) {
    throw `${describePlace()} that lacks type description.`
  }

  const skinElement = skin[strType]

  if (!skinElement) {
    throw `${describePlace()} with type "${strType}" `
      + 'that doesn\'t exist in skin.'
  }

  const { render, wrapper } = skinElement
  
  const rules = validationRules(fieldSchema)
  if (render) {
    let fullField
    if (typeof index == 'undefined')
      fullField = parent ? `${parent}.${field}` : field
    else
      fullField = `${parent || ''}.${index}.${field}`
    const registerProps = register(fullField, rules)

    const overrides = searchForOverrides(parent, fullField, propOverrides)

    const id = `${schemaTypeName}-${fullField}`

    const baseProps = {
      ...rest,
      id,
      key: fullField,
      name: fullField,
      field,
      fieldSchema,
      schemaTypeName,
      config,
      parent,
      propOverrides,
      wrapper: wrapper || skin.defaultWrap,
      register,
      registerProps,
      rules,
      styles,
      skin,
      errors,
      defaultValue: initialValue ?? defaultValue,
      overrides,
      ...overrides
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
