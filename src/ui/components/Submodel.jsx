import React, { forwardRef } from 'react'

import { renderInputs } from '../componentRender'
import { trModel } from '../../translation_utils'
import { getSkinComponent } from '../../utils'

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
  const Panel = getSkinComponent(skin.panel)

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
