import React from 'react'
import classnames from 'classnames'

export const Panel = ({
  className,
  header,
  children,
  noMargin,
  styles = {}
}) => {
  const panelClasses = classnames(styles.panel, className)
  const contentClasses = classnames(className, styles.content, {
    [styles.contentMargin]: !noMargin
  })

  return (
    <div className={panelClasses}>
      <div className={styles.title}>
        {header}
      </div>
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  )
}
