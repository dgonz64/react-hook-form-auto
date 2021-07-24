[![Build Status](https://travis-ci.org/dgonz64/react-hook-form-auto.svg?branch=master)](https://travis-ci.org/dgonz64/react-hook-form-auto)

This library allows your React application to automatically generate forms using [ReactHookForm](https://react-hook-form.com/). The form and validations are generated following a schema inspired by [SimpleSchema](https://github.com/aldeed/simple-schema-js).

## New in 1.3.0

Now works with react-hook-form 7 :baloon:. All the members of the family, like `rhfa-react-native` are updated too. You can update the corresponding one and it should work. If not, please open an issue.

The exception is if you made a skin for your project, then you should follow [this guide](docs/migrate-1.2-to-1.3.md).

## Contents

* [Installation](#installation)
* [Usage](#usage)
  * [1. Write schema](#1-write-schema)
  * [2. Render a form](#2-render-a-form)
  * [3. Make it prettier](#3-make-it-prettier)
  * [4. Translate labels](#4-translate)
* [Available skins](#available-skins)
* [Roadmap](#roadmap)
* [Documentation](#documentation)
  * [Types](#types)
    * [Select and radios](#select-and-radios)
  * [Validators](#validators)
    * [`validate` validator](#the-validate-validator)
  * [Other schema fields](#other-schema-fields)
  * [Schema](#schema)
  * [`Autoform` component](#autoform-component)
  * [Config](#config)
  * [Field props override](#field-props-override)
  * [Coercers](#coercers)
  * [Translation](#translation)
    * [`tr()`](#tr)
    * [`stringExists()`](#stringexists)
    * [Variable substitution](#variable-substitution)
    * [Adding strings](#adding-strings)
    * [Multilanguage](#multilanguage)
    * [Translation utils](#translation-utils)
    * [Use your own](#use-your-own-translation-system)
  * [Extending](#extending)
    * [Extending tutorial](https://github.com/dgonz64/rhfa-playground)
    * [With styles](#with-styles)
    * [Overriding skin](#overriding-skin)
      * [`coerce`](#coerce)
      * [`render`](#render)
        * [object](#render-is-an-object)
        * [function](#render-is-a-function)
        * [`onChange`, `onBlur`](#onchange-and-onblur-in-render)
          * [Directly](#use-it-directly-recommended)
          * [`setValue`](#use-setvalue)
      * [Other skin attributes](#other-skin-block-attributes)
      * [`skin[type].render` props](#skintyperender)
      * [`skin[type].render.component` props](#skintyperendercomponent)
  * [Importing base](#importing-base)

## Play with the demos

* [Emergency styles](https://codesandbox.io/s/rhfa-emergency-6upsj?file=/src/App.js)
* [Bootstrap 4](https://codesandbox.io/s/rhfa-bootstrap-ttbfw?file=/src/App.js)
* [Material-UI](https://codesandbox.io/s/rhfa-material-ui-k9pe9?file=/src/App.js)
* [Blueprint](https://codesandbox.io/s/rhfa-blueprint-l4773?file=/src/App.js)

### Full webpack project demos

* [Play with the bootstrap4 demo](https://dgonz64.github.io/react-hook-form-auto-demo-bootstrap4/demo/). [Project](https://github.com/dgonz64/react-hook-form-auto-demo-bootstrap4).
* [Play with emergency styles demo](https://dgonz64.github.io/react-hook-form-auto-demo/demo). [Project](https://github.com/dgonz64/react-hook-form-auto-demo).
* [Play with Material-UI demo](https://dgonz64.github.io/rhfa-demo-material-ui/demo/). [Project](https://github.com/dgonz64/rhfa-demo-material-ui)
* [React Native](https://github.com/dgonz64/rhfa-demo-react-native)

## Installation

    $ npm install react-hook-form react-hook-form-auto --save

## Deprecated

* 1.3.0 works with react-hook-form 7. If you didn't override the skin, it should work out of the box after update. Please follow [this guide](docs/migrate-1.2-to-1.3.md).
* 1.2.0 works with react-hook-form 6: `npm install react-hook-form@6 react-hook-form-auto@1.2 --save`
* 1.1.0 works with react-hook-form 4 and 5. Older versions of this library (1.0.x) will only work with version 3 of react-hook-form.

## Usage

### 1. Write schema

Write a schema for each model you have:

```javascript
    import { createSchema } from 'react-hook-form-auto'

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

### 3. Make it prettier

#### 3a. Make it less ugly with some styling

Install the emergency styles if you don't want to bundle a whole css library.

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

If you use `sass` you have to make sure you are [not excluding `node_modules`](https://github.com/dgonz64/react-hook-form-auto-demo/commit/94dbe78dc93a4110f915a5809a6880a8c7a55970) in your build process.

If you use `css-modules` you have [better options](https://github.com/dgonz64/rhfa-emergency-styles).

#### 3b. Make it pretty with Bootstrap 4

We can take advantage of the styling strategy and pass bootstrap classes as `styles` props. You can grab them [from here](https://github.com/dgonz64/react-hook-form-auto-demo-bootstrap4/blob/master/src/styles.js) \[[raw](https://raw.githubusercontent.com/dgonz64/react-hook-form-auto-demo-bootstrap4/master/src/styles.js)\]. Then use them:

```javascript
    import styles from './bsStyles'  // copy-pasted styles description

    <Autoform styles={styles} />
```

As you have to pass the styles on every `Autoform` render, I recommend [creating a module](https://github.com/dgonz64/react-hook-form-auto-demo/blob/master/src/components/Autoform.jsx) or a HoC.

Read the [documentation](#documentation) to find out what else you can do.

#### 4. Translate

You probably see labels like `models.client.name` instead of the proper ones. That's because the project uses a built-in translation system. You can setup those strings both at once or incrementally.

Simple call `addTranslations` directly in your module or modules. Example:

```javascript
    import { addTranslations } from 'react-hook-form-auto'

    addTranslations({
      models: {
        client: {
          name: 'Name',
          age: 'Age'
        }
      }
    })
```

A simple way to fill this is by replicating the unstranslated string in the object. The dot is a subobject. In the former example you would see a label called `models.client.name`.

## Available skins

Some of them need other imports. See instructions from each.

### [Vanilla](https://github.com/dgonz64/react-hook-form-auto) (here)
### Bootstrap 4 (as instructed in this document)
### [Material-UI](https://github.com/dgonz64/rhfa-material-ui)
### [Blueprint](https://github.com/dgonz64/rhfa-blueprint)
### [React Native](https://github.com/dgonz64/rhfa-react-native)

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
- [x] Styles to make it look like bootstrap4
- [x] _Native_ components for famous ui libraries like bootstrap4
  - [ ] Need other? Open issue!
- [x] Actually limit children
- [x] React Native support
- [ ] Translated messages from server/async
- [x] Make it compatible with `react-hook-form` 7.

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

The function used to validate the field, as any other validator, can return:

* true to fail (and automatically generate message) or false to pass
* An string that will be the error message

### Other schema fields

There are some other attributes you can pass while defining the field schema:

| Attribute       | Type      | Meaning |
| -----------     | --------  | -------------------------------------------------- |
| noAutocomplete  | boolean   | Inputs (or skin's `render()`) will have `autocomplete=off` to help skip browser's autocomplete |
| addWrapperProps | object    | Directly passed to wrapper component |
| addInputProps   | object    | Props merged into input component |

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
| skin | object | Base skin |
| skinOverride | object | Override some skin components |
| disableCoercing | boolean | Disable all coercing and get values as text |
| noAutocomplete | boolean | Disable all autocompleting by passing `autocomplete=off` to the input or skin's `render()` |

Any other prop will be passed to the skin `render()`.

### Config

The `config` prop is an object that has the following attributes

| Attribute  | Meaning |
| ---------- | ------------------------------------------------------------------- |
| arrayMode  | `'table'` or `'panels'` depending on wanted array field format. `panels` uses card/box/panel wrapping for elements. `table` uses tables (might not fit but if it does is perfect for compact models) |

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

The name can specified without taking into account array ordinals. For example, if a `pet` serves as an schema array for an `owner` and you want to override every pet name from `pets` field (array), you should use `pets.name` as the `name` prop:

```javascript
    <FieldPropsOverride
      name="pets.name"
      ...overrides...
    />
```

It can also be an specific path like `pets[0].name`.

### Coercers

While react-hook-form works with inputs, this library is focused in models. This means:

* Values from inputs are coerced to the datatype you define in the schema.
* Default values are left untouched if there they are not defined or registered.
* You can manually use setValue from your skin or skinOverride.

You can also disable coercers with the `Autoform`'s `disableCoercing` prop.

### Select

Select will include an empty option for uninitialized elements. Please, write an issue if you want this to be configurable.

## Imperative handling

`Autoform` component sets some functions to be used in referenced component:

```javascript
    let formRef

    // Example: imperative submit
    const doSubmit = () => {
      formRef.submit()
    }

    const MyForm = ({ onSubmit }) =>
      <Autoform
        onSubmit={onSubmit}
        ref={e => formRef = e}
      />
```

An object with three attributes is exported:

| Attribute | Description |
| --- | --- |
| submit   | Imperative submit. |
| setValue | Sets a value in any place of the document. You can use a path. As this library coerces values, it's better to use this than the one from react-hook-form to avoid inconsistences. |
| reset    | Resets every field value to initial's. |
| formHook | Call this in order to get react-hook-form vanilla reference object. |

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
| id | <code>string</code> | Identifier in the form 	`key1.key2.key3` |
| vars | <code>object</code> | Object with substitution variables. It will 	substitute ocurrences when string contains this expression: 	`__variable__`. For example the string `"My name is __name__"` with 	`vars = { name: 'David' }` will return `"My name is David"`. 	Keys will be searched by partitioning the path. 	It will get the latest found key if any. For example, given the 	strings `{ "a": { "b": 'Hello' } }` and looking for `'a.b.c'` it will 	return `'a.b'` (`"Hello"`). |


### stringExists
Returns if the string does exist

**Kind**: global function  
**Returns**: <code>boolean</code> - true if it exists  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Identifier |


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

### Translation utils

There are some functions that deal with semantic organization of the translation strings this library uses. You can take advantage of them if you are building a skin:

Multipurpose semantic-ish translation.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| modelName | <code>string</code> | Object name, usually what    you pass as the first parameter when you create    the schema. |
| field | <code>string</code> | Field name |
| op | <code>string</code> | Thing that varies based on    the type. |


Translate field name

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| modelName | <code>string</code> \| <code>object</code> | Object name, usually what    you pass as the first parameter when you create    the schema. It can also be an object with component    props so it will figure out the values |
| field | <code>string</code> | Field name |


Translates error message.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | Code of the error (usually the    validation code-name) |
| data | <code>object</code> | Field configuration from `createSchema()`. |


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

If you just need another appearance, you can do it changing styles. If you are adapting an existing UI library (like [Blueprint](https://blueprintjs.com/)) then it's better to extend skin.

### With styles

The default skin from `react-hook-form-auto` uses css classes. You can override them providing your set. Example with css-modules:

```javascript
    import styles from './my_styles.css'

    <Autoform styles={styles} />
```

The whole [rhfa-emergency-styles](https://github.com/dgonz64/rhfa-emergency-styles) does this and can serve as an example.

### Overriding skin

When you need to adapt behaviour, styles might not be enough. To solve this you can override full components.

The inputs and auxiliary elements are created using a set of components. The mapping can be set all together by overriding the skin, like this:

```javascript
    import { Autoform as RHFAutoform } from 'react-hook-form-auto'

    import overrides from './skinOverride'

    export const Autoform = (props) =>
      <RHFAutoform
        {...props}
        skinOverride={overrides}
      />
```

You can take a look at [defaultSkin.js](https://github.com/dgonz64/react-hook-form-auto/blob/master/src/ui/defaultSkin.jsx) and [`components/index.js`](https://github.com/dgonz64/react-hook-form-auto/tree/master/src/ui/components) from any skin to have a glimpse.

Also find [here](https://github.com/dgonz64/rhfa-material-ui/blob/master/src/skinOverride.js#L56) a full skin override.

I made a tutorial adapting Material-UI to react-hook-form-auto. You can find it [here](https://github.com/dgonz64/rhfa-playground).

### Extension process

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

The attribute `component` is the React component used to render the input inside the wrappers.

```javascript
    select: {
      render: {
        component: Select
      }
    },
```

##### render is an object

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

If the component is a string, like in this example, it will only receive `<input />`-like props, like `name` and `onChange`.

##### render is a function

Function that takes the component's intended props and returns component's final props:

```javascript
    string: {
      render: props => ({
        ...props,
        component: props.fieldSchema.textarea ? 'textarea' : 'input'
      }),
    },
```

#### `onChange` and `onBlur` in render

The `component` in the `render` property is also in charge of the field update: For that matter you have two options

##### Use it directly (recommended)

```javascript
  const Input = ({ name, onChange, onBlur }) =>
    <MyAwesomeWrapping>
      <input name={name} onChange={onChange} onBlur={onBlur} />
    </MyAwesomeWrapping>

  const mySkinOverride = {
    string: {
      render: {
        component: Input
      }
    }
  }
```

##### Use `setValue`

Another way is to use `setValue(name, newValue)` on every change. The component is still uncontrolled but model's value will be updated.

```javascript
  render: ({ name, register, setValue }) => {
    const setValueFromEvent = event => {
      setValue(name, event.target.value)
    }

    return {
      component: <MyComponent {...} onChange={setValueFromEvent} />
    }
  }
```

### Other skin block attributes

```javascript
    range: {
      coerce: value => parseFloat(value),
      controlled: true,
      skipRegister: true,
      nameForErrors: name => `${name}__counter`,
      render: {
        component: 'input',
        type: 'range'
      }
    },
```

| Attribute | Means |
| --------- | ----- |
| `controlled` | Will `useController()`. Render component will receive also `value` prop |
| `skipRegister` | Will not automatically register this field. Hasn't any meaning if `controlled` is `true` |
| `nameForErrors` | Function that receives `name` and returns a transformed name used to navigate through the `errors` object returned from `react-hook-form`'s `useFormState`. Helps to create errors for non registered field like `minChildren` does. |

## Overriding skin

You can override (or add) specific types by using `<Autoform />`'s `skinOverride` prop.

### Avoid `array` and `schema`

Only override `array` and `schema` types if you know `react-hook-form-auto` internals. For example both need `skipRegister`.

### `skin[type].render`

The rest of the properties a skin block can override:

| Prop             |   Type            |  Use |
| ---------------- | ----------------- | ------------------------------------------ |
| `component`      | element           | Component used to render the input |
| `wrapper`        | function          | Override wrapper `skin.defaultWrap` |
| `name`           | string            | (**Must not be changed**) Complete field name (with hierarchy) |
| `field`          | string            | (**Shouldn't be changed**) This field name |
| `option`         | string            | Forces value (used in radios for example ) |
| `inline`         | boolean           | Goes to the wrapper as `inline` |
| `styles`         | object            | Style overriding |
| `fieldSchema`    | object            | Schema specification for the field |
| `schemaTypeName` | string (required) | Name of the schema that contains the field |
| `parent`         | string            | Name of the containing field |
| `config`         | object            | Override config for this input |
| `index`          | number            | Index for arrays |
| `formHook`       | object            | ReacHookForm's register() returned object |
| `autoformProps`  | object            | Properties passed to Autoform |
| `skinElement`    | object            | skin resolver for the type of this field (for example `skin.boolean`) |

### `skin[type].render.component`

The value of this field is used to render the input component. If it's a component, the will receive these props, appart from the rest of the `skin[type].render` block.

| Prop             |   Type   | Use |
| ---------------- | -------- | --------------------------------------------------- |
| `id`             | string     | Id usable to match label in dom  |
| `name`             | string     | Full path name for the `<input />` |
| `type`             | string     | `type` as would be passed to `<input />`  |
| `defaultValue`     | any     | As calculated from initialValues, schema and skin |
| `onChange`     | function     | Should be called back with dom `change` event handler |
| `onBlur`     | function     | Callback for dom `blur` |
| `className`     | function     | Calculated classes |
| `field`     | function     | Relative field name |
| `errorText`     | string     | Validation errors or `''` |
| `fieldSchema`     | object     | Part of the schema that refers to this field |
| `formHook`     | object     | As returned from the `useForm()` call |
| `styles`     | object     | All the styles in case you do class styling |
| `skinElement`    | object     | Complete skin block specific to this type of field (for example `skin.number`) |
| `value`     | any     | Only for controlled types (`skin[type].controlled == true`) |
| ...          | any         | ...any other prop added in schema with `addInputProps` |

### `InputWrap`

It's a common component used to create all the input structure, including wrappers. You can use it to avoid boilerplate.

| Prop             |   Type   | Use |
| ---------------- | -------- | --------------------------------------------------- |
| `children`       | element     | (optional) You can use InputWrap to... wrap. |
| `id`             | string     | id for the `for` attribute of the label |
| `name`           | string   | Full name (with hierarchy) |
| `schemaTypeName` | string   | Name of the schema as created |
| `styles`         | object   | Styles |
| `labelOverride`  | string   | Label overriding |
| `inline`         | boolean  | Will omit label |
| `errorText`      | string   | Validation error |

The props for the input component are different depending if the `inputComponent` is a string, like `'input'` or a React component.

#### Native component (ie. `'input'`)

For a 'lowercase' component like `<input />`, props passed are

* id
* name
* type
* option (if provided, for the value)
* defaultValue
* onChange
* onBlur
* className calculated
* ...any fields added to schema's `addInputProps`

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


## Importing base

You can use the base bundle to import `AutoformBase` component. `AutoformBase` is like `Autoform` but doesn't use `react-dom` dependency.

```javascript
  import { Autoform, ... } from 'react-hook-form-auto/dist/base.js'
```

You can also do it in a more permanent way if you use webpack:

```javascript
  resolve: {
    alias: {
      'react-hook-form-auto': 'react-hook-form-auto/dist/base.js'
    }
  },
```

# Help wanted / contribute

react-hook-form-auto needs your help. Skins must be written!

### Where to begin

Make a fork and do your magic followed by a [pull request](https://help.github.com/articles/about-pull-requests/). If it's an implementation, test case and documentation update would be highly appreciated.

### Some code pointers

Everything is work in progress until there's a bunch of skins or we are in complete control of the world, whichever comes first.

The most important files:

* `src/ui/components/componentRender.jsx` processes the schema to build the inputs and allows skin overrides
* `src/ui/Autoform.jsx` The component and the coercing logic
* `src/ui/AutofieldContainer.jsx` Registers or calls `useController()`
* `src/ui/Autofield.jsx` Wraps component within wrapper
* `jsdoc2md/README.hbs` Documentation source

See also the [contributing doc](https://github.com/dgonz64/react-hook-form-auto/blob/master/CONTRIBUTING.md).
