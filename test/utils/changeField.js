// input.props() would be the closest to input attributes,
// that doesn't seem to be in the simulated input.instance()


export function changeInput(input, value) {
  // FIXME I don't know why I do this, but it looks
  // like input.simulate() is not updating dom as a
  // browser would do or there's something I don't
  // understand
  input.instance().value = value

  return input.simulate('change', {
    target: {
      ...input.props(),
      value
    }
  })
}

export const changeSelect = changeInput

export const changeCheckbox = changeInput
