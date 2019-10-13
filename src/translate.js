import { deepmerge } from './utils.js'

let translations = {}

const VAR_REGEX = /__(.*?)__/g
const REF_REGEX = /@@(.*?)@@/g

function findString(id) {
  const part = id.split('.')

  const lastIndex = part.length - 1
  return part.reduce((node, cur, index) => {
    const isLast = index == lastIndex
    const isString = typeof node == 'string'

    if (isString)
      return node
    else {
      if (node && node[cur]) {
        if (isLast && node[cur]._)
          return node[cur]._
        else
          return node[cur]
      } else {
        return (node && node._) || id
      }
    }
  }, translations)
}

function regexReplace(regex, str, callback) {
  let match
  let result = str

  const re = new RegExp(regex)
  while ((match = re.exec(str)) !== null) {
    const value = callback(match[1])
    if (typeof value != 'undefined')
      result = result.replace(match[0], value)
  }

  return result
}

/**
 * Translates a string given its id.
 *
 * @param {string} id Identifier in the form
 * 	key1.key2.key3
 * @param {object} vars Object with substitution variables. It will
 * 	substitute ocurrences when string contains this expression:
 * 	__variable__. For example the string "My name is __name__" with
 * 	vars = { name: 'David' } will return "My name is David".
 *
 * 	Keys will be searched by partitioning the 'path'.
 * 	It will get the latest found key if any. For example, given the
 * 	strings { "a": { "b": 'Hello' } } and looking for 'a.b.c' it will
 * 	return 'a.b' ("Hello").
 * @returns Translated string
 */
export function tr(id, vars = {}) {
  let found = findString(id)
  if (found) {
    // Find variables
    found = regexReplace(VAR_REGEX, found, match => vars[match])

    // Find references
    found = regexReplace(REF_REGEX, found, match => tr(match, vars))

    return found
  } else
    return id
}

/**
 * Sets the language.
 *
 * At the moment this does the same as addTranslations. The
 * reason is not to lose translations reference until a better
 * way is figured out.
 *
 * @param {lang} Translations object with the format
 * 	{ key: { _: 'Some string', inner: 'Some other string' } }
 * 	Then, we have the following paths
 * 	- key -> 'Some string'
 * 	- key.inner -> 'Some other string'
 */
export function setLanguage(lang) {
  addTranslations(lang)
}

/**
 * Appends translations to current translation table
 *
 * @param {object} lang Translations merged into current.
 */
export function addTranslations(lang) {
  translations = deepmerge(translations, lang)
}

/**
 * Sets the translation engine that responds to tr().
 *
 * @param {function} translate Function with signature
 * 	translate(id, params).
 */
export function setTranslator(translate) {
  tr = translate
}
