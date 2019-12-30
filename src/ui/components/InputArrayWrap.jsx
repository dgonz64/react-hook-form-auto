import React, {
  forwardRef,
  useReducer,
  useRef
} from 'react'
import { Button } from './Button'
import { renderInputs } from '../componentRender'
import { inputArray } from '../ducks'
import { Panel } from './Panel'
import { trModel } from '../../translation_utils'
import { deletedMark } from '../deletedMark'
import { RemoveGlyph } from '../svgs/RemoveGlyph'
import { AddGlyph } from '../svgs/AddGlyph'

const handleAdd = (dispatch) => {
  dispatch(inputArray.add())
}

const renderAddButton = ({ onAdd, styles }) => {
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
  styles
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

const renderPanelHeader = ({ schemaTypeName, dispatch, name, styles }) => {
  const addButton = renderAddButton({ 
    onAdd: handleAdd.bind(null, dispatch),
    styles
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
  initiallyEmpty,
  onRemove,
  config,
  styles,
  isTable,
  setValue,
  ...rest
}) => {
  const [ items, dispatch ] = useReducer(
    inputArray.reducer,
    inputArray.initialFromDefault(defaultValue, initiallyEmpty)
  )
  const registeredFields = useRef({})

  const schema = type[0]
  const $arrayHandler = arrayHandler

  const itemsInputs = items.keys.map(idx => {
    if (idx === null) {
      return null
    } else {
      const handleRemove = (idx) => {
        dispatch(inputArray.remove(idx))

        const taint = `${name}[${idx}].${deletedMark}`
        setValue(taint, true)
      }

      const registerSpy = (params) => {
        if (params !== null) {
          const { name } = params

          if (name) {
            const regFields = registeredFields.current

            if (regFields[idx])
              regFields[idx].add(name)
            else
              regFields[idx] = new Set([ name ])
          }
        }

        return register(params)
      }

      const closeButton = renderCloseButton({ onRemove: handleRemove, idx, styles })

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
          register: registerSpy,
          unregister,
          arrayIdx: idx,
          arrayInitialValues: itemDefault
        })
      }
    }
  }).filter(item => item !== null)

  return (
    <Panel
      header={renderPanelHeader({ schemaTypeName, dispatch, name, styles })}
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
        {...rest}
      />
    </Panel>
  )
}
