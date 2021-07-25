import React, { useRef, useState, useEffect } from 'react'

import {
  valueOrCreate,
  objectTraverse
} from './utils'
import { createCoercers } from './coercing'
import { PubSub } from './pubsub'

export const useAutoformState = ({
  initialValues,
  onSubmit,
  schema,
  skin,
  formHook,
  skipManualReset
}) => {
  const stateRef = useRef({})
  const stateControl = new PubSub()

  const coercedSubmit = createCoercers({
    initialValues,
    stateRef,
    skin,
    onSubmit,
    schema
  })

  const schemaDef = schema.getSchema()
  const findOrInitState = (name) => {
    return valueOrCreate(stateRef.current, name, () => {
      const nameForVisible = `${name}.initiallyVisible`
      const initiallyVisible = objectTraverse(schemaDef, nameForVisible, {
        returnValue: true
      })

      return {
        visible: initiallyVisible === null ? true : initiallyVisible,
        helperText: null
      }
    })
  }

  const setValue = (name, value, options = {}) => {
    const fieldState = findOrInitState(name)

    const newState = {
      ...fieldState,
      value,
      changed: true
    }

    if (!options.skipSetInput)
      formHook.setValue(name, value, options)
  }

  stateControl.findOrInitState = findOrInitState
  stateControl.setValue = setValue

  /**
   * Sets values in the stateRef. Doesn't trigger.
   */
  const setValues = (values, { parent = null, field }) => {
    const fields = Object.keys(values)
    fields.forEach(field => {
      const cur = values[field]
      if (typeof cur == 'object') {
        return setValues(cur, { parent: field, field })
      } else {
        const name = inputName({ parent, field })
        findOrInitState(fieldName)
      }
    })
  }

  const resetState = (values, omit) => {
    stateRef.current = {}

    setValues(values || {})

    const currentValues = formHook.getValues()

    if (!skipManualReset) {
      // Reset by setting everything to initialValues or null.
      function resetValues(obj, initials = {}, path = '', isArray = false) {
        const fields = Object.keys(obj)
        fields.forEach((field, idx) => {
          const value = obj[field]
          const elPath = isArray ?
            `${path}.${idx}` : (path ? `${path}.${field}` : field)
          const initial = initials[field]
          if (typeof value == 'object')
            resetValues(value, initial, elPath, Array.isArray(value))
          else {
            const initialOrNull = typeof initial == 'undefined' ? null : initial
            formHook.setValue(elPath, initialOrNull)
          }
        })
      }

      resetValues(currentValues, initialValues)
    }

    formHook.reset(values, omit)
  }

  const changeAndPublish = (name, attr, value) => {
    const state = findOrInitState(name)

    stateControl.publish(name, {
      ...state,
      [attr]: value
    })
  }

  const setVisible = (name, visible) => {
    changeAndPublish(name, 'visible', visible)
  }

  const setHelperText = (name, text) => {
    changeAndPublish(name, 'helperText', text)
  }

  return {
    coercedSubmit,
    setValue,
    setVisible,
    setHelperText,
    resetState,
    stateControl
  }
}

// Subscribes to visible, helperText and potential future additions
export const useAutofieldState = ({ name, stateControl }) => {
  const initialState = stateControl.findOrInitState(name)
  const [ state, setState ] = useState({ ...initialState })

  useEffect(() => {
    stateControl.subscribe(name, setState)
    return () => {
      stateControl.unsubscribe(name, setState)
    }
  }, [])

  return state
}
