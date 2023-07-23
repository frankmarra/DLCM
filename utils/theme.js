export const setInitialTheme = `
function getUserPreference() {
  if (window.localStorage.getItem('theme')) {
    return window.localStorage.getItem('theme')
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
}
document.documentElement.dataset.theme = getUserPreference();
`
