import React from 'react'
import classnames from 'classnames'

export const Panel = ({
  header,
  children,
  noMargin,
  styles = {}
}) => {
  const contentClasses = classnames(styles.content, {
    [styles.contentMargin]: !noMargin
  })

  return (
    <div className={styles.panel}>
      <div className={styles.title}>
        {header}
      </div>
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  )
}
