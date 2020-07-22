import React, { forwardRef, cloneElement } from 'react'
import { trField } from '../../translation_utils'

const Wrap = ({
  name,
  children,
  inline,
  styles,
  label,
  ...rest
}) => {
  if (inline) {
    return (
      <div key={name} className={styles.inlineWrap}>
        {children}
      </div>
    )
  } else {
    return (
      <div
        key={name}
        className={styles.inputBlockWrap}
        {...rest}
      >
        <label
          key="label"
          htmlFor={name}
          className={styles.label}
        >
          {label}
        </label>
        {children}
      </div>
    )
  }
}

export let InputWrap = (props, ref) => {
  const {
    name,
    field,
    children,
    schemaTypeName,
    styles,
    labelOverride,
    inline,
    errors = {},
    addWrapperProps
  } = props

  const label = typeof labelOverride != 'undefined' ?
    labelOverride : trField(props)
  const error = errors[name]

  return (
    <Wrap
      name={name}
      inline={inline}
      styles={styles}
      label={label}
      {...addWrapperProps}
    >
      {children}
      { error &&
        <>
          <div className={styles.error}>
            <div className={styles.errorMessage}>
              {error.message}
            </div>
          </div>
        </>
      }
    </Wrap>
  )
}

InputWrap = forwardRef(InputWrap)
