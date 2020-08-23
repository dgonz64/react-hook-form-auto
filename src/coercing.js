import { deepmerge, schemaTypeEx } from './utils'

export function createCoercers({
  initialValues,
  coerceRef,
  skin,
  onSubmit,
  schema
}) {
  return function coercedSubmit(doc) {
    const coerceObject = ({ object, schemaDef }) => {
      const fields = Object.keys(schemaDef)
      const result = deepmerge({}, object)

      fields.forEach(fieldName => {
        const fieldSchema = schemaDef[fieldName]
        const { type } = fieldSchema
        const typeKey = schemaTypeEx(type)
        const { coerce } = fieldSchema.coerce ?
          fieldSchema : skin[typeKey]
        const value = object[fieldName]

        if (coerce) {
          result[fieldName] = coerce(value, {
            coerceObject,
            schemaDef,
            fieldName
          })
        }
      })

      return result
    }

    const coerceWithSchema = ({ doc, schema }) => {
      const schemaDef = schema.getSchema()

      return coerceObject({
        object: doc,
        schemaDef
      })
    }

    const wholeObj = deepmerge({}, initialValues, doc, coerceRef.current)
    const coerced = coerceWithSchema({ doc: wholeObj, schema })

    onSubmit(coerced, doc)
  }
}
