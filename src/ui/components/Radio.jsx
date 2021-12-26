import React, { forwardRef } from 'react'

export let Radio = ({
  id,
  schemaTypeName,
  name,
  option,
  onChange,
  onBlur,
  inputRef,
  label,
  styles,
  field,
  defaultValue
}, ref) => {
  const fullId = `${id}-${option}`
  const checked = defaultValue == option

  return (
    <div key={option} className={styles.radioWrap}>
      <input
        key="val"
        id={fullId}
        type="radio"
        name={name}
        value={option}
        onChange={onChange}
        onBlur={onBlur}
        ref={inputRef}
        defaultChecked={checked}
        className={styles.radio}
      />
      <label
        key="label"
        htmlFor={fullId}
        className={styles.radioLabel}
      >
        {label}
      </label>
    </div>
  )
}

Radio = forwardRef(Radio)
