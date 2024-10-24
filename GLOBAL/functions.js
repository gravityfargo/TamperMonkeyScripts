/* eslint-disable no-unused-vars */

/**
 * Waits for a specific DOM element to appear within a certain timeout and invokes a callback.
 * The function uses a MutationObserver to monitor changes in the DOM. If the target element
 * appears before the timeout, the observer is disconnected, and the callback is triggered with the element.
 * If the element does not appear within the specified timeout, the observer is disconnected, and
 * the callback is triggered with `null` to signal that the element was not found.
 *
 * @param {string} selector - The CSS selector for the element to wait for.
 * @param {function} callback - The function to execute once the element is found or when the timeout occurs.
 *                              Receives the found element as an argument, or `null` if the timeout is reached.
 * @param {number} [timeout=10000] - The time in milliseconds to wait before timing out. Default is 10 seconds.
 *
 * @returns {void} - This function does not return a value.
 *
 * @example
 * waitForElementToAppear('head', element => {
 *   if (element) {
 *     console.log('Head found:', element);
 *   } else {
 *     console.log('Head not found within the specified timeout.');
 *   }
 * }, 10000); // Wait for 10 seconds
 *
 */
function waitForElementToAppear (selector, callback, timeout = 10000) {
  const observer = new MutationObserver(mutations => {
    const element = document.querySelector(selector)
    if (element) {
      clearTimeout(timeoutId)
      observer.disconnect()
      callback(element) // Pass the element to the callback
    }
  })

  observer.observe(document.documentElement, { childList: true, subtree: true })

  // Set a timeout to stop observing
  const timeoutId = setTimeout(() => {
    observer.disconnect()
    callback(null) // Pass null to the callback to signal failure
  }, timeout)
}

/**
 * Continuously monitors a specific DOM element for changes using MutationObserver.
 * The function invokes the callback whenever a change occurs in the element or its subtree.
 * If the element is not found when the function is called, it immediately returns without waiting.
 * The observer automatically disconnects after the specified timeout.
 *
 * @param {string} selector - The CSS selector for the element to monitor.
 * @param {function} callback - The function to execute whenever a change occurs in the element or its subtree.
 *                              Receives four arguments: the mutation records, the observed element,
 *                              a boolean `isTimeout` to indicate if the callback was triggered by timeout,
 *                              and a boolean `isElementNotFound` to signal if the element was not found initially.
 * @param {number} [timeout=10000] - The time in milliseconds to monitor before timing out (default is 10 seconds).
 *
 * @returns {void} - This function does not return a value if the element is not found.
 *
 * @example
 * monitorElementForChangesWithTimeout('body', (mutations, element, isTimeout, isElementNotFound) => {
 *  if (isTimeout) {
 *    console.log('Monitoring stopped due to timeout.');
 *  } else if (isElementNotFound) {
 *   console.log('Element not found. Monitoring stopped.');
 *  } else {
 *    console.log('Changes detected in body:', mutations);
 *  }
 * }, 5000);
 *
 */
function monitorElementForChangesWithTimeout (selector, callback, timeout = 10000) {
  const element = document.querySelector(selector)

  if (!element) {
    callback(null, null, false, true) // Indicate that the element was not found
    return
  }

  const observer = new MutationObserver((mutationRecords) => {
    clearTimeout(timeoutId)
    callback(mutationRecords, element, false, false) // Trigger callback on change (not a timeout)
  })

  observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  })

  // Set a timeout to stop observing
  const timeoutId = setTimeout(() => {
    observer.disconnect() // Stop the observer after the timeout
    callback(null, element, true, false) // Indicate that the callback is due to timeout
  }, timeout)
}

/**
 * Continuously monitors a specific DOM element for changes using MutationObserver.
 * The function invokes the callback whenever a change occurs in the element or its subtree.
 * If the element is not found when the function is called, it immediately returns without waiting.
 * The observer will not stop until manually disconnected.
 *
 * @param {string} selector - The CSS selector for the element to monitor.
 * @param {function} callback - The function to execute whenever a change occurs in the element or its subtree.
 *                              Receives three arguments: the mutation records, the observed element, and a boolean
 *                              to indicate if the element was not found initially.
 *
 * @returns {function} - Returns a function that can be called to manually stop the observer.
 *
 * @example
 * const stopMonitoring = monitorElementForChanges('body', (mutations, element, isElementNotFound) => {
 *  if (isElementNotFound) {
 *    console.log('Element not found. Monitoring stopped.');
 *  } else {
 *    console.log('Changes detected in body:', mutations);
 *  }
 * });
 *
 * // Manually stop monitoring later
 * stopMonitoring();
 *
 */
function monitorElementForChanges (selector, callback) {
  const element = document.querySelector(selector)

  if (!element) {
    callback(null, null, true) // Indicate that the element was not found
    return
  }

  const observer = new MutationObserver((mutationRecords) => {
    callback(mutationRecords, element, false) // Trigger callback on change
  })

  observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  })

  // Return a function that can be called to manually stop observing
  return function stopMonitoring () {
    observer.disconnect()
  }
}

/**
 * Checks if an object is an instance of Element.
 *
 * @param {*} obj Source object to check
 *
 * @returns {boolean} Returns true if the object is an instance of Element
 *
 * @example
 * const element = document.querySelector('div');
 * console.log(isElement(element)); // true
 * console.log(isElement(null)); // false
 *
 */
function isElement (obj) {
  return obj instanceof Element
}

/**
 * Checks if an object is an instance of NodeList.
 *
 * @param {*} obj Source object to check
 *
 * @returns {boolean} Returns true if the object is an instance of NodeList
 *
 * @example
 * const elements = document.querySelectorAll('div');
 * console.log(isNodelist(elements)); // true
 * console.log(isNodelist(null)); // false
 *
 */
function isNodelist (obj) {
  return obj instanceof NodeList
}

/**
 * Finds all elements that match the given CSS selector within a specified parent element (or the entire document),
 * and removes each element from the DOM.
 *
 * @param {string} selector - The CSS selector used to identify elements to be removed.
 * @param {ParentNode} [parent=document] - The parent node within which to search for elements. Defaults to the document.
 * @param {boolean} [log=false] - Whether to log messages to the console. Defaults to false.
 *
 * @returns {number} - The number of elements removed.
 *
 * @example
 * // Deletes all elements with the class 'to-remove' in the entire document
 * querySelectorAllDelete('.to-remove');
 *
 * // Deletes all elements with the class 'to-remove' inside a specific parent element
 * const parent = document.getElementById('container');
 * querySelectorAllDelete('.to-remove', parent);
 *
 * // Deletes and logs each element being removed
 * querySelectorAllDelete('.to-remove', document, true);
 *
 */
function querySelectorAllDelete (selector, parent = document, log = false) {
  if (log) { console.log('querySelectorAllDelete', selector) }
  let removedCount = 0

  const elements = parent.querySelectorAll(selector)
  elements.forEach((el) => {
    if (log) console.log(el)
    el.remove()
    removedCount++
  })

  return removedCount
}

/**
 * Removes elements from a NodeList or single element if they have the specified attribute.
 *
 * @param {NodeList|Element} elements - The elements to check.
 * @param {string} attribute - The attribute to check for.
 * @param {boolean} [log=false] - Whether to log messages to the console. Defaults to false.
 *
 * @returns {number} - The number of elements removed.
 * @example
 * // Removes all elements with the 'data-remove' attribute in a NodeList
 * const elements = document.querySelectorAll('div');
 * removeIfHasAttribute(elements, 'data-remove');
 *
 * // Removes a single element if it has the 'data-remove' attribute
 * const element = document.querySelector('div');
 * removeIfHasAttribute(element, 'data-remove');
 *
 * // Removes elements with logging enabled
 * removeIfHasAttribute(elements, 'data-remove', true);
 */
function removeIfHasAttribute (elements, attribute, log = false) {
  if (!isNodelist(elements)) { elements = [elements] }
  if (log) { console.log('removeIfHasAttribute', attribute) }

  let removedCount = 0

  elements.forEach((el) => {
    if (!isElement(el)) { return }
    if (log) { console.log(el) }

    if (el.hasAttribute(attribute)) {
      el.remove()
      removedCount++
      if (log) { console.log('Removed!') }
    }
  })

  return removedCount
}

/**
 * Removes elements if their specified attribute includes any of the provided stubs.
 *
 * @param {NodeList|Element} elements - The elements to check.
 * @param {string} attribute - The attribute to check.
 * @param {string|string[]} stubs - The value(s) to match within the attribute value.
 * @param {boolean} [log=false] - Whether to log messages to the console. Defaults to false.
 *
 * @returns {number} - The number of elements removed.
 *
 * @example
 * // Removes elements where the 'class' attribute includes 'highlight' or 'selected'
 * const elements = document.querySelectorAll('div');
 * removeIfAttributeIncludes(elements, 'class', ['highlight', 'selected']);
 *
 * // Removes elements with a single attribute value stub
 * removeIfAttributeIncludes(elements, 'class', 'active');
 *
 * // Removes and logs elements being removed
 * removeIfAttributeIncludes(elements, 'class', 'active', true);
 */
function removeIfAttributeIncludes (elements, attribute, stubs, log = false) {
  if (!isNodelist(elements)) { elements = [elements] }
  if (!Array.isArray(stubs)) { stubs = [stubs] }

  if (log) { console.log('removeIfAttributeIncludes', attribute, stubs) }

  let removedCount = 0

  elements.forEach((el) => {
    if (!isElement(el)) { return }
    if (log) { console.log(el) }

    const attrValue = el.getAttribute(attribute)
    if (attrValue && stubs.some(stub => attrValue.includes(stub))) {
      el.remove()
      removedCount++
      if (log) { console.log('Removed!') }
    }
  })

  return removedCount
}
