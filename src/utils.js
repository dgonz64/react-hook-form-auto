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
 * Converts options from different formats to
 * [ { label, value } ]
 *
 * You can usually pass control props here. Options will
 * be acquired from fieldSchema.
 *
 * @param {string} schemaTypeName Model name
 * @param {string} field Field name
 * @param {function|array} options Array with options. If
 *  it's a function it will be called with props.
 *  Array (or resulting one after calling) will be processed
 *  to populate label and value.
 */
export function processOptions({
  fieldSchema,
  schemaTypeName,
  field,
  options,
  addDefault,
  ...rest
}) {
  if (fieldSchema && !options)
    options = fieldSchema.options

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
 * `pathToArray("pets.4.name") --> ['pets', '4', 'name']`
 */
export function pathToArray(path) {
  const unsquared = path.replace(/[[.](.*?)[\].]/g, '.$1.')
  return unsquared.split('.')
}

/**
 * Traverses an object using an array of keys.
 *
 * @param {object} object Object to traverse
 * @param {string|array} path Path in the form `"pets.4.name"`,
 *  `"pets[4].name"` or `['pets', '4', 'name']`
 * @param {object} options Optional options:
 *  {
 *    createIfMissing: false, // Creates missing entities with objects,
 *    returnValue: false,     // Ultimate value if you are not interested
 *                            // in context
 *  }
 *
 * @returns {array} Array in the form `[ object, attribute ]`
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
  const {
    createIfMissing,
    returnValue
  } = options

  const arrayed = Array.isArray(pathOrArray) ?
    pathOrArray : pathToArray(pathOrArray)
  const [ next, ...rest ] = arrayed

  if (next in object) {
    if (rest.length == 0) {
      if (returnValue)
        return object[next]
      else
        return [ object, next ]
    } else {
      if (createIfMissing && typeof object[next] == 'undefined')
        object[next] = {}

      return objectTraverse(object[next], rest, options)
    }
  } else {
    if (createIfMissing) {
      object[next] = {}

      // Repeat
      return objectTraverse(object, arrayed, options)
    } else {
      if (returnValue)
        return null
      else
        return []
    }
  }
}

/**
 * Returns input name in the form 'parent.index.field'
 *
 * @param {string} parent Optional parent
 * @param {number|string} index Optional index
 * @param {string} field Field
 *
 * @returns {string} Depends:
 *      - If you passed index, then '<parent>.<index>.<field>'
 *      - Else if you passed parent, then '<parent>.<field>'
 *      - Else field
 */
export function inputName({ parent, index, field }) {
    if (typeof index == 'undefined')
      return parent ? `${parent}.${field}` : field
    else
      return `${parent || ''}.${index}.${field}`
}

/**
 * If attr is not found in object, we create it in the form
 * object[attr] = defaultObject
 *
 * @param {object} object Object
 * @param {string} attr Key
 * @param {function} create Function that returns a brand new
 *    object to assign if it didn't exist. Important: It must be
 *    a new object.
 *
 * @returns New or existing object[attr]
 *
 * @example
 *  const obj = { existing: { count: 42 } }
 *
 *  valueOrCreate(obj, 'existing', () => ({ count: 0 }))
 *    // -> { count: 42 }
 *  valueOrCreate(obj, 'invented', () => ({ count: 0 }))
 *    // -> { count: 0 }
 */
export function valueOrCreate(object, attr, create) {
  if (!(attr in object))
    object[attr] = create()

  return object[attr]
}

/**
 * @param {any} thing If thing is an event, value
 *  will be extracted. I consider event anything
 *  that has target with type
 * @returns {any} value
 */
export function valueFromEvent(thing) {
  if ('target' in thing) {
    const { target } = thing
    if ('type' in target) {
      const { type, value } = target

      switch (type) {
      case 'checkbox':
        return target.checked
        break
      default:
        return value
      }
    } else {
      return thing
    }
  } else {
    return thing
  }
}
