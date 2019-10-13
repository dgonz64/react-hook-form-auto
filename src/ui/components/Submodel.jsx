import React, { forwardRef, cloneElement } from 'react'
import PropTypes from 'prop-types'

import { Panel } from './Panel'
import { renderInputs } from '../componentRender'
import { trModel } from '../../translation_utils'

export let Submodel = ({
  config = {},
  name,
  field,
  fieldSchema: { type },
  defaultValue,
  styles,
  ...rest
}, ref) => {
  const inputsConf = {
    ...rest,
    schema: type,
    config,
    parent: name,
    initialValues: defaultValue,
    styles
  }
  const schemaTypeName = type.getType()

  return (
    <Panel
      styles={styles}
      header={trModel(schemaTypeName, field)}
    >
      {renderInputs(inputsConf)}
    </Panel>
  )
}

Submodel = forwardRef(Submodel)
