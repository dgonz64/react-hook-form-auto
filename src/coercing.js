import {
  deepmerge,
  schemaTypeEx,
  objectTraverse
} from './utils'

export function createCoercers({
  initialValues,
  stateRef,
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

    const fields = Object.keys(stateRef.current.fields)
    const values = fields.reduce((values, field) => {
      const state = stateRef.current.fields[field]

      if (state.visible) {
        const [ container, attr ] = objectTraverse(values, field, {
          createIfMissing: true
        })
        const [ docContainer ] = objectTraverse(doc, field)
        if (container && attr) {
          if (state.changed)
            container[attr] = state.value
          else if (docContainer)
            container[attr] = docContainer[attr]
        }
      }

      return values
    }, {})

    const wholeObj = deepmerge({}, initialValues, values)
    const coerced = coerceWithSchema({ doc: wholeObj, schema })

    onSubmit(coerced, doc)
  }
}
