import React, { forwardRef } from 'react'
import { processOptions } from '../../utils'

export let Select = (props) => {
  const {
    name,
    styles,
    onChange,
    onBlur,
    inputRef,
    defaultValue
  } = props

  const optionsProcessed = processOptions({
    ...props,
    addDefault: true,
  })

  return (
    <select
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      defaultValue={defaultValue}
      ref={inputRef}
      className={styles.select}
    >
      { optionsProcessed.map(({ label, value }) =>
          <option key={value} value={value} className={styles.selectOption}>
            {label}
          </option>
        )
      }
    </select>
  )
}
