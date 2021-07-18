import React, { forwardRef, cloneElement } from 'react'

import { renderInputs } from '../componentRender'
import { trModel } from '../../translation_utils'

export let Submodel = ({
  config = {},
  name,
  field,
  fieldSchema: { type },
  defaultValue,
  styles,
  skin,
  ...rest
}, ref) => {
  const inputsConf = {
    ...rest,
    schema: type,
    config,
    parent: name,
    initialValues: defaultValue,
    styles,
    skin
  }
  const schemaTypeName = type.getType()
  const Panel = skin.panel.render

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
