import React, { forwardRef } from 'react'
import { trField } from '../../translation_utils'

const Wrap = ({
  id,
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
          htmlFor={id}
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
    id,
    name,
    formHook,
    children,
    schemaTypeName,
    styles,
    labelOverride,
    inline,
    addWrapperProps,
    helperText = '',
    errorText = ''
  } = props

  const label = typeof labelOverride != 'undefined' ?
    labelOverride : trField(props)

  return (
    <Wrap
      id={id}
      name={name}
      inline={inline}
      styles={styles}
      label={label}
      {...addWrapperProps}
    >
      {children}
      { helperText &&
        <div className={styles.helper}>
          {helperText}
        </div>
      }
      { errorText &&
        <div className={styles.error}>
          <div className={styles.errorMessage}>
            {errorText}
          </div>
        </div>
      }
    </Wrap>
  )
}

InputWrap = forwardRef(InputWrap)
