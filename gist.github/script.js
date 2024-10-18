// ==UserScript==
// @name         Github Gist Addons
// @namespace    Violentmonkey Scripts
// @version      0.0.4
// @description  Add a copy button to code blocks on GitHub Gist
// @author       Nathan Price
// @license      GPL-3.0
// @match        https://gist.github.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @homepageURL  https://github.com/gravityfargo/TamperMonkeyScripts
// @downloadURL  https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/gist.github/script.js
// @updateURL    https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/gist.github/script.js
// @supportURL   https://github.com/gravityfargo/TamperMonkeyScripts/issues
// @require      https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/Github/common.js
// ==/UserScript==

function getSource (fileUrl) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: fileUrl,

      onload: (res) => {
        try {
          // Destructure the response object
          const { status, response } = res

          let rawText = ''
          if (status === 200) {
            rawText = response
          }

          resolve(rawText)
        } catch (error) {
          console.error('Error during response processing:', error)
          reject(new Error('Failed to retrieve data'))
        }
      },

      onerror: (error) => {
        console.error('Network request failed:', error)
        reject(new Error('Network request failed'))
      }
    })
  })
}

async function copyToClipboard (fileUrl) {
  try {
    const sourceCode = await getSource(fileUrl)

    // check if sourceCode is valid
    if (sourceCode && sourceCode !== '') {
      GM_setClipboard(sourceCode)
      console.log('Copy successful')
    } else {
      console.error('Copy failed: Invalid source code')
    }
  } catch (error) {
    console.error('Copy failed:', error.message)
  }
}

function init () {
  const fileDivs = document.getElementsByClassName('file')

  for (const fileDiv of fileDivs) {
    const rightButtonGrp = fileDiv.querySelector('.file-actions')

    if (rightButtonGrp === null) {
      return
    }

    if (rightButtonGrp.children.length !== 1) {
      return
    }
    rightButtonGrp.classList.remove('file-actions')
    rightButtonGrp.classList.add('d-flex', 'gap-1')

    const oldRawButton = rightButtonGrp.children[0]
    const fileUrl = oldRawButton.href

    oldRawButton.remove()

    const rawButton = createButton(null, 'Raw')
    rawButton.href = fileUrl
    rightButtonGrp.appendChild(rawButton)

    const copyButton = createButton(IconCopy, null)
    rightButtonGrp.appendChild(copyButton)

    copyButton.addEventListener('click', async () => {
      copyToClipboard(fileUrl)
    })
  }
}

function observe (node, callback, options) {
  const observer = new MutationObserver((mutations, ob) => {
    const result = callback(mutations, ob)
    if (result) disconnect()
  })
  observer.observe(node, Object.assign({
    childList: true,
    subtree: true
  }, options))

  const disconnect = () => observer.disconnect()

  return disconnect
}

observe(document.body, () => {
  init()
})
