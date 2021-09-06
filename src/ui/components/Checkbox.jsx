import { trModel } from '../../translation_utils'

export let Checkbox = ({
  id,
  schemaTypeName,
  name,
  onChange,
  onBlur,
  defaultValue,
  inputRef,
  styles = {},
  field 
}) => {
  const defaultChecked = defaultValue !== 'false' && defaultValue

  return (
    <div key={name} className={styles.checkboxWrap}>
      <input
        key="val"
        id={id}
        type="checkbox"
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        defaultChecked={defaultChecked}
        className={styles.checkbox}
        ref={inputRef}
      />
      <label
        key="label"
        htmlFor={id}
        className={styles.checkboxLabel}
      >
        {trModel(schemaTypeName, name)}
      </label>
    </div>
  )
}
