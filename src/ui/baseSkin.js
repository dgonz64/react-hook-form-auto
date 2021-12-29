import React from 'react'
import { InputArrayWrap } from './components/InputArrayWrap'
import { Submodel } from './components/Submodel'
import { getSkinComponent } from '../utils'

function getOtherSchema(schemaDef, fieldName, { isArray }) {
  const field = schemaDef[fieldName]
  const { type } = field
  const other = isArray ? type[0] : type
  return other.getSchema()
}

import { deletedMark } from './deletedMark'

export default {
  array: {
    skipRegister: true,
    nameForErrors: name => `${name}__count`,
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
    props: props => {
      const {
        config = {},
        fieldSchema,
        skin,
        ...rest
      } = props

      const { arrayMode } = config
      const isTable = arrayMode == 'table'
      const ArrayTable = getSkinComponent(skin.arrayTable)
      const ArrayPanel = getSkinComponent(skin.arrayPanel)
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
    skipRegister: true,
    coerce: (obj = {}, { coerceObject, schemaDef, fieldName }) => {
      const otherSchema = getOtherSchema(schemaDef, fieldName, { isArray: false })

      return coerceObject({ object: obj, schemaDef: otherSchema })
    },
    component: Submodel
  }
}
