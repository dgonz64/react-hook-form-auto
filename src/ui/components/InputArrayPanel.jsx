import React from 'react'
import { createNumberedArray } from '../../utils'
import { Panel } from './Panel'

import { tr, trModel } from '../../translation_utils'

const renderItemHeader = ({ styles, closeButton }) => {
  return (
    <div className={styles.itemHeader}>
      {closeButton}
    </div>
  )
}

const renderItems = ({ styles, items }) =>
  items.map(({ idx, closeButton, inputs }) => {
    const itemHeader = renderItemHeader({ styles, closeButton })

    return (
      <div key={idx} className={styles.arrayPanelItem}>
        <Panel header={itemHeader} styles={styles}>
          {inputs}
        </Panel>
      </div>
    )
  })

export const InputArrayPanel = (props) => {
  const { styles } = props

  return (
    <>
      <div className={styles.arrayPanelItems}>
        {renderItems(props)}
      </div>
    </>
  )
}
