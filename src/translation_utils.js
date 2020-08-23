import { en, es } from './translations'
import {
  tr,
  setLanguage
} from './translate'

export { tr, setLanguage }

const defLangs = { en, es }

/**
 * Loads a language from the languages table.
 *
 * @param {string} name Language code as in `'en'` or `'fr'`.
 */
export function setLanguageByName(name) {
  if (name in defLangs)
    setLanguage(defLangs[name])
}

/**
 * Multipurpose semantic-ish translation.
 *
 * @param {string} modelName Object name, usually what
 *    you pass as the first parameter when you create
 *    the schema.
 * @param {string} field Field name
 * @param {string} op Thing that varies based on
 *    the type.
 */
export function trModel(modelName, field, op) {
  return tr(trPath(modelName, field, op))
}

/**
 * Translate field name
 *
 * @param {string|object} modelName Object name, usually what
 *    you pass as the first parameter when you create
 *    the schema. It can also be an object with component
 *    props so it will figure out the values
 * @param {string} field Field name
 */
export function trField(modelName, field) {
  if (typeof modelName == 'object') {
    field = modelName.field
    modelName = modelName.schemaTypeName
  }

  return tr(trPath(modelName, field, '_field'))
}

/**
 * Translates error message.
 *
 * @param {string} error Code of the error (usually the
 *    validation code-name)
 * @param {object} data Field configuration from `createSchema()`.
 */
export function trError(error, data) {
  return tr(`error.${error}`, data)
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

