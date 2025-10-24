export const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('projectAlphaState', JSON.stringify(state))
  } catch (e) {
    console.warn('localStorage save failed:', e)
  }
}

export const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('projectAlphaState')
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (e) {
    console.warn('localStorage load failed:', e)
    return undefined
  }
}