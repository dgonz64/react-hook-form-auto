[![Build Status](https://travis-ci.org/dgonz64/react-hook-form-auto.svg?branch=master)](https://travis-ci.org/dgonz64/react-hook-form-auto)

This library allows your React application to automatically generate forms using [ReactHookForm](https://react-hook-form.com/). The form and validations are generated following a schema inspired by [SimpleSchema](https://github.com/aldeed/simple-schema-js).

## [Play with the demo](https://dgonz64.github.io/react-hook-form-auto-demo/demo)

## Installation

    $ npm install react-hook-form react-hook-form-auto --save

## Usage

### 1. Write schema

Write a schema for each model you have:

```javascript
    import { createSchema } from 'react-hook-form'

    export const client = createSchema('client', {
      name: {
        type: 'string',
        required: true,
        max: 32
      },
      age: {
        type: 'number'
      }
    })
```

In this example we are stating that a `client` is required to have a `name` and providing its allowed length. Also `client` has `age` and it's a number.

### 2. Render a form

`<Autoform />` React component will generate inputs including translatable label, proper input types and error messages.

```javascript
    import { Autoform } from 'react-hook-form-auto'
    import { client } from './models/client'

    const MyForm = ({ onSubmit }) =>
      <Autoform
        schema={client}
        onSubmit={onSubmit}
      />
```

Form will be validated following the rules set by the schema.

It also allows you to build arrays from other schemas. Simply specify the other schema within brackets `[<other>]`. `Autoform` default skin will allow you to add and remove elements.

```javascript
    import { createSchema } from 'react-hook-form-auto'
    import { client } from './client'

    export const company = createSchema('company', {
      clients: {
        type: [client],
        minChildren: 10
      }
    })
```

#### 3. Make it less ugly

Install the emergency styles

    $ npm install rhfa-emergency-styles --save

Then set the `styles` prop of `<Autoform />`:

```javascript
    import styles from 'rhfa-emergency-styles'
 
    // With sass...
    import 'rhfa-emergency-styles/prefixed.sass'
    // ...or without
    import 'rhfa-emergency-styles/dist/styles.css'
 
    <Autoform styles={styles} />
```

If you use `css-modules` you have [better options](https://github.com/dgonz64/rhfa-emergency-styles).

Read the [documentation](#documentation-1) to find out what else you can do.

## Rationale

One of the purposes of the library is to avoid repeating code by not having to write a set of input components for every entity. Also when time is of the essence, writing forms can be exasperating.

These are some of the advantages of using an automatic form system.

* More [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
* More [SSoT](https://en.wikipedia.org/wiki/Single_source_of_truth)
* *...so less bugs*

Also react-hook-form-auto has some of its own

* Includes a translation system
* It's easily expandable
* It's simple
* When possible tries to use [convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration)

# Roadmap

Actually there aren't clearly defined goals. The library already suits my personal needs. Do you need anything that is not there? Feel free to write an issue! Those are the tasks I think may be interesting and will randomly work on them:

- [x] Automatic form generation
- [x] Able to stylize components
- [x] Datatype coertion
- [x] Provide more and better styling examples
- [ ] Styles to make it look like bootstrap4
- [ ] _Native_ components for famous ui libraries like bootstrap4
- [ ] Translated messages from server/async
- [ ] Actually limit children
- [ ] Typescript

# Documentation

## Types

Each schema can be regarded as a Rails model or a database table. You can store them anywhere, for example in a module:

```javascript
    import { createSchema } from 'react-hook-form-auto'

    export const computer = createSchema('computers', { /* ...schema... */ })
```

Each first level entry in the schema object represents the fields in the form or the columns in the database analogy. To configure the field you use another object. Example:

```javascript
    {
      name: { type: 'string' }
    }
```

These are the types a field can be:

| Type       | Valid when...            | Input control                 |
| ---------- | ------------------------ | ----------------------------- | 
| string     | Value is a string        | `<input type="text" />`       |
| number     | Value is a number        | `<input type="number" />`     |
| range      | Between two numbers      | `<input type="range" />`      |
| [\<schema\>] | Each array item is valid | Renders as array              |
| \<schema\>   | Value follows schema     | Renders as submodel           |
| select     | Value belongs to set     | `<select />`                  |
| radios     | Value belongs to set     | `<Radio />`                   |
| boolean    | Value is boolean         | `<input type="checkbox />`    |
| password   | Value is a string        | `<input type="password" />`   |

You can specify the type as a constructor. There's not an easily measurable advantage. Example:

```javascript
    { type: String }
```

#### select and radios

They both allow options as an array that can be one of strings with the options keys that will be feed to translator using `trModel()` or can be objects in the form `{ value, label }`. If an object is provided, label will be used for the HTML content (display) and value for the option's value.

Options can also be a function. In that case it will be evaluated with the component props as the first argument. The results used as explained above, that is, array of strings or objects.

Example with keys:

```javascript
    {
      type: 'select',
      options: ['red', 'blue']
    }
```

Example with objects:

```javascript
    {
      type: 'select',
      options: [
        { value: 'r', label: 'red' },
        { value: 'b', label: 'blue' }
      ]
    }
```

Example with function. This example assumes `Autoform` component has a color collection in the props:

```javascript
    {
      type: 'select',
      options: props => props.colors.map(color => ({
        value: color.id,
        label: color.name
      }))
    }
```

### Validators

| Validation  | Type     | Meaning | Error string ID |
| ----------- | -------- | -------------------------------------------------- | --- |
| minChildren | number   | Minimum amount of children an array field can have | `error.minChildren` |
| maxChildren | number   | Maximum amount of children an array field can have | `error.maxChildren` |
| min         | number   | Minimum value | `error.min` |
| max         | number   | Maximum value | `error.min` |
| required    | boolean  | The value can't be empty or undefined | `error.required` |
| validate    | function | Function that takes the value and entry and returns validity | |
| pattern     | regex    | Regex. The value matches the regex | |

The string returned will be translated. The translation will receive the field's schema as [variables](#variable-substitution).

### The `validate` validator

The function used to validate the field, as any other validator, can return

* true to fail (and automatically generate message) or false to pass
* An string that will be the error message

### Schema

The schema establishes the validation and inputs. The instance can be stored anywhere, like your own model object or a module. At the moment it doesn't change over time.

### createSchema
Creates a Schema from the specification.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| typeName | <code>string</code> | Name of the model being created.    It can be chosen freely. |
| schema | <code>object</code> | Schema specification. |


### Autoform component

The `<Autoform />` component accepts the following props

| Prop        | Type            | Meaning |
| ----------- | --------------- | ------------------------------------------------------ |
| schema      | Schema instance | Schema used to build the form |
| elementProps | object | Props extended in all the inputs |
| initialValues | object | Initial values |
| children | element | Whatever you want to put inside the form |
| onSubmit    | function        | (optional) Code called when submitting |
| onErrors    | function        | (optional) Code called when form has errors |
| styles    | object | Styles used by the defaultSkin |
| submitButton | boolean | (optional) Include submit button |
| submitButtonText | element | (optional) Contents for the submit button |
| skin | object | Base skin. |
| skinOverride | object | Override some skin components |
| disableCoercing | boolean | Disable all coercing. Get values as text. |

### Config

The `config` prop is an object that has the following attributes

| Attribute  | Meaning |
| ---------- | ------------------------------------------------------------------- |
| arrayMode  | `'table'` or `'panels'` depending on wanted array field format. |

### Field props override

You can override field props individually. You can do this with a component called `FieldPropsOverride`. This is useful when you want to create an special field with some functionality that forces you to provide an event handler. Let's see an example:

```javascript
    import { Autoform, FieldPropsOverride } from 'react-hook-form-auto'

    const Component = ({ onKeyDown }) =>
      <Autoform schema={client}>
        <FieldPropsOverride
          name="name"
          onKeyDown={onKeyDown}
        />
      </Autoform>
```

The name should specify the path without taking into account array order. For example, if a `pet` serves as an schema array for an `owner` and you want to override every pet name from `pets` field (array), you should use `pets.name` as the `name` prop:

```javascript
    <FieldPropsOverride
      name="pets.name"
      ...overrides...
    />
```

### Coercers

While react-hook-form works with inputs, this library is focused in models. This means:

* Values from inputs are coerced to the datatype you define in the schema.
* Default values are left untouched if there they are not defined or registered.
* You can manually use setValue from your skin or skinOverride.

You can also disable coercers with the `Autoform`'s `disableCoercing` prop.

### Select

By default select will include an empty option for new elements

## Translation

react-hook-form-auto uses internally a simple better-than-nothing built-in translation system. This system and its translation tables can be replaced and even completely overridden.

The translation strings are hierarchized following some pseudo-semantic rules:

```javascript
    `models.${model}.${field}.${misc}`
```

The meaning of the last `misc` part usually depends on the type of field.

The dots navigates through children in the string table. Example:

```javascript
    {
      models: {
        computer: {
          cpu: { 
            arm: 'ARM',
            // ...
          },
          // ...
        }
      }
    }
```

To translate string for your use call `tr()` and pass the string path separated by dots:

```javascript
    import { tr } from 'react-hook-form-auto

    const message = tr('models.computers.cpu.arm')

    /* message value is 'ARM' */
```

This is the usage of the `tr()` function:

### tr
Translates a string given its id.

**Kind**: global function  
**Returns**: Translated string  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Identifier in the form 	key1.key2.key3 |
| vars | <code>object</code> | Object with substitution variables. It will 	substitute ocurrences when string contains this expression: 	__variable__. For example the string "My name is __name__" with 	vars = { name: 'David' } will return "My name is David". 	Keys will be searched by partitioning the 'path'. 	It will get the latest found key if any. For example, given the 	strings { "a": { "b": 'Hello' } } and looking for 'a.b.c' it will 	return 'a.b' ("Hello"). |


### Variable substitution

You can also put variables in the translation strings:

```javascript
    {
      name: {
        create: '__name__ created'
      }
    }
```

This allows you to translate and inserting a value in the correct place of the string. Example:

```javascript
    import { tr } from 'react-hook-form-auto'

    const name = 'Alice'
    const message = tr('name.create', { name })

    /* message value is 'Alice created' */
```

### Adding strings

```javascript
    import { addTranslations } from 'react-hook-form-auto'
```

Then you call addTranslations with the object tree:

### addTranslations
Appends translations to current translation table

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| lang | <code>object</code> | Translations merged into current. |


It's ok to overwrite a language with another. The non translated strings from the new language will remain from the former in the table. At the moment it's up to you to take care about language completeness (or, better, use an external translator).

### Multilanguage

If your application has more than one language and it can be changed on the fly, I better recommend to use translation utils over the core translations. Those functions store the languages separately:

```javascript
    import { setLanguageByName } from 'react-hook-form-auto'

    setLanguageByName('en')
```

### Use your own translation system

You can disable the translation system to use your own.

### setTranslator
Sets the translation engine that responds to tr().

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| translate | <code>function</code> | Function with signature 	translate(id, params). |


Example:

```javascript
    import { setTranslator } from 'react-hook-form-auto'
    import { myTranslationTranslator } from './serious_translator'

    setTranslator((tr, data) => {
      /* do something with tr or data */

      return myTranslationTranslator(something, somethingElse)
    })
```

Or you can drop it directly to `setTranslator()` if it's compatible.

## Extending

### Creating a skin

The inputs and auxiliary elements are created using a set of components. The mapping can be set all together by overriding the skin.

You can take a look at [defaultSkin.js](https://github.com/dgonz64/react-hook-form-auto/blob/master/src/ui/defaultSkin.jsx) and [`components/index.js`](https://github.com/dgonz64/react-hook-form-auto/tree/master/src/ui/components) from any skin to have a glimpse.

There's an entry in the skin object for every field type. The value of the entry is an object with two attributes like in this example:

```javascript
    number: {
      coerce: value => parseFloat(value),
      render: {
        component: 'input',
        type: 'number'
      }
    },
```

#### coerce

Function that converts result to its correct datatype.

#### render

Properties for the rendered component.

The attribute `component` is the React component used to render the whole HTML for the input, including label and any other wrappers.

```javascript
    select: {
      render: {
        component: Select
      }
    },
```

The `component` property is also in charge of the field connection with register.

The `render` property can be an object or a function

##### Object

Props merged to component's default:

```javascript
    range: {
      coerce: value => parseFloat(value),
      render: {
        component: 'input',
        type: 'range'
      }
    },
```

##### Function

Function that takes the component's intended props and returns component's final props:

```javascript
    string: {
      render: props => ({
        ...props,
        component: props.fieldSchema.textarea ? 'textarea' : 'input'
      }),
    },
```

## Overriding

You can override (or add) specific types by using `<Autoform />`'s `skinOverride` prop.

### Skin component

The rest of the properties a skin block can override:

| Prop             |   Type            |  Use |
| ---------------- | ----------------- | ------------------------------------------ |
| `component`      | element           | Component used to render the input |
| `wrapper`        | function          | Override wrapper `skin.defaultWrap` |
| `name`           | string            | Complete field name (with hierarchy) |
| `field`          | string            | This field name |
| `option`         | string            | Forces value (used in radios for example ) |
| `inline`         | boolean           | Goes to the wrapper as `inline` |
| `register`       | function          | ReactHookForm's register |
| `styles`         | object            | Style overriding |
| `fieldSchema`    | object            | Schema specification for the field |
| `schemaTypeName` | string (required) | Name of the schema that contains the field |
| `parent`         | string            | Name of the containing field |
| `config`         | object            | Override config for this input |
| `index`          | number            | Name for arrays |
| `errors`         | object            | Validation error overriding |

There are also other props passed depending on current implementation of `renderInput`, the function in charge of choosing the component and render it.

### InputWrap

It's a common component used to create all the input structure, including wrappers. You can use it to avoid boilerplate.

| Prop             |   Type   | Use |
| ---------------- | -------- | --------------------------------------------------- |
| `children`       | element     | (optional) You can use InputWrap to... wrap. |
| `name`           | string   | Full name (with hierarchy) |
| `field`          | element  | Field name |
| `schemaTypeName` | string   | Name of the schema as created |
| `styles`         | object   | Styles |
| `labelOverride`  | string   | Label overriding |
| `errors`         | object   | Validation errors |

The props for the input component are different depending if the `inputComponent` is a string, like `'input'` or a React component.

#### Native component (ie. `'input'`)

For a 'lowercase' component like `<input />`, props passed are

* name
* type
* option (if provided, for the value)
* defaultValue

#### Class component (ie. `MySlider`)

Class components receive all the provided or derived props.

### Rendering

To render the input or inputs, two functions are used:

### renderInputs
Renders the inputs to make the schema work.

**Kind**: global function  
**Returns**: <code>array</code> - React elements with the form and inputs.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> |  |
| params.schema | <code>Schema</code> | Schema instance |
| params.config | <code>object</code> | Rendering configuration |
| params.config.arrayMode | <code>string</code> | 'panels' or 'table' |
| ...params.rest | <code>object</code> | Props passed to every input |


### renderInput
Renders a single field.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> |  |
| params.field | <code>string</code> | Name of the field |
| params.fieldSchema | <code>object</code> | Schema specification    for the field |
| params.parent | <code>string</code> | Prefix of the field name |
| params.schemaTypeName | <code>string</code> | Name of the schema    (first argument while instantiating a schema) |
| params.config | <code>object</code> | Form configuration |
| ...params.rest | <code>object</code> | props passed to the component |


# Help wanted / contribute

react-hook-form-auto needs your help. Skins must be written!

### Where to begin

Make a fork and do your magic followed by a [pull request](https://help.github.com/articles/about-pull-requests/). If it's an implementation, test case and documentation update wold be highly appreciated.

### Some code pointers

Everything is work in progress until there's a bunch of skins or we are in complete control of the world, whichever comes first.

The most important files:

* `src/ui/components/componentRender.jsx` processes the schema to build the inputs and allows skin overrides
* `src/ui/Autoform.jsx` The component and the coercing logic
* `jsdoc2md/README.hbs` Documentation source

See also the [contributing doc](https://github.com/dgonz64/react-hook-form-auto/blob/master/CONTRIBUTING.md).