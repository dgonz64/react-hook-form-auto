import React from 'react'
import classnames from 'classnames'

import { InputWrap } from './components/InputWrap'
import { RadiosWrap } from './components/RadiosWrap'
import { Radio } from './components/Radio'
import { InputArrayWrap } from './components/InputArrayWrap'
import { InputArrayTable } from './components/InputArrayTable'
import { InputArrayPanel } from './components/InputArrayPanel'
import { Select } from './components/Select'
import { Checkbox } from './components/Checkbox'
import { Submodel } from './components/Submodel'
import { Button } from './components/Button'
import { Panel } from './components/Panel'
import { RemoveGlyph } from './svgs/RemoveGlyph'
import { AddGlyph } from './svgs/AddGlyph'

import { processOptions } from '../utils'

import { deletedMark } from './deletedMark'

function standardClasses(props) {
  return classnames(
    props.styles.input,
    props.styles.standard
  )
}

function getOtherSchema(schemaDef, fieldName, { isArray }) {
  const field = schemaDef[fieldName]
  const { type } = field
  const other = isArray ? type[0] : type
  return other.getSchema()
}

export default {
  defaultWrap: InputWrap,
  string: {
    render: props => ({
      ...props,
      component: props.fieldSchema.textarea ? 'textarea' : 'input'
    }),
  },
  password: {
    render: {
      component: 'input',
      type: 'password'
    }
  },
  number: {
    coerce: value => parseFloat(value),
    render: {
      component: 'input',
      type: 'number'
    }
  },
  range: {
    coerce: value => parseFloat(value),
    render: {
      component: 'input',
      type: 'range'
    }
  },
  radios: {
    render: (props) => {
      const { schemaTypeName, field, fieldSchema, register, ...rest } = props
      const { options } = fieldSchema
      const optionsProcessed = processOptions({
        schemaTypeName,
        field,
        options,
        ...rest
      })

      return {
        ...rest,
        schemaTypeName,
        field,
        fieldSchema,
        component: RadiosWrap,
        noRef: true,
        children: optionsProcessed.map(op => {
          return (
            <Radio
              {...props}
              key={op.value}
              option={op.value}
              label={op.label}
              field={props.field}
              ref={register}
              inline
            />
          )
        })
      }
    }
  },
  select: {
    render: {
      component: Select
    }
  },
  boolean: {
    coerce: value => Boolean(value),
    render: (props) => {
      const { register, ...rest } = props

      return {
        ...rest,
        ref: register,
        component: Checkbox,
        inline: true
      }
    }
  },
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
        className,
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
  },
  button: {
    render: Button
  },
  arrayButton: {
    render: Button
  },
  form: {
    render: ({ children, ...rest }) =>
      <form {...rest}>
        {children}
      </form>
  },
  panel: {
    render: Panel
  },
  addGlyph: {
    render: AddGlyph
  },
  removeGlyph: {
    render: RemoveGlyph
  },
  arrayTable: {
    render: InputArrayTable
  },
  arrayPanel: {
    render: InputArrayPanel
  }
}
