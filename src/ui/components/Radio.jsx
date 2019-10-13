import React, { forwardRef } from 'react'

export let Radio = ({
  schemaTypeName,
  name,
  option,
  label,
  styles,
  field,
  defaultValue
}, ref) => {
  const id = `${name}-${option}`
  const checked = defaultValue == option

  return (
    <div key={option} className={styles.radioWrap}>
      <input
        key="val"
        id={id}
        type="radio"
        name={name}
        value={option}
        ref={ref}
        defaultChecked={checked}
        className={styles.radio}
      />
      <label
        key="label"
        htmlFor={id}
        className={styles.radioLabel}
      >
        {label}
      </label>
    </div>
  )
}

Radio = forwardRef(Radio)
