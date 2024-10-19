/**
 * Adds https:// to a provided URL if it's missing.
 * @param {string} url The URL string to check against.
 * @returns The url string with https:// prepended if applicable.
 */
export const prependProtocol = (url) => {
  url = decodeURIComponent(url)
  url = url.replace(/^www\./, "")
  if (/^https:\/\/www\./.test(url)) {
    url = url.replace(/^https:\/\/www\./, "https://")
  }
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "https://" + url
  }
  return url
}
