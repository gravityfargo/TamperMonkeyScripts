// ==UserScript==
// @name         Gravityfargo's Amazon Script
// @namespace    Violentmonkey Scripts
// @version      0.0.2
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

// function runForHead () {
//   querySelectorAllDelete('noscript', document, true)

//   const scripts = document.querySelectorAll('script')
//   removeElementsByAttribute(scripts, 'rocketlazyloadscript', true)

//   const srcStubs = ['APE-SafeFrame', 'apesafeframe', 'forensics-incremental.min.js']
//   removeIfAttributeIncludes(scripts, 'src', srcStubs, true)

//   const contentStubs = ['window.grandprix', 'APE-SafeFrame', 'apesafeframe', 'AmazonNavigationRufusCard', 'eel.SponsoredProductsEventTracking.prod', 'forensics-incremental.min.js']
//   removeIfAttributeIncludes(scripts, 'src', contentStubs, true)
// }

// function runForBody () {
//   // querySelectorAllDelete('noscript', document, true)
// }
