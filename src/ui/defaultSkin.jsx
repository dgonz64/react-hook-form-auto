import React from 'react'
import classnames from 'classnames'

import { InputWrap } from './components/InputWrap'
import { RadiosWrap } from './components/RadiosWrap'
import { Radio } from './components/Radio'
import { InputArrayTable } from './components/InputArrayTable'
import { InputArrayPanel } from './components/InputArrayPanel'
import { Select } from './components/Select'
import { Checkbox } from './components/Checkbox'
import { Button } from './components/Button'
import { Panel } from './components/Panel'
import { RemoveGlyph } from './svgs/RemoveGlyph'
import { AddGlyph } from './svgs/AddGlyph'

import { processOptions } from '../utils'

function standardClasses(props) {
  return classnames(
    props.styles.input,
    props.styles.standard
  )
}

export default {
  defaultWrap: InputWrap,
  string: {
    render: props => ({
      ...props,
      component: props.fieldSchema.textarea ? 'textarea' : 'input',
      type: 'text'
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
      const {
        schemaTypeName,
        field,
        fieldSchema,
        ref,
        ...rest
      } = props
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
      return {
        ...props,
        component: Checkbox,
        inline: true
      }
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
  },
  div: {
    render: props => <div {...props} />
  },
  text: {
    render: ({ children }) => children
  }
}
