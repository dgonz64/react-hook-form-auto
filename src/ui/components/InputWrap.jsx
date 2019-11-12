import React, { forwardRef, cloneElement } from 'react'
import { trModel } from '../../translation_utils'

const Wrap = ({
  name,
  children,
  inline,
  styles,
  label
}) => {
  if (inline) {
    return (
      <div key={name} className={styles.inlineWrap}>
        {children}
      </div>
    )
  } else {
    return (
      <div key={name} className={styles.inputBlockWrap}>
        <label key="label" htmlFor={name} className={styles.label}>
          {label}
        </label>
        {children}
      </div>
    )
  }
}

export let InputWrap = ({
  name,
  field,
  children,
  schemaTypeName,
  styles,
  labelOverride,
  inline,
  errors = {}
}, ref) => {
  const label = typeof labelOverride != 'undefined' ?
    labelOverride : trModel(schemaTypeName, field, '_field')
  const error = errors[name]

  return (
    <Wrap
      name={name}
      inline={inline}
      styles={styles}
      label={label}
    >
      {children}
      { error &&
        <>
          <div className={styles.error}>
            <div className={styles.errorMessage}>
              {error.message}
            </div>
            <div className={styles.errorIcon}>
              ❌
            </div>
          </div>
        </>
      }
    </Wrap>
  )
}

InputWrap = forwardRef(InputWrap)
