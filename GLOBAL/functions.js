/* eslint-disable no-unused-vars */

/**
 * Finds all elements that match the given CSS selector within a specified parent element (or the entire document),
 * and removes each element from the DOM.
 *
 * @param {string} queryStr - The CSS selector used to identify elements to be removed.
 * @param {ParentNode} [parent=document] - The parent node within which to search for elements. Defaults to the document.
 *
 * @returns {void} - This function does not return a value.
 */
function querySelectorAllDelete (queryStr, parent = document) {
  parent.querySelectorAll(queryStr).forEach((el) => {
    console.log(el)
    el.remove()
  })
}

/**
 * Observes the DOM for the head and body elements to load, and executes the respective functions once they are loaded.
 *
 * @param {Function} runForHead - The function to execute when the head element is loaded.
 * @param {Function} runForBody - The function to execute when the body element is loaded.
 */

function observeHeadAndBody (runForHead, runForBody) {
  const observer = new MutationObserver((mutationsList, observer) => {
    const headElement = document.head
    const bodyElement = document.body

    if (headElement && typeof runForHead === 'function') {
      console.log('The head is now loaded!')
      runForHead() // Execute the passed function for head
    }

    if (bodyElement && typeof runForBody === 'function') {
      console.log('The body is now loaded!')
      runForBody()
      observer.disconnect() // Stop observing once fully loaded
    }
  })

  // Start observing the document for changes
  observer.observe(document, { childList: true, subtree: true })
}
