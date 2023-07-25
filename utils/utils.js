/**
 * Adds https:// to a provided URL if it's missing.
 * @param {string} url The URL string to check against.
 * @returns The url string with https:// prepended if applicable.
 */
const prependProtocol = (url) => {
  url = decodeURIComponent(url)
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "https://" + url
  }
  return url
}
