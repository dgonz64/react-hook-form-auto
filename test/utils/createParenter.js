import React from 'react'
import { createSchema } from '../../src/index'

export const createParenter = ({
  everythingRequired,
  arrayAdd
} = {}) => {
  const child = createSchema('childer', {
    name: {
      type: 'string'
    }
  })

  return createSchema('parenter', {
    name: {
      type: 'string',
      required: everythingRequired
    },
    childs: {
      type: [child],
      required: everythingRequired,
      ...arrayAdd
    },
    child: {
      type: child,
      required: everythingRequired
    }
  })
}
