import React from 'react'
import { textSvgStyle } from './svgUtils'

export const AddGlyph = () =>
  <svg style={textSvgStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path
      d="M 50 20 L 50 80 M 20 50 L 80 50"
      stroke="currentcolor"
      strokeWidth="15"
      strokeLinecap="round"
    />
  </svg>
