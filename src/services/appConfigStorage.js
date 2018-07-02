const localStorage = window.localStorage
const hasLocalStorage = !!localStorage
export function set (params) {
  if (hasLocalStorage) localStorage.setItem('config', JSON.stringify(params))
}

export function get () {
  if (!hasLocalStorage) return {}
  let configData = {}
  try {
    configData = JSON.parse(window.localStorage.getItem('config') || '{}')
  } catch (e) {}
  return configData
}
