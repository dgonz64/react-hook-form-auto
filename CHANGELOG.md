# Changelog

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
