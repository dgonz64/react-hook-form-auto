import React from 'react'
import { Autoform as AutoformRHFA } from '../src'

// To find buttons
const styles = {
  button: 'button'
}

export const Autoform = props =>
  <AutoformRHFA
    {...props}
    styles={styles}
  />
