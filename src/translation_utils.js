import { en, es } from './translations'
import { deepmerge } from './utils.js'
import {
  tr,
  setLanguage
} from './translate'

export { tr, setLanguage }

const defLangs = { en, es }

let modelBasePath = 'models'

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
 * Allows to add a bunch of strings to a language
 */
export function addLanguageTranslations(lang, strings) {
  defLangs[lang] = deepmerge(defLangs[lang], strings)
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
    return [modelBasePath, model, field].join('.')
  else
    return [modelBasePath, model, field, op].join('.')
}

/**
 * Sets the base for the semantich(ish) translation, so
 * instead of 'models.<model>.<field>' can be
 * 'my.base.<model>.<field>'
 *
 * @param {string} newBasePath New path prepended to all
 *    string paths.
 */
export function trPathSetBase(newBasePath) {
  modelBasePath = newBasePath
}
