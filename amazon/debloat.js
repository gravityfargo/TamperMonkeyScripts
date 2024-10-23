// ==UserScript==
// @name         Gravityfargo's Amazon Script
// @namespace    Violentmonkey Scripts
// @version      0.0.1
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

function runForHead () {
  console.log('Executing logic for head')
}

function runForBody () {
  console.log('Executing logic for body')
}

// Call the observer function and pass in your custom functions
observeHeadAndBody(runForHead, runForBody, true)
