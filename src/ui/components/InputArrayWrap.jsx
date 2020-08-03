import React, {
  forwardRef,
  useReducer,
  useRef,
  useEffect
} from 'react'
import { renderInputs } from '../componentRender'
import { inputArray } from '../ducks'
import { tr, trModel } from '../../translation_utils'
import { deletedMark } from '../deletedMark'

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
  onAdd,
  schemaTypeName,
  aliveItems,
  name,
  styles,
  Button,
  AddGlyph
}) => {
  const addButton = renderAddButton({ 
    onAdd,
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

export const renderLectures = ({ error, styles }) => {
  if (error && error.message) {
    return (
      <div className={styles.error}>{error.message}</div>
    )
  } else
    return null
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
  fieldSchema,
  fieldSchema: { type },
  schemaTypeName,
  formHook,
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

  const aliveItems = items.keys.filter(idx => idx !== null)
  const counterField = `${name}__count`
  const arrayErrors = errors[counterField]

  const getErrorMessage = (num) => {
    if ('minChildren' in fieldSchema) {
      const { minChildren } = fieldSchema

      if (num < minChildren)
        return tr('error.minChildren', { minChildren })
    }

    if ('maxChildren' in fieldSchema) {
      const { maxChildren } = fieldSchema
      if (num > maxChildren)
        return tr('error.maxChildren', { maxChildren })
    }
  }

  const checkSetErrorMessage = (num) => {
    const message = getErrorMessage(num)
    if (message) {
      formHook.setError(counterField, {
        type: 'manual',
        message
      })
    } else {
      formHook.clearErrors(counterField)
    }
  }

  const itemsInputs = aliveItems.map(idx => {
    const handleRemove = (idx) => {
      dispatch(inputArray.remove(idx))
      checkSetErrorMessage(items.num - 1)

      const taint = `${name}[${idx}].${deletedMark}`
      setValue(taint, true)

      formHook.trigger(counterField)
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
  })

  const handleAdd = () => {
    formHook.trigger(counterField)
    dispatch(inputArray.add())
    checkSetErrorMessage(items.num + 1)
  }

  const panelProps = {
    onAdd: handleAdd,
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
      { renderLectures({ styles, error: arrayErrors }) }
      <$arrayHandler
        schema={schema}
        config={config}
        name={name}
        component={arrayHandler}
        onAdd={handleAdd}
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
