import React, { forwardRef } from 'react'
import { processOptions } from '../../utils'

export let Select = ({
  name,
  field,
  fieldSchema: { options },
  schemaTypeName,
  styles,
  register,
  ...rest
}) => {
  const optionsProcessed = processOptions({
    schemaTypeName,
    field,
    options,
    addDefault: true,
    ...rest
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
