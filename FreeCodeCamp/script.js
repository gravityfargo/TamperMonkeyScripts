// ==UserScript==
// @name         Clean FreeCodeCamp
// @namespace    http://tampermonkey.net/
// @version      2024-10-16
// @description  Remove clutter from FreeCodeCamp
// @author       Nathan Price
// @license      GPL-3.0
// @match        https://www.freecodecamp.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freecodecamp.org
// @supportURL   https://github.com/gravityfargo/TamperMonkeyScripts/issues
// @homepageURL  https://github.com/gravityfargo/TamperMonkeyScripts
// ==/UserScript==

(function () {
  'use strict'
  document.querySelectorAll('iframe').forEach(iframe => {
    if (iframe.src.includes('scrimba.com')) {
      iframe.remove()
    }
  })
})()
