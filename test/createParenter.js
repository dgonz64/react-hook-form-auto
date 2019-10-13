import React from 'react'
import { createSchema } from '../src/index'

export const createParenter = () => {
  const child = createSchema('childer', {
    name: {
      type: 'string'
    }
  })

  return createSchema('parenter', {
    name: {
      type: 'string'
    },
    childs: {
      type: [child]
    },
    child: {
      type: child
    }
  })
}
