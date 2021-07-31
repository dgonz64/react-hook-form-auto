# Changelog

## 1.3.2

### Added

* Tests for schema `onChange`
* Talk about creating errors with `onChange` and test it
* The helper text is specified with `setHelperText` from `onChange`, then schema `helperText` then model translated string `models.<schema>.<field>._helper` then blank.

### Changed

* `FieldPropsOverride`'s `onChange` now works like schema's and receives [form control context](https://github.com/dgonz64/react-hook-form-auto/blob/master/docs/schema-onchange.md#context).

### Fixed

* Select type schema `onChange` value passing corrected
* More resilient way to create autofield state control

## 1.3.1

### Fixed

* Stop ignoring `dist` folder

## 1.3.0

### Added

* Compatibility with react-hook-form 7
* [Guide for skin migrations](docs/migrate-1.2-to-1.3.md)
* Inputs are bound individually to errors. That reduces whole form re-renders.
* EXPERIMENTAL: Allows field value reaction with `onChange` in the schema definition. [Documentation](docs/schema-onchange.md)
* Schemas can set a helper text for the field with `helperText`
* (skins) `react-hook-form-auto` now takes care of register and not the skin. The skin will receive `onChange` and `onBlur`
* (skins) Can take care of the logic for controlled components. Just add `controlled: true` to your skin entry and the skin component will receive also `value`.
* (skins) Can choose a name for error field with `nameForErrors` skin attribute

### Changed

* `onErrors` prop of `Autoform` is only called in submit
* label's `for` and field's `id` now include the schema name in order to avoid potential collisions
* `InputWrap` is now in charge of `array` type error display
* Skin documentation was updated
* (skins) `errors` are now only one and it's a string called `errorText`.
* (skins) `array` the fields now unregister removed subobjects
* (internal) `objectTraverse` now supports `returnValue` option that returns the value instead of its context
* (internal) Tests updated for the new DOM layout
* (internal) `componentRender` refactor, separated to `componentRender`, `AutofieldContainer` and `AutoField`
* (internal, important for tests) field names follow the new `react-hook-form` dotted syntax. You can continue to use the bracked syntax in `FieldPropsOverride` for example.
* (internal) `coerceRef` becomes `stateRef` and holds state, not only value. Also its keys are now paths instead of a fully structured doc.

### Fixed

* Make clear in docs that you need version 6 of `react-hook-form` for older versions of this library in the deprecation section
* Uncontrolled components with only update individually when there are errors instead of rendering the whole tree
* `array` type component now unregister

### Removed

* Removed typescript from project roadmap. Pull requests are welcome.

## 1.2.11

### Added

* React 7 support

### Fixed

* Updated some modules for security
* Removed unneeded field triggers

## 1.2.10

### Fixed

* Fixed FieldPropsOverride overriding everything

## 1.2.9

### Fixed

* Fixed FieldPropsOverride identification after minification

## 1.2.8

### Added

* You can affect whole array fields with a more semantic `FieldPropsOverride` name.

## 1.2.7

### Added

* Actual example as to how to specify skin overrides.
* Update React Native status.
* Pass overrides also separately in the `overrides` prop.

### Fixed

* Some security concerns

## 1.2.6

### Added

* Now passing `styles` to `addGlyph` and `removeGlyph` skin components.
* Talk about React Native project.

## 1.2.5

### Added

* Validation rules are passed to skin component in order to help with `<Controller />`.
* Instance method `reset()` that works with `<Controller />`.

### Fixed

* Now exporting render functions. Rarely needed but documented.
* (Internal) Moved `trPath()` to `translation_utils.js`.

## 1.2.4

### Added

* Exporting AutoformBase to allow for more generic skins: Library is now compatible with ReactNative.
* Every component is now configurable.

## 1.2.3

### Added

* Some basic error messages on obvious things that we programmers usually forget, like not passing a `schema`.
* Implemented minChildren and maxChildren

### Fixed

* Forgot to talk about blueprint ui in README
* Actually export `InputWrap` as documentation refers to it.
* Array children now receive validation errors correctly.

## 1.2.2

### Added

* Now you can control autocomplete="off" from Autoform (general) and schema (individual)  see README.md
* You can call `stringExists(id)` to see if it exists
* Be able to pass any prop from schema to wrapper and input
* Talk about brand new blueprintjs skin

### Changed

* The X symbol has been removed from the errored input

## 1.2.1

* Fixing package.lock

## 1.2.0

### Added

* Allow wrapper to be specified also per component type in skin

### Changed

* Updated dependencies
* Using ReactHookForm 6
* defaultValue is calculated before skinning and not after
* Slightly better required string

### Fixed

* Better boolean result for boolean fields
* minimist security concern
* acorn security concern
* Updated docs with sandbox demos

## 1.1.2

### Changed

* `register` will be passed to skin components with validation already set up
* Documented the way to use `register` in skins

## 1.1.1

### Added

* Error translation moved to translation_utils.js
* Export more functions to help constructing skins
* trField to translate field names
* Allow processOptions to manage with standard control props
* Allow button and form skinage
* Pass submit to the form button onClick in order to facilitate imperative use
* Added more components to skin to allow easier and more granular skinage

### Fixed

* Integrate all README changes into generator (jsdoc2md/README.hbs) that were put in the README by mistake.
* Incorrect translations for min, max, minLength and maxLength

## 1.1.0

### Added

* You can change document values outside of Autoform
* Documentation about Autoform's ref
* Passing ReacHookForm's formHook to form components
* Components get autoform props in autoformProps prop
* Components get information about their place in arrays
* Works with ReactHookForm 4

## 1.0.3 (12/11/2019)

### Fixed

* Fixed checkboxes
* Some documentation formating concerning translations

### Added

* Tests for more components in the submit test

## 1.0.2 (26/10/2019)

### Added

* Add and remove items from arrays is done with svg now
* Sample and documentation for styling with Bootstrap 4

## 1.0.1 (14/10/2019)

### Updated

* Better documentation concerning styles

## 1.0.0 (13/10/2019)

Initial! :metal:
