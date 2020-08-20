import React, { forwardRef } from 'react'
import defaultSkin from './defaultSkin'
import { AutoformBase } from './AutoformBase'

/**
 * Creates a form using the current skin. The form
 * has all the needed fields, styles and validation
 * errors in order to work.
 */
export let Autoform = (props, ref) => {
  const {
    skin = defaultSkin,
    ...rest
  } = props

  return (
    <AutoformBase
      {...rest}
      skin={skin}
      ref={ref}
    />
  )
}

Autoform = forwardRef(Autoform)
