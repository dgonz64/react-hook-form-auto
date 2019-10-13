export const createSubmitMocks = () => {
  let doSubmit
  const wasSubmitted = new Promise((resolve, reject) => {
    doSubmit = resolve 
  })
  const mockSubmit = jest.fn(() => {
    doSubmit()
  })

  return { wasSubmitted, mockSubmit }
}
