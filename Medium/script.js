// ==UserScript==
// @name         Medium Auto Redirect
// @version      0.0.3
// @description  Redirects based on predefined conditions
// @author       Nathan Price
// @license      GPL-3.0
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getResourceText
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medium.com
// @homepageURL  https://github.com/gravityfargo/TamperMonkeyScripts
// @downloadURL  https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/Medium/script.js
// @updateURL    https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/Medium/script.js
// @supportURL   https://github.com/gravityfargo/TamperMonkeyScripts/issues
// @resource     mediumDomainList https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/Medium/domainlist.json
// ==/UserScript==

const windowLocationHost = unsafeWindow.location.host
const windowLocationHref = unsafeWindow.location.href
const mediumDomainList = JSON.parse(GM_getResourceText('mediumDomainList'))

function checkMediumMetaAndroidUrl () {
  const metaTag = document.head?.querySelector('meta[property="al:android:url"]')
  return metaTag?.content?.includes('medium://p/')
}

function checkMediumMetaOgType () {
  const metaTag = document.head?.querySelector('meta[property="og:type"]')
  return metaTag?.content?.includes('article')
}

function pushFreediumURL () {
  unsafeWindow.location.href = 'https://freedium.cfd/' + windowLocationHref
}

function checkDomain () {
  // If medium.com in the URL no regex
  if (windowLocationHost.includes('medium.com')) {
    // Check if an article
    if (checkMediumMetaOgType()) {
      pushFreediumURL()
      return
    }
    return
  }

  // If the Android meta URL is a medium:// URL
  if (checkMediumMetaAndroidUrl()) {
    if (checkMediumMetaOgType()) {
      pushFreediumURL()
      return
    }
    return
  }

  // Otherwise, check if the current domain is in the list
  if (mediumDomainList.includes(windowLocationHost)) {
    if (checkMediumMetaOgType()) {
      pushFreediumURL()
    }
  }
}

checkDomain()
