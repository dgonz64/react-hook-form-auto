import { trModel } from './translation_utils'

/**
 * Translates schema specification type. Types can
 * be specified with a string or a constructor like
 * String.
 *
 * @param {string|function} type Type specification.
 *
 * @returns {string} Type as string.
 */
export const schemaType = type => {
  if (typeof type == 'function')
    return typeof type()
  else
    return type
}

/**
 * Translates the schema's type specification. Type
 * can be specified as with schemaType and also can
 * be a subschema or an array of other schema.
 *
 * @param {any} type Can be:
 *    - String like 'number'
 *    - Constructor like Number
 *    - Schema instance
 *    - Array with schema instance in the first element.
 *        Example: [client]
 */
export function schemaTypeEx(type) {
  if (typeof type == 'object' && type._type == 'schema')
    return 'schema'
  else {
    const isArray = Array.isArray(type)
    const first = type && type[0]
    const isSchema = isArray
      && type.length > 0
      && first._type
      && first._type == 'schema'

    if (isSchema)
      return 'array'
    else
      return schemaType(type)
  }
}

// Thanks Mariuzzo
// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (typeof item == 'object')
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function deepmerge(target, ...sources) {
  if (!sources.length)
    return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          if (Array.isArray(source[key]))
            Object.assign(target, { [key]: [] })
          else
            Object.assign(target, { [key]: {} })
        }
        deepmerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepmerge(target, ...sources)
}

export function createNumberedArray(length) {
  return Array.from({ length }, (_, k) => k)
}

/**
 * Generates a model translation path.
 *
 * @param {string} model Name of the model (ie: 'client')
 * @param {string} field Name of the field
 * @param {string} op Name of the option or any subthing.
 *
 * @returns {string} id for the translation string
 */
export function trPath(model, field, op) {
  if (typeof op == 'undefined')
    return ['models', model, field].join('.')
  else
    return ['models', model, field, op].join('.')
}

/**
 * Converts options from different formats to
 * [ { label, value } ]
 *
 * @param {string} schemaTypeName Model name
 * @param {string} field Field name
 * @param {function|array} options Array with options. If
 *  it's a function it will be called with props.
 *  Array (or resulting one after calling) will be processed
 *  to populate label and value.
 */
export function processOptions({
  schemaTypeName,
  field,
  options,
  addDefault,
  ...rest
}) {
  const extracted = typeof options == 'function' ?
    options({ name, field, schemaTypeName, ...rest }) : options

  const processed = extracted.map(option => {
    if (typeof option == 'string') {
      return {
        value: option,
        label: trModel(schemaTypeName, field, option)
      }
    } else {
      return option
    }
  })

  if (addDefault) {
    return [{
      label: trModel(schemaTypeName, field, '_default'),
      value: ''
    }, ...processed]
  } else {
    return processed
  }
}

/**
 * Transforms typical form path to array. Example:
 *
 * `pathToArray("pets[4].name") --> ['pets', '4', 'name']`
 */
export function pathToArray(path) {
  const unsquared = path.replace(/\[(.*?)\]/g, '.$1')
  return unsquared.split('.')
}

/**
 * Traverses an object using an array of keys.
 *
 * @param {object} object Object to traverse
 * @param {string|array} path Path in the form `"pets[4].name"`
 *  or `['pets', '4', 'name']`
 * @param {object} options Optional options:
 *  {
 *    createIfMissing: Creates missing entities with
 *      objects
 *  }
 *
 * @returns {object} Array in the form `[{ object, name }, ...]`
 *  (or empty if subobject is not found).
 *
 *  This allows you to mutate original object like this:
 *
 *  const [ container, attribute ] = objectTraverse(obj, path)
 *  container[attribute] = newValue
 *
 * TODO When createIfMissing, use path brackets as a
 * hint to when to create arrays or objects
 */
export function objectTraverse(object, pathOrArray, options = {}) {
  const { createIfMissing } = options
  const arrayed = Array.isArray(pathOrArray) ?
    pathOrArray : pathToArray(pathOrArray)
  const [ next, ...rest ] = arrayed

  if (next in object) {
    if (rest.length == 0)
      return [ object, next ]
    else
      return objectTraverse(object[next], rest, options)
  } else {
    if (createIfMissing) {
      object[next] = {}

      // Repeat
      return objectTraverse(object, arrayed, options)
    } else
      return []
  }
}

