import React, {
  forwardRef,
  useReducer,
  useRef,
  useEffect
} from 'react'
import classnames from 'classnames'

import { renderInputs } from '../componentRender'
import { inputArray } from '../ducks'
import { tr, trModel } from '../../translation_utils'
import { deletedMark } from '../deletedMark'
import { inputName } from '../../utils'

const renderAddButton = ({ onAdd, styles, Button, AddGlyph }) => {
  const boundAdd = e => {
    e.preventDefault()
    onAdd()
  }

  return (
    <Button
      onClick={boundAdd}
      styles={styles}
      intent="add"
    >
      <AddGlyph styles={styles} />
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
      intent="remove"
    >
      <RemoveGlyph styles={styles} />
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
  AddGlyph,
  Div,
  Text
}) => {
  const addButton = renderAddButton({ 
    onAdd,
    styles,
    Button,
    AddGlyph,
  })

  return (
    <Div className={styles.inputPanelWrap}>
      <Text className={styles.inputPanelEntity}>
        {trModel(schemaTypeName, name) + ' '}
      </Text>
      {addButton}
    </Div>
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
  errorText = '',
  fieldSchema,
  fieldSchema: { type },
  schemaTypeName,
  formHook,
  defaultValue,
  initiallyEmpty,
  onRemove,
  config,
  styles,
  isTable,
  setValue,
  skin,
  skinElement,
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
  const Div = skin.div.render
  const Text = skin.text.render

  const aliveItems = items.keys.filter(idx => idx !== null)
  const counterField = skinElement.nameForErrors(name)

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

  const handleAdd = () => {
    dispatch(inputArray.add())
    checkSetErrorMessage(items.num + 1)
  }

  const itemsInputs = aliveItems.map(idx => {
    const handleRemove = (removeIdx) => {
      dispatch(inputArray.remove(removeIdx))
      checkSetErrorMessage(items.num - 1)

      const taint = `${name}.${removeIdx}.${deletedMark}`
      setValue(taint, true)

      const fieldNames = schema.getFieldNames()
      fieldNames.forEach(fieldName => {
        const toUnregister = inputName({
          parent: name,
          index: removeIdx,
          field: fieldName
        })
        unregister(toUnregister)
      })
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
        formHook,
        styles,
        register,
        unregister,
        arrayIdx: idx,
        arrayInitialValues: itemDefault,
        skin,
        arrayControl: {
          items,
          index: idx,
          remove: handleRemove,
          add: handleAdd
        }
      })
    }
  })

  const panelProps = {
    onAdd: handleAdd,
    schemaTypeName,
    dispatch,
    name,
    styles,
    Button,
    AddGlyph,
    Div,
    Text
  }

  const panelClasses = classnames({
    [styles.errored]: errorText
  })

  return (
    <Panel
      className={panelClasses}
      header={renderPanelHeader(panelProps)}
      styles={styles}
    >
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
