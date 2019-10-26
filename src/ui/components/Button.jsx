import React from 'react'

export const Button = ({ styles, text, children, ...rest }) =>
  <button className={styles.button} {...rest}>
    {
      text &&
        <div className={styles.text}>
          {text}
        </div>
    }
    {children}
  </button>
