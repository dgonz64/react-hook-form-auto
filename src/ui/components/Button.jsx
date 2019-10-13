import React from 'react'

export const Button = ({ styles, text, ...rest }) =>
  <button className={styles.button} {...rest}>
    <div className={styles.text}>
      {text}
    </div>
  </button>
