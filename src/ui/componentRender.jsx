import React, { Children } from 'react'

import {
  schemaTypeEx,
  inputName
} from '../utils'
import { tr } from '../translate'
import { trError } from '../translation_utils'
import { FieldPropsOverride } from './components/FieldPropsOverride'
import { AutofieldContainer } from './AutofieldContainer'

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
      } else if (key == 'validate') {
        data = value => {
          const erroring = validation(value)
          return erroring === false || erroring
        }
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
 * Searches in children to find overrides.
 */
function searchForOverrides(parent, name, children = []) {
  const childrenArr = Children.map(children, child => child)

  return childrenArr.reduce((override, child) => {
    const childName = child.props.name
    const dottedChild = childName && childName.replace(/(\[|\]\.)/g, '.')
    const isOverride = child.type == FieldPropsOverride
    if (isOverride && dottedChild == name) {
      const cloned = Object.assign({}, child.props)
      delete cloned.name

      return cloned
    } else {
      return override
    }
  }, {})
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
  parent,
  children,
  propOverrides,
  schemaTypeName,
  config = {},
  index,
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

  const rules = validationRules(fieldSchema)
  const fullField = inputName({ parent, index, field })
  const id = `${schemaTypeName}-${fullField}`

  const overrides = searchForOverrides(parent, fullField, propOverrides)

  defaultValue = typeof initialValue == 'undefined' ?
    defaultValue : initialValue

  return (
    <AutofieldContainer
      {...rest}
      id={id}
      key={fullField}
      name={fullField}
      field={field}
      fieldSchema={fieldSchema}
      schemaTypeName={schemaTypeName}
      config={config}
      parent={parent}
      propOverrides={propOverrides}
      rules={rules}
      styles={styles}
      skin={skin}
      skinElement={skinElement}
      defaultValue={defaultValue}
      overrides={overrides}
    />
  )
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
      propOverrides: propOverrides || children,
      fieldSchema: schemaDef[field],
      schemaTypeName: schema.getType(),
      initialValue: initialValues[field],
      styles
    })
  )
}
