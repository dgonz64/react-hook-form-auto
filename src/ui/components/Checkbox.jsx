import React, { forwardRef } from 'react'
import { trModel } from '../../translation_utils'

export let Checkbox = ({
  id,
  schemaTypeName,
  name,
  onChange,
  onBlur,
  defaultValue,
  styles = {},
  field 
}, ref) => {
  const defaultChecked = defaultValue !== 'false' && defaultValue

  return (
    <div key={name} className={styles.checkboxWrap}>
      <input
        key="val"
        id={id}
        type="checkbox"
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        defaultChecked={defaultChecked}
        className={styles.checkbox}
      />
      <label
        key="label"
        htmlFor={id}
        className={styles.checkboxLabel}
      >
        {trModel(schemaTypeName, name)}
      </label>
    </div>
  )
}

Checkbox = forwardRef(Checkbox)
