export const REMOVE = 'REMOVE'
export const ADD = 'ADD'

export const remove = (idx) => ({
  type: REMOVE,
  idx
})

export const add = () => ({
  type: ADD
})

export const initialEmpty = { last: 0, keys: [] }
export const initial = { last: 1, keys: [0] }

export const initialFromDefault = (defaultValue, initiallyEmpty) => {
  if (defaultValue && Array.isArray(defaultValue)) {
    return {
      last: defaultValue.length,
      keys: defaultValue.map((_, idx) => idx)
    }
  } else {
    return initiallyEmpty ? initialEmpty : initial
  }
}

export const reducer = (state = initial, action) => {
  switch (action.type) {
  case REMOVE:
    const { keys } = state

    return {
      last: state.last,
      keys: [
        ...keys.slice(0, action.idx),
        null,
        ...keys.slice(action.idx + 1)
      ]
    }
  case ADD:
    return {
      last: state.last + 1,
      keys: [ ...state.keys, state.last ]
    }
  default:
    return state
  }
}
