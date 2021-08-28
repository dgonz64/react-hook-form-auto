# Schema's onChange

Now schemas can make the form react to changes. To acomplish that you need to set `onChange` accordingly.

It's done by intercepting both `onChange` and `setValue`.

Consider this example:

```javascript
const pet = createSchema('pet', {
  name: {
    type: String,
    required: true,
    maxLength: 8
  },
  heads: {
    type: Number,
    onChange: (value, { arrayControl }) => {
      if (value == '42')
        arrayControl.add()
      if (value == '13')
        arrayControl.remove(arrayControl.index)
    },
    helperText: 'Enter 42 to add and 13 to remove'
  },
  hair: {
    type: 'select',
    options: ['blue', 'yellow'],
    onChange: (value, { name, setHelperText }) => {
      setHelperText(name, `Better not choose ${value}`)
    }
  },
});

return createSchema('owner', {
  name: {
    type: 'string',
    required: true,
  },
  height: {
    type: 'radios',
    options: ['tall', 'short'],
    onChange: (value, { setValue }) => {
      if (value == 'tall')
        setValue('name', 'André the Giant')
    }
  },
  usesHat: {
    type: 'boolean',
    onChange: (value, { setVisible }) => {
      setVisible('hatColor', value)
    }
  },
  hatColor: {
    type: 'select',
    options: ['black', 'red'],
    initiallyVisible: false
  },
  pets: {
    type: [pet],
    minChildren: 1,
    maxChildren: 2
  }
});
```

You can copy and paste it directly in [the demo](https://dgonz64.github.io/react-hook-form-auto-demo/demo/). You will be able to:

* Automatically set owner's name when you set tall as height
* Show an extra field when owner wears hat
* Add pets when one pet has 42 heads
* Remove pet when it has 13 heads
* Receive conflicting advice when selecting pet hair color

# API

Schema's `onChange` receives the following arguments:

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | New plain value already set for the field the schema refers to |
| context | <code>object</code> | Utilities to change state |

# `context`

The `context` has information and allows you to operate fields. It's done with a rudimentary pub-sub system, so only the affected field is updated. It has the following attributes:

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Full field path. Name compatible with all the utilities |
| setVisible | <code>function</code> | `setVisible(name, visible)` changes the visibility of the field |
| setHelperText | <code>function</code> | `setHelperText(name, text)` changes the text that appears below the field |
| formHook | <code>object</code> | As returned by [React Hook Form `useForm`](https://react-hook-form.com/api/useform) (`register`, `unregister`, etc) |
| setValue | <code>function</code> | `setValue(name, value)` Sets the value of the field |
| arrayControl | <code>object</code> | Utilities to change array in the case the field is an array |

With `formHook` you can, for example, create errors:

```javascript
const owner = createSchema('owner', {
  name: {
    // ...
    onChange: (value, { formHook }) => {
      if (value == 'errorsy') {
        formHook.setError('height', {
          type: 'focus',
          message: 'Something something error'
        })
      }
    }
  }
})
```

## `arrayControl`

If the field is an array, `arrayControl` has the following attributes

| Param | Type | Description |
| --- | --- | --- |
| items | <code>array</code> | Items state |
| index | <code>number</code> | Index of the current field |
| remove | <code>function</code> | `remove(index)` removes element with index `index` |
| add | <code>function</code> | Adds a new element to the array |
