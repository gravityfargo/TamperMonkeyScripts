// ==UserScript==
// @name         Gravityfargo's Global Script
// @namespace    Violentmonkey Scripts
// @version      0.0.2
// @description  Useful Scripts for general browsing
// @author       Nathan Price
// @license      GPL-3.0
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        GM_notification
// @resource     domainDataUpstream https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/GLOBAL/domainData.json
// @icon         https://globelifefield.com/wp-content/themes/globe-life-field/img/icons/apple-touch-icon.png
// @homepageURL  https://github.com/gravityfargo/TamperMonkeyScripts
// @downloadURL  https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/GLOBAL/script.js
// @updateURL    https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/GLOBAL/script.js
// @supportURL   https://github.com/gravityfargo/TamperMonkeyScripts/issues
// @include      http://*
// @include      https://*
// ==/UserScript==
//

// id query: 'id-of-element|parent|#of-parents-above-to-remove'

const windowLocationHost = unsafeWindow.location.host
const domainDataUpstream = JSON.parse(GM_getResourceText('domainDataUpstream'))
const domainDataLocal = {
  'dev.to': {
    queryOne: ['#page-content-inner div.crayons-layout.crayons-layout--3-cols.crayons-layout--article aside.crayons-layout__sidebar-right div.crayons-article-sticky.grid.gap-4.break-word.js-billboard-container'],
    queryAll: [],
    ids: ['runtime-banner-container|sibling|up|1']
  }
}

const domainData = { ...domainDataUpstream, ...domainDataLocal }
const matchedDomainKey = Object.keys(domainData).find((domain) => windowLocationHost.includes(domain))

const wordpressData = {
  queryOne: [],
  queryAll: ['.boxzilla-container', '.boxzilla-overlay', 'd_unit', 'd-unit'],
  ids: [
  ]
}

function removeById (domainInfo) {
  domainInfo.ids.forEach((item) => {
    const items = item.split('|')
    const element = document.getElementById(items[0])
    console.log('Removing:', items[0])

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
    console.log('Removing:', item)
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
    console.log('Removing:', item)
    const el = document.body.querySelector(item)
    if (el) {
      el.remove()
    }
  })
}

function checkIfWordpress () {
  const metaTag = document.querySelector('meta[property="og:image"]')
  if (metaTag === null) {
    return false
  }

  if (metaTag.content.includes('wp-content')) {
    return true
  }
}

function cleanSite (domainInfo) {
  GM_notification('This domain should be checked in the global script', "Gravityfargo's Global Script")

  if (domainInfo.ids.length > 0) {
    console.log('Removing by ID')
    removeById(domainInfo)
  }

  if (domainInfo.queryAll.length > 0) {
    console.log('Removing by query all')
    removeByQueryAll(domainInfo)
  }

  if (domainInfo.queryOne.length > 0) {
    console.log('Removing by query one')
    removeByQuery(domainInfo)
  }
}

function init () {
  if (matchedDomainKey) {
    console.log('Domain matched:', windowLocationHost)

    const domainInfo = domainData[matchedDomainKey]
    cleanSite(domainInfo)
    return
  }

  if (checkIfWordpress()) {
    console.log('This is a Wordpress site')
    cleanSite(wordpressData)
  }
}

// document-end is too early for some sites
// the benefit of the observer is that it runs before the page is fully loaded
// which would be the case with document-idle

window.addEventListener('load', function () {
  init()
})
