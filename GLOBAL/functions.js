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
 * Continuously monitors for new/deleted children of a specific DOM element using MutationObserver
 * and stops observing after a specified timeout.
 *
 * @param {string} selector - The CSS selector for the element to monitor.
 * @param {function} callback - The function to execute whenever a change occurs in the element or its subtree.
 * @param {number} [timeout=10000] - The time in milliseconds to monitor before timing out (default is 10 seconds).
 *
 * @returns {void} - This function does not return a value if the element is not found.
 *
 * @example
 * // Monitor the body element for changes for a maximum of 5 seconds
 * monitorElementsChildren('body', (mutations, element, isTimeout, isElementNotFound) => {
 *  if (isTimeout) {
 *    console.log('Monitoring stopped due to timeout.');
 *  } else if (isElementNotFound) {
 *   console.log('Element not found. Monitoring stopped.');
 *  } else {
 *    console.log(`Changes detected in ${element}`);
 *    console.log(`Those changes are: ${mutations}`);
 *  }
 * }, 5000);
 *
 */
function monitorElementsChildrenWithTimeout (selector, callback, timeout = 10000) {
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
    subtree: true
  })

  // Set a timeout to stop observing
  const timeoutId = setTimeout(() => {
    observer.disconnect() // Stop the observer after the timeout
    callback(null, element, true, false) // Indicate that the callback is due to timeout
  }, timeout)
}

/**
 * Continuously monitors for new/deleted children of a specific DOM element using MutationObserver.
 *
 * @param {string} selector - The CSS selector for the element to monitor.
 * @param {function} callback - The function to execute whenever a change occurs in the element or its subtree.
 *
 * @returns {function} - Function to manually stop the observer.
 *
 * @example
 * // Stoppable monitoring
 * const stopMonitoring = monitorElementsChildren('body', (mutations, element, isElementNotFound) => {
 *  if (isElementNotFound) {
 *    console.log('Element not found. Monitoring stopped.');
 *  } else {
 *    console.log(`Changes detected in ${element}`);
 *    console.log(`Those changes are: ${mutations}`);
 *  }
 * });
 * stopMonitoring(); // Manually stop monitoring later
 *
 * @example
 * // continuous monitoring
 * monitorElementsChildren('nav', (mutations, element, isElementNotFound) => {
 *  if (isElementNotFound) {
 *    console.log('Element not found. Monitoring stopped.');
 *  } else {
 *    console.log(`Changes detected in ${element}`);
 *    console.log(`Those changes are: ${mutations}`);
 *  }
 * });
 */
function monitorElementsChildren (selector, callback) {
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
 * Checks if an object is null.
 *
 * Not really necessary, but I think it makes code more readable.
 *
 * @param {*} obj Source object to check
 *
 * @returns {boolean} Returns true if the object is null
 *
 * @example
 * const elements = document.querySelectorAll('div');
 * console.log(isNull(elements)); // false
 * console.log(isNull(null)); // true
 */
function isNull (obj) {
  if (obj === null) {
    return true
  }
  return false
}

/**
 * Just logs to the console. Save some keystrokes.
 *
 * @param {string} message - The message to log to the console.
 *
 * @returns {void}
 *
 * @example
 * glog('Hello, World!');
 */
function glog (message) {
  console.log(message)
}

/**
 * Finds all elements with the given CSS selector within a specified parent element
 * and removes each element from the DOM.
 *
 * @param {string} selector - The CSS selector used to identify elements to be removed.
 * @param {ParentNode} [parent=document] - The parent node within which to search for elements. Defaults to the document.
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
 */
function querySelectorAllDelete (selector, parent = document) {
  const removedElements = []

  const elements = parent.querySelectorAll(selector)
  if (!isNodelist(elements) && isNull(elements)) { return }

  elements.forEach((el) => {
    if (!isElement(el)) { return }
    el.remove()
    removedElements.push(el)
  })

  const logStr = `querySelectorAllDelete() \n\t Removed ${removedElements.length} elements.\n`
  if (removedElements.length > 0) { console.log(logStr, removedElements) }
}

/**
 * Removes element(s) from a NodeList if the specified attribute is present.
 *
 * @param {NodeList|Element} elements - The element(s) to check.
 * @param {string} attribute - The attribute to check for.
 *
 * @returns {void}
 * @example
 * // Removes all elements with the 'data-remove' attribute in a NodeList
 * const elements = document.querySelectorAll('div');
 * removeIfHasAttribute(elements, 'data-remove');
 *
 * // Removes a single element if it has the 'data-remove' attribute
 * const element = document.querySelector('div');
 * removeIfHasAttribute(element, 'data-remove');
 *
 */
function removeIfHasAttribute (elements, attribute) {
  // console.log(elements, attribute)
  if (!isNodelist(elements) && isNull(elements)) { return }
  if (!isNodelist(elements)) { elements = [elements] }

  const removedElements = []

  elements.forEach((el) => {
    if (!isElement(el)) { return }

    if (el.hasAttribute(attribute)) {
      el.remove()
      removedElements.push(el)
    }
  })

  const logStr = `removeIfHasAttribute() \t Removed ${removedElements.length} elements.`
  if (removedElements.length > 0) { console.log(logStr, removedElements) }
}

/**
 * Removes element(s) if the specified attribute contains a keyword from the provided stub(s).
 *
 * @param {NodeList|Element} elements - The element(s) to check.
 * @param {string} attribute - The attribute to check.
 * @param {string|string[]} stubs - The value(s) to match.
 *
 * @returns {void}
 *
 * @example
 * // Removes elements where the 'class' attribute includes 'highlight' or 'selected'
 * const elements = document.querySelectorAll('div');
 * const stubs = ['highlight', 'selected'];
 * removeIfAttributeIncludes(elements, 'class', stubs);
 *
 * // Removes elements with a single attribute value stub
 * removeIfAttributeIncludes(elements, 'class', 'active');
 *
 */
function removeIfAttributeIncludes (elements, attribute, stubs) {
  // console.log(elements, attribute, stubs)
  if (!isNodelist(elements) && isNull(elements)) { return }
  if (!isNodelist(elements)) { elements = [elements] }
  if (!Array.isArray(stubs)) { stubs = [stubs] }

  const removedElements = []

  elements.forEach((el) => {
    if (!isElement(el)) { return }

    const attrValue = el.getAttribute(attribute)
    console.log(el)
    if (attrValue && stubs.some(stub => attrValue.includes(stub))) {
      el.remove()
      removedElements.push(el)
    }
  })

  const logStr = `removeIfAttributeIncludes() \t Removed ${removedElements.length} elements.`
  if (removedElements.length > 0) { console.log(logStr, removedElements) }
}

/**
 * Removes element(s) from a NodeList if the specified attribute is present.
 *
 * @param {string} selector - The CSS selector used to find the element to check.
 * @param {ParentNode} [parent=document] - The parent node within which to search for elements. Defaults to the document.
 * @returns  {void}
 *
 * @example
 * // Removes the first <h1>> found in document.body
 * querySelectorDelete('h1', document.body);
 *
 * // Removes the first <h3> found in the document
 * querySelectorDelete('h3');
 */
function querySelectorDelete (selector, parent = document) {
  const element = parent.querySelector(selector)
  if (!isElement(element)) { return }
  element.remove()

  console.log(`querySelectorDelete() \t Removed ${element}`)
}
