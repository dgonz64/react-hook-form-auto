import {
  tr,
  setLanguage,
  addTranslations
} from '../src/translate'

setLanguage({
  single: 'single value',
  variable: 'test __value__',
  reference: 'test @@ref@@',
  ref: 'reference',
  subkey: {
    _: 'root value',
    sub1: 'sub1'
  }
})

addTranslations({
  added: 'added string'
})

test('Finds string given its id', () => {
  const str = tr('single')
  expect(str).toEqual('single value')
})

test('Substitutes variable given its id and data', () => {
  const str = tr('variable', { value: 'variable' })
  expect(str).toEqual('test variable')
})

test('Finds referenced', () => {
  const str = tr('reference')
  expect(str).toEqual('test reference')
})

test('Finds key when there is no leaf', () => {
  const str = tr('single.user')
  expect(str).toEqual('single value')
})

test('Finds subkey', () => {
  const str = tr('subkey.sub1')
  expect(str).toEqual('sub1')
})

test('Finds subkey when there is no leaf but subkey has root value', () => {
  const str = tr('subkey.sub2')
  expect(str).toEqual('root value')
})

test('Returns string as is when there is no variable (for compatibility)', () => {
  const str = tr('variable')
  expect(str).toEqual('test __value__')
})

test('Returns id when string is not found', () => {
  const str = tr('some stuff')
  expect(str).toEqual('some stuff')
})

test('Returns added translations', () => {
  const str = tr('added')
  expect(str).toEqual('added string')
})
