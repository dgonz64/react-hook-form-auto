import { en, es } from './translations'
import {
  tr,
  setLanguage
} from './translate'
import { trPath } from './utils'

// Let's reexport this stuff to lighten imports
export { tr, setLanguage }

const defLangs = { en, es }

/**
 * Loads a language from the languages table.
 *
 * @param {string} name Language code as in 'en' or 'fr'.
 */
export const setLanguageByName = name => {
  if (name in defLangs)
    setLanguage(defLangs[name])
}

/**
 * Multipurpose semantic-ish translation.
 *
 * @param {string} model Object name, usually what
 *    you pass as the first parameter when you create
 *    the schema.
 * @param {string} field Field name
 * @param {string} op Thing that varies based on
 *    the type.
 */
export const trModel = (model, field, op) =>
  tr(trPath(model, field, op))

/**
 * Translates error message.
 *
 * @param {string} error Code of the error (usually the
 *    validation code-name)
 * @param {object} data Field configuration from createSchema().
 */
export const trError = (error, data) =>
  tr(`error.${error}`, data)

