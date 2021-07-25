# Affects skins

After a [good question](#3) I though the best way to manage field change reaction was to upgrade to react-hook-form 7 because tracking `ref` felt kind of hacky. If you don't have skin components, you are good to go. Just update corresponding the library of the family, and react-hook-form.

If you made a skin, I hope this migration guide helps.

When I refer to component I mean the `skin[type].render.component` entry.

## register vs onChange and onBlur

The biggest difference is that now inputs are automatically registered and input component has `onChange` and `onBlur` as props that come from `const { field } = register()`. You should use those in the skin instead of `ref` or calling `register()` manually.

```diff
     render: {
       component: (props) => {
         const {
           id,
           name,
-          register,
           defaultValue,
+          onChange,
+          onBlur
         } = props

         return (
           <Checkbox
             id={id}
             name={name}
-            inputProps={{ ref: register }}
             defaultValue={defaultValue}
+            onChange={onChange}
+            onBlur={onBlur}
           />
         )
       }
     }
```

## setValue

Still works for plain value (not event), both for controlled and uncontrolled inputs.

```diff
     render: {
       component: (props) => {
         const {
           name,
           defaultValue,
+          setValue,
+          onBlur
         } = props
 
+        const handleChange = newValue => {
+          setValue(name, newValue)
+        }
+
         return (
           <TextInput
             name={name}
             defaultValue={defaultValue}
+            onChange={handleChange}
+            onBlur={onBlur}
           />
         )
       }
     }

```

## id

Components now receive id

```diff
     render: {
       component: (props) => {
         const {
+          id,
           name,
         } = props
 
         return (
           <Checkbox
-            id={makeId({ schemaTypeName, name })}
+            id={id}
             name={name}
           />
         )
       }
     }
```

## Controlled

If the skin resolver is declared as controlled, example:

```javascript
  string: {
    controlled: true,
    render: {
      component: ({ id, name, onChange, onBlur, value }) => {
        ...
      }
    }
  },
```

Then `skin[type].render.component` will be rendered with `value` prop updated each time it changes.

## errorText

Instead of an error object skin receives now `errorText` as an already translated string.

```diff
 const ControlAdaptor = ({
   name,
-  errors,
+  errorText,
 }) => {
-  const error = errors[field]
-  const errorText = typeof error == 'object' ? tr(error.message, fieldSchema) : ''

   return <div className="error">{errorText}</div>
 }
```
