// ==UserScript==
// @name         Gravityfargo's Global Script
// @namespace    Violentmonkey Scripts
// @version      0.0.1
// @description  Useful Scripts for general browsing
// @author       Nathan Price
// @license      GPL-3.0
// @include      http://*
// @include      https://*
// @run-at       document-end
// @grant        GM_getResourceText
// @resource     domainDataUpstream https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/GLOBAL/domainData.json
// @icon         https://globelifefield.com/wp-content/themes/globe-life-field/img/icons/apple-touch-icon.png
// @homepageURL  https://github.com/gravityfargo/TamperMonkeyScripts
// @downloadURL  https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/GLOBAL/script.js
// @updateURL    https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/GLOBAL/script.js
// @supportURL   https://github.com/gravityfargo/TamperMonkeyScripts/issues
// ==/UserScript==

const windowLocationHost = unsafeWindow.location.host
const domainDataUpstream = JSON.parse(GM_getResourceText('domainDataUpstream'))
const domainDataLocal = {
}

const domainData = { ...domainDataUpstream, ...domainDataLocal }
const matchedDomainKey = Object.keys(domainData).find((domain) => windowLocationHost.includes(domain))

function removeById (domainInfo) {
  domainInfo.ids.forEach((item) => {
    const items = item.split('|')
    const element = document.getElementById(items[0])

    if (element) {
      if (item.includes('|parent')) {
        if (items.length === 3 && !isNaN(items[2])) {
          let parent = element
          const levelsToTraverse = parseInt(items[2], 10)

          for (let i = 0; i < levelsToTraverse; i++) {
            if (parent.parentNode) {
              parent = parent.parentNode
            }
          }

          parent.remove()
        } else {
          element.parentNode.remove()
        }
      } else if (item.includes('|sibling')) {
        const direction = items[2]
        const count = parseInt(items[3], 10)
        let sibling = element

        for (let i = 0; i < count; i++) {
          if (direction === 'up') {
            sibling = sibling.previousElementSibling
          } else {
            sibling = sibling.nextElementSibling
          }
        }

        if (sibling) {
          sibling.remove()
        }
      } else {
        element.remove()
      }
    }
  })
}

function removeByQueryAll (domainInfo) {
  domainInfo.queryAll.forEach((item) => {
    const els = document.body.querySelectorAll(item)
    els.forEach((el) => {
      if (el) {
        el.remove()
      }
    })
  })
}

function removeByQuery (domainInfo) {
  domainInfo.queryOne.forEach((item) => {
    const el = document.body.querySelector(item)
    if (el) {
      el.remove()
    }
  })
}

if (matchedDomainKey) {
  const domainInfo = domainData[matchedDomainKey]

  // Check and perform actions based on the domain data
  if (domainInfo.ids.length > 0) {
    removeById(domainInfo)
  }

  if (domainInfo.queryAll.length > 0) {
    removeByQueryAll(domainInfo)
  }

  if (domainInfo.queryOne.length > 0) {
    removeByQuery(domainInfo)
  }
}
