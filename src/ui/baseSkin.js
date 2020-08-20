import React from 'react'
import { InputArrayWrap } from './components/InputArrayWrap'
import { Submodel } from './components/Submodel'

function getOtherSchema(schemaDef, fieldName, { isArray }) {
  const field = schemaDef[fieldName]
  const { type } = field
  const other = isArray ? type[0] : type
  return other.getSchema()
}

import { deletedMark } from './deletedMark'

export default {
  array: {
    coerce: (arr = [], { coerceObject, schemaDef, fieldName }) => {
      const otherSchema = getOtherSchema(schemaDef, fieldName, {
        isArray: true
      })

      if (Array.isArray(arr)) {
        return arr.map(entry => {
          if (entry[deletedMark])
            return null
          else
            return coerceObject({ object: entry, schemaDef: otherSchema })
        }).filter(entry => entry !== null)
      } else {
        return []
      }
    },
    render: props => {
      const {
        config = {},
        fieldSchema,
        skin,
        ...rest
      } = props

      const { arrayMode } = config
      const isTable = arrayMode == 'table'
      const ArrayTable = skin.arrayTable.render
      const ArrayPanel = skin.arrayPanel.render
      const arrayHandler = isTable ? ArrayTable : ArrayPanel

      return {
        ...rest,
        config,
        component: InputArrayWrap,
        initiallyEmpty: fieldSchema.initiallyEmpty,
        fieldSchema,
        arrayHandler,
        inline: true,
        noRef: true,
        isTable,
        skin
      }
    },
  },
  schema: {
    coerce: (obj = {}, { coerceObject, schemaDef, fieldName }) => {
      const otherSchema = getOtherSchema(schemaDef, fieldName, { isArray: false })

      return coerceObject({ object: obj, schemaDef: otherSchema })
    },
    render: {
      component: Submodel,
      inline: true
    }
  }
}
