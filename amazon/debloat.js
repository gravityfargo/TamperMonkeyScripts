// ==UserScript==
// @name         Gravityfargo's Amazon Script
// @namespace    Violentmonkey Scripts
// @version      0.0.3
// @description  Debloat Amazon.com
// @author       Nathan Price
// @license      GPL-3.0
// @run-at       document-start
// @require      https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/GLOBAL/functions.js
// @homepageURL  https://github.com/gravityfargo/TamperMonkeyScripts
// @supportURL   https://github.com/gravityfargo/TamperMonkeyScripts/issues
// @downloadURL  https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/amazon/debloat.js
// @updateURL    https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/amazon/debloat.js
// @match       *://*.amazon.com/*
// @match       *://amazon.com/*
// ==/UserScript==

function runForHead (element) {
  console.log('>>> runForHead <<<')
  querySelectorAllDelete('noscript', element)

  const scripts = element.querySelectorAll('script')
  const srcStubs = ['APE-SafeFrame', 'apesafeframe', 'forensics-incremental.min.js']
  removeIfAttributeIncludes(scripts, 'src', srcStubs)

  const contentStubs = ['window.grandprix', 'APE-SafeFrame', 'apesafeframe', 'AmazonNavigationRufusCard', 'eel.SponsoredProductsEventTracking.prod', 'forensics-incremental.min.js']
  removeIfAttributeIncludes(scripts, 'innerHTML', contentStubs)
}

function runForBody (element, mutations) {
  console.log('>>> runForBody <<<')
  querySelectorAllDelete('noscript', element)
  querySelectorAllDelete('iframe', element)
}

function monitorBody () {
  querySelectorDelete('#nav-swmslot') // Primeday/NFL Counter

  monitorElementChildren('body', (mutations, element, isElementNotFound) => {
    runForBody(element, mutations)
  })
}

waitForElementToAppear('head', element => {
  if (element) {
    runForHead(element) // Run once when the head appears
  }
})

waitForElementToAppear('body', element => {
  if (element) {
    // Run one more time when we know the head is fully loaded. Just in case.
    runForHead(element)
    monitorBody()
  }
})
