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
    props: props => ({
      ...props,
      component: props.fieldSchema.textarea ? 'textarea' : 'input',
      type: 'text'
    }),
  },
  password: {
    props: {
      component: 'input',
      type: 'password'
    }
  },
  number: {
    coerce: value => parseFloat(value),
    props: {
      component: 'input',
      type: 'number'
    }
  },
  range: {
    coerce: value => parseFloat(value),
    props: {
      component: 'input',
      type: 'range'
    }
  },
  radios: {
    props: (props) => {
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
    component: Select
  },
  boolean: {
    coerce: value => Boolean(value),
    props: (props) => {
      return {
        ...props,
        component: Checkbox,
        inline: true
      }
    }
  },
  button: {
    component: Button
  },
  arrayButton: {
    component: Button
  },
  form: {
    component: ({ children, ...rest }) =>
      <form {...rest}>
        {children}
      </form>
  },
  panel: {
    component: Panel
  },
  addGlyph: {
    component: AddGlyph
  },
  removeGlyph: {
    component: RemoveGlyph
  },
  arrayTable: {
    component: InputArrayTable
  },
  arrayPanel: {
    component: InputArrayPanel
  },
  div: {
    component: props => <div {...props} />
  },
  text: {
    component: ({ children }) => children
  }
}
