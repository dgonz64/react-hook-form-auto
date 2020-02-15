import React from 'react'

const renderItemHeader = ({ styles, closeButton }) => {
  return (
    <div className={styles.itemHeader}>
      {closeButton}
    </div>
  )
}

const renderItems = ({ styles, items, Panel }) =>
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
  const { styles, skin } = props
  const Panel = skin.panel.render

  return (
    <>
      <div className={styles.arrayPanelItems}>
        {renderItems({ ...props, Panel })}
      </div>
    </>
  )
}
