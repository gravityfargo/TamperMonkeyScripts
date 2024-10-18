// ==UserScript==
// @name         Gravityfargo's Stackoverflow
// @namespace    Violentmonkey Scripts
// @version      0.0.1
// @description  Useful Scripts for Stackoverflow
// @author       Nathan Price
// @license      GPL-3.0
// @match        *://stackoverflow.com/*
// @run-at       document-idle
// @icon         https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png
// @homepageURL  https://github.com/gravityfargo/TamperMonkeyScripts
// @downloadURL  https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/stackoverflow/script.js
// @updateURL    https://raw.githubusercontent.com/gravityfargo/TamperMonkeyScripts/refs/heads/main/stackoverflow/script.js
// @supportURL   https://github.com/gravityfargo/TamperMonkeyScripts/issues
// ==/UserScript==

document.body.querySelector('header.s-topbar.ps-fixed.t0.l0.js-top-bar div.s-topbar--container ol.s-navigation').remove()
const posts = document.body.querySelector('#mainbar').querySelectorAll('.post-layout')

posts.forEach((post) => {
  const postVoteContainer = post.querySelector('.js-voting-container')
  Array.from(postVoteContainer.children).forEach((child) => {
    if (!child.classList.contains('js-vote-count') && !child.classList.contains('js-accepted-answer-indicator')) {
      child.remove()
    }
  })

  post.querySelector('.js-post-menu').parentElement.remove()
  post.querySelector('.comments-link').parentElement.remove()

  const userInfos = post.querySelectorAll('.user-info')
  userInfos.forEach((user) => {
    user.querySelector('.user-details').remove()
    user.querySelector('.user-gravatar32').remove()

    const comments = post.querySelectorAll('.comment-body')
    comments.forEach((comment) => {
      comment.classList.add('d-flex', 'fd-column')
      if (comment.children.length === 4) {
        comment.children[3].remove()
      }
      if (comment.children.length === 3) {
        comment.children[2].classList.add('d-flex', 'jc-end')
        comment.children[1].remove()
      }
    })
  })

  const footer = userInfos[0].parentElement.parentElement
  footer.removeAttribute('class')
  footer.classList.add('d-flex', 'jc-space-between')

  if (post.id === 'question') {
    const hr = document.createElement('hr')
    post.insertAdjacentElement('afterend', hr)
  }
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

  const firstClass = child.classList[0]
  if (unwantedClasses.includes(firstClass)) {
    child.remove()
  }
})

// Remove left sidebar
document.getElementById('left-sidebar').remove()
