// ==UserScript==
// @name         Gravityfargo's Stackoverflow
// @namespace    Violentmonkey Scripts
// @version      0.0.1
// @description  Useful Scripts for Stackoverflow
// @author       Nathan Price
// @license      GPL-3.0
// @match        *://stackoverflow.com/*
// @match        *://serverfault.com/*
// @run-at       document-idle
// @icon         https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png
// @homepageURL  https://github.com/gravityfargo/TamperMonkeyScripts
// @downloadURL  https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/stackoverflow/script.js
// @updateURL    https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/stackoverflow/script.js
// @supportURL   https://github.com/gravityfargo/TamperMonkeyScripts/issues
// ==/UserScript==

function clearList (objs, needParent = false) {
  objs.forEach((obj) => {
    if (obj) {
      console.log(obj)
      if (needParent) {
        if (obj.parentElement) {
          obj.parentElement.remove()
          return
        }
      }
      obj.remove()
    }
  })
}

function cleanComments (post) {
  const deleteObjs = []
  const userInfos = post.querySelectorAll('.user-info')
  userInfos.forEach((user) => {
    deleteObjs.push(user.querySelector('.user-details'))
    deleteObjs.push(user.querySelector('.user-gravatar32'))

    const comments = post.querySelectorAll('.comment-body')
    comments.forEach((comment) => {
      comment.classList.add('d-flex', 'fd-column')
      if (comment.children.length === 4) {
        deleteObjs.push(comment.children[3])
      }
      if (comment.children.length === 3) {
        comment.children[2].classList.add('d-flex', 'jc-end')
        deleteObjs.push(comment.children[1])
      }
    })
  })

  const footer = userInfos[0].parentElement.parentElement
  footer.removeAttribute('class')
  footer.classList.add('d-flex', 'jc-space-between')
  clearList(deleteObjs)
}

function removeVotes (post) {
  const postVoteContainer = post.querySelector('.js-voting-container')
  Array.from(postVoteContainer.children).forEach((child) => {
    if (!child.classList.contains('js-vote-count') && !child.classList.contains('js-accepted-answer-indicator')) {
      child.remove()
    }
  })
}

function init () {
  const deleteObjs = []
  const deleteParentObjs = []
  const mainContent = document.getElementById('mainbar')

  deleteObjs.push(document.getElementById('post-form')) // Your Answer form at the bottom
  deleteObjs.push(document.body.querySelector('header.s-topbar.ps-fixed.t0.l0.js-top-bar div.s-topbar--container ol.s-navigation')) // About / Products / OverflowAI
  deleteObjs.concat(mainContent.querySelectorAll('.bottom-notice')) // Not the answer you're looking for....
  deleteObjs.push(mainContent.querySelector('aside.post-notice')) // hot topic

  mainContent.querySelectorAll('.post-layout').forEach((post) => {
    deleteParentObjs.push(post.querySelector('.js-post-menu')) // Share / Improve this question / Follow
    deleteParentObjs.push(post.querySelector('.comments-link')) // add a comment

    removeVotes(post)

    // add a pretty little hr after the question
    if (post.id === 'question') {
      const hr = document.createElement('hr')
      post.insertAdjacentElement('afterend', hr)
    }

    cleanComments(post)

    clearList(deleteObjs)
    clearList(deleteParentObjs, true)
  })

  const sidebar = document.querySelector('#sidebar')
  const unwantedClasses = ['hot-network-questions', 'js-feed-link', 'js-zone-container', 's-sidebarwidget', 'tex2jax_ignore', 's-sidebarwidget', 's-modal']
  const unwantedIds = ['hot-network-questions', 'hireme']

  Array.from(sidebar.children).forEach((child) => {
    if (!child.hasAttribute('class')) {
      child.remove()
    }

    if (child.hasAttribute('id')) {
      if (unwantedIds.includes(child.id)) {
        child.remove()
      }
    }

    if (unwantedClasses.includes(child.classList[0])) {
      child.remove()
    }
  })

  clearList([document.getElementById('left-sidebar')])
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
