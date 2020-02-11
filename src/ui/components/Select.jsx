import React, { forwardRef } from 'react'
import { processOptions } from '../../utils'

export let Select = (props) => {
  const { name, styles, register } = props

  const optionsProcessed = processOptions({
    ...props,
    addDefault: true,
  })

  return (
    <select name={name} ref={register} className={styles.select}>
      { optionsProcessed.map(({ label, value }) =>
          <option key={value} value={value} className={styles.selectOption}>
            {label}
          </option>
        )
      }
    </select>
  )
}
