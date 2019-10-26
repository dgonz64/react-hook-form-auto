import React from 'react'
import { textSvgStyle } from './svgUtils'

export const RemoveGlyph = () =>
  <svg style={textSvgStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path
      d="M 20 20 L 80 80 M 20 80 L 80 20"
      stroke="currentcolor"
      strokeWidth="15"
      strokeLinecap="round"
    />
  </svg>
