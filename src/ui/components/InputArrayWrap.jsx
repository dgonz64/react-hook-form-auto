import React, {
  forwardRef,
  useReducer,
  useRef
} from 'react'
import { renderInputs } from '../componentRender'
import { inputArray } from '../ducks'
import { trModel } from '../../translation_utils'
import { deletedMark } from '../deletedMark'

const handleAdd = (dispatch) => {
  dispatch(inputArray.add())
}

const renderAddButton = ({ onAdd, styles, Button, AddGlyph }) => {
  const boundAdd = e => {
    e.preventDefault()
    onAdd()
  }

  return (
    <Button
      onClick={boundAdd}
      styles={styles}
    >
      <AddGlyph />
    </Button>
  )
}

const renderCloseButton = ({
  onRemove,
  idx,
  styles,
  Button,
  RemoveGlyph
}) => {
  const boundRemove = e => {
    e.preventDefault()
    onRemove(idx)
  }

  return (
    <Button
      onClick={boundRemove}
      styles={styles}
    >
      <RemoveGlyph />
    </Button>
  )
}

const renderPanelHeader = ({
  schemaTypeName,
  dispatch,
  name,
  styles,
  Button,
  AddGlyph
}) => {
  const addButton = renderAddButton({ 
    onAdd: handleAdd.bind(null, dispatch),
    styles,
    Button,
    AddGlyph,
  })

  return (
    <div className={styles.inputPanelWrap}>
      {trModel(schemaTypeName, name) + ' '}
      {addButton}
    </div>
  )
}

/**
 * Used for the arrays in models, for
 * example clients: [Clients]
 *
 */
export let InputArrayWrap = ({
  name,
  newObject,
  arrayHandler,
  register,
  unregister,
  fieldSchema: { type },
  schemaTypeName,
  defaultValue,
  errors = {},
  initiallyEmpty,
  onRemove,
  config,
  styles,
  isTable,
  setValue,
  skin,
  ...rest
}) => {
  const [ items, dispatch ] = useReducer(
    inputArray.reducer,
    inputArray.initialFromDefault(defaultValue, initiallyEmpty)
  )

  const schema = type[0]
  const $arrayHandler = arrayHandler

  const Button = skin.arrayButton.render
  const AddGlyph = skin.addGlyph.render
  const RemoveGlyph = skin.removeGlyph.render
  const Panel = skin.panel.render

  const fieldErrors = errors[name] || {}

  const itemsInputs = items.keys.map(idx => {
    if (idx === null) {
      return null
    } else {
      const handleRemove = (idx) => {
        dispatch(inputArray.remove(idx))

        const taint = `${name}[${idx}].${deletedMark}`
        setValue(taint, true)
      }

      const closeButton = renderCloseButton({
        onRemove: handleRemove,
        idx,
        styles,
        Button,
        RemoveGlyph
      })

      let itemDefault
      if (defaultValue && Array.isArray(defaultValue))
        itemDefault = defaultValue[idx]
      else
        itemDefault = defaultValue

      return {
        idx,
        closeButton,
        inputs: renderInputs({
          ...rest,
          inline: isTable,
          schema,
          schemaTypeName,
          setValue,
          parent: name,
          index: idx,
          initialValues: itemDefault,
          styles,
          register,
          unregister,
          errors: fieldErrors[idx],
          arrayIdx: idx,
          arrayInitialValues: itemDefault,
          skin
        })
      }
    }
  }).filter(item => item !== null)

  const panelProps = {
    schemaTypeName,
    dispatch,
    name,
    styles,
    Button,
    AddGlyph
  }

  return (
    <Panel
      header={renderPanelHeader(panelProps)}
      styles={styles}
    >
      <$arrayHandler
        schema={schema}
        config={config}
        name={name}
        component={arrayHandler}
        onAdd={handleAdd.bind(null, dispatch)}
        newObject={newObject}
        items={itemsInputs}
        defaultValue={defaultValue}
        schemaTypeName={schemaTypeName}
        styles={styles}
        skin={skin}
        {...rest}
      />
    </Panel>
  )
}
