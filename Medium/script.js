// ==UserScript==
// @name         Medium Auto Redirect
// @version      2024-10-17
// @description  Redirects based on predefined conditions
// @author       Nathan Price
// @license      GPL-3.0
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getResourceText
// @homepageURL  https://github.com/gravityfargo/TamperMonkeyScripts
// @downloadURL  https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/Medium/script.js
// @supportURL   https://github.com/gravityfargo/TamperMonkeyScripts/issues
// @resource     mediumDomainList https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/Medium/domainlist.json
// ==/UserScript==

const windowLocationHost = unsafeWindow.location.host
const windowLocationHref = unsafeWindow.location.href
const mediumDomainList = JSON.parse(GM_getResourceText('mediumDomainList'))

function checkMediumMetaProperty () {
  const metaTag = document.head?.querySelector('meta[property="al:android:url"]')
  return metaTag?.content?.includes('medium://p/')
}

function pushFreediumURL () {
  unsafeWindow.location.href = 'https://freedium.cfd/' + windowLocationHref
}

function checkDomain () {
  // check medium.com in the URL no regex
  if (windowLocationHost.includes('medium.com')) {
    pushFreediumURL()
    return
  }

  // If meta property matches, redirect
  if (checkMediumMetaProperty()) {
    pushFreediumURL()
    return
  }

  // Otherwise, check if the current domain is in the list
  if (mediumDomainList.includes(windowLocationHost)) {
    pushFreediumURL()
  }
}

checkDomain()
