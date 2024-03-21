/**
 * A collection of helper prototype for everyday DOM traversal, manipulation,
 * and event binding. Sort of a minimalist jQuery, mainly for demonstration 
 * purposes. MIT @ m3g4p0p
 */
window.$ = (function (undefined) {

  /**
   * Duration constants
   * @type {Object}
   */
  const DURATION = {
    DEFAULT: 500
  }

  /**
   * Style constants
   * @type {Object}
   */
  const STYLE = {
    SHOW: 'block',
    HIDE: 'none'
  }

  /**
   * Style property constants
   * @type {Object}
   */
  const PROPERTY = {
    DISPLAY: 'display'
  }

  /**
   * Type constants
   * @type {Object}
   */
  const TYPE = {
    FUNCTION: 'function',
    STRING: 'string'
  }

  /**
   * Map elements to events
   * @type {WeakMap}
   */
  const eventMap = new WeakMap()

  /**
   * Function to fade an element
   * @param  {HTMLElement} element
   * @param  {Number} from
   * @param  {Number} to
   * @param  {Number} duration
   * @param  {Function} callback
   * @return {void}
   */
  const fade = function fade (element, from, to, duration, callback) {
    const start = window.performance.now()

    element.style.display = STYLE.SHOW

    window.requestAnimationFrame(function step (timestamp) {
      const progress = timestamp - start
      element.style.opacity = from + (progress / duration) * (to - from)

      if (progress < duration) {
        window.requestAnimationFrame(step) 
      } else {
        if (element.style.opacity <= 0) {
          element.style.display = STYLE.HIDE
        }

        if (callback) {
          callback.call(element)
        }
      }
    })
  }

  /**
   * The methods in the collection'S prototype
   * @type {Object}
   */
  const prototype = {

    ///////////////
    // Traversal //
    ///////////////

    /**
     * Check if a node is already contained in the collection
     * @param  {HTMLElement} element
     * @return {Boolean}
     */
    has (element) {
      return Array.from(this).includes(element)
    },

    /**
     * Add an element or a list of elements to the collection
     * @param   {mixed} element
     * @returns {this}
     */
    add (element) {
      const elements = element.length !== undefined && element.tagName != 'FORM'
                       ? element
                       : [element]

      Array.from(elements).forEach(element => {
        if (element && !this.has(element)) {
          Array.prototype.push.call(this, element)
        }
      })

      return this
    },

    /**
     * Remove element with specified index from current the collection
     * or, if index is undefined, remove whole collection
     * @param {index|undefined}
     * @return {undefined}
     */
    remove(index) {
      function deleteElement(collection, index) {
        Array.prototype.at.call(collection, index).remove()
        Array.prototype.splice.call(collection, index, 1)
      }

      index === undefined
      ? Array.from(this).forEach((element, index) => {
          deleteElement(this, index)
        })
      : deleteElement(this, index);
      return this
    },

    /**
     * Clone the current collection
     * @param  {bool} deep
     * @return {Object}
     */
    clone(deep=true) {
      let newCollection = Object.create(prototype)
      Array.from(this).forEach(element => {
        newCollection.add(element.cloneNode(deep))
      })

      return newCollection
    },

    /**
     * Append an html element or elements from the other collection
     * into the current colletion
     * @param {Object|HTMLElement}
     * @return {this}
     */
    append(other) {
      if (other.tagName) {
        other = $(other)
      }

      Array.from(this).forEach(element => {
        Array.from(other).forEach(otherElement => {
          element.append(otherElement)
        })
      })

      return this
    },

    prepend(other) {
      if (other.tagName) {
        other = $(other)
      }

      Array.from(this).forEach(element => {
        Array.from(other).forEach(otherElement => {
          element.prepend(otherElement)
        })
      })

      return this
      
    },

    /**
     * Insert the elements of the collection from other before each 
     * elements of the current collection
     * @param {Object|HTMLElement} other
     * @return {this}
     */
    before(other) {
      if (other.tagName) {
        other = $(other)
      }

      Array.from(this).forEach(element => {
        Array.from(other).forEach(otherElement => {
          element.before(otherElement)
        })
      })

      return this
    },

    /**
     * Insert the elements of the collection from other after each 
     * elements of the current collection
     * @param {Object|HTMLElement} other
     * @return {this}
     */
    after(other) {
      if (other.tagName) {
        other = $(other)
      }

      Array.from(this).forEach(element => {
        Array.from(other).forEach(otherElement => {
          element.after(otherElement)
        })
      })

      return this
    },

    /**
     * Find descendants of the current collection matching a selector
     * @param  {String} selector
     * @return {this}
     */
    find (selector) {
      return Array.from(this).reduce(
        (carry, element) => carry.add(element.querySelectorAll(selector)), 
        Object.create(prototype)
      )
    },

    /**
     * Filter the current collection by a selector or filter function
     * @param  {String|Function} selector
     * @return {this}
     */
    filter (selector) {
      return Object.create(prototype).add(
        Array.from(this).filter(
          typeof selector === TYPE.FUNCTION
            ? selector
            : element => element.matches(selector)
        )
      )
    },

    /**
     * Returns element by index from the cuurent collection
     * @param {Integer}
     * @return {HTMLElement}
     */
    at (index) {
      return Array.from(this).at(index);
    },

    /**
     * Get a collection containing the adjecent next siblings
     * of the current collection, optionally filtered by a selector
     * @param  {String|undefined} selector
     * @return {this}
     */
    next (selector) {
      return Object.create(prototype).add(
        Array.from(this)
          .map(element => element.nextElementSibling)
          .filter(element => element && (!selector || element.matches(selector)))
      )
    },

    /**
     * Get a collection containing the adjecent previous siblings
     * of the current collection, optionally filtered by a selector
     * @param  {String|undefined} selector
     * @return {Object}
     */
    prev (selector) {
      return Object.create(prototype).add(
        Array.from(this)
          .map(element => element.previousElementSibling)
          .filter(element => element && (!selector || element.matches(selector)))
      )
    },

    /**
     * Check if object is empty
     * @return {bool
     */
    isEmpty() {
      return this.length === undefined || this.length == 0;
    },

    /**
     * Get a collection containing the immediate parents of
     * the current collection, optionally filtered by a selector
     * @param  {String|undefined} selector
     * @return {this}
     */
    parent (selector) {
      return Object.create(prototype).add(
        Array
          .from(this)
          .map(element => element.parentNode)
          .filter(element => !selector || element.matches(selector))
      )
    },

    /**
     * Get a collection containing the immediate parents of the
     * current collection, or, if a selector is specified, the next
     * ancestor that matches that selector
     * @param  {String|undefined} selector
     * @return {this}
     */
    parents (selector) {
      return Object.create(prototype).add(
        Array.from(this).map(function walk (element) {
          let parent

          try {
            parent = element.parentNode
          } catch (e) {
            return
          }

          return parent && (!selector || parent.matches && parent.matches(selector))
            ? parent
            : walk(parent)
        })
      )
    },

    /**
     * Get a collection containing the immediate children of the
     * current collection, optionally filtered by a selector
     * @param  {String|undefined} selector
     * @return {this}
     */
    children (selector) {
      return Object.create(prototype).add(
        Array
          .from(this)
          .reduce((carry, element) => carry.concat(...element.children), [])
          .filter(element => !selector || element.matches(selector))
      )
    },

    //////////////////
    // Manipulation //
    //////////////////

    /**
     * Add a class to all elements in the current collection
     * @param   {String} className
     * @returns {this}
     */
    addClass (className) {
      if (className === undefined) {
        return this;
      }

      Array.from(this).forEach(el => {
        if (!(className instanceof Array)) {
          className = [className]
        }

        className.forEach(_class => {
          el.classList.add(_class)
        })
      })

      return this
    },

    /**
     * Remove a class from all elements in the current collection
     * @param  {String} className
     * @return {this}
     */
    removeClass (className) {
      if (className === undefined) {
        return this;
      }

      Array.from(this).forEach(el => {
        if (!(className instanceof Array)) {
          className = [className]
        }

        className.forEach(_class => {
          el.classList.remove(_class)
        })
      })

      return this
    },

    /**
     * Check if first element in the current collection has a given class
     * @param {String} className
     * @return {Boolean}
     */
    containsClass(className) {
      return this[0].classList.contains(className);
    },

    /**
     * Set the value property of all elements in the current
     * collection, or, if no value is specified, get the value
     * of the first element in the collection
     * @param  {mixed} newVal
     * @return {this|String}
     */
    val (newVal) {
      if (newVal === undefined) {
        return this[0].value
      }
      
      Array.from(this).forEach(el => {
        el[el.type == 'checkbox' ? 'checked' : 'value'] = newVal;
      })

      return this
    },

    /**
    * Returns id of first element
    * @return {String}
    */
    id () {
      return this[0].id
    },

    /**
     * Set the HTML of all elements in the current collection, 
     * or, if no markup is specified, get the HTML of the first 
     * element in the collection
     * @param  {String|undefined} newHtml
     * @return {this|String}
     */
    html (newHtml) {
      if (newHtml === undefined) {
        return this[0].innerHTML
      }
      
      Array.from(this).forEach(el => {
        el.innerHTML = newHtml
      })

      return this
    },

    /**
     * Set the outer HTML of all elements in the current collection, 
     * or, if no markup is specified, get the outer HTML of the first 
     * element in the collection
     * @param  {String|undefined} newHtml
     * @return {this|String}
     */
    outer (newHtml) {
      if (newHtml === undefined) {
        return this[0].outerHTML
      }
      
      Array.from(this).forEach(el => {
        el.outerHTML = newHtml
      })

      return this
    },

    /**
     * Set the text of all elements in the current collection, 
     * or, if no markup is specified, get the HTML of the first 
     * element in the collection
     * @param  {String|undefined} newText
     * @return {this|String}
     */
    text (newText) {
      if (newText === undefined) {
        return this[0].textContent
      }
      
      Array.from(this).forEach(el => {
        el.textContent = newText
      })

      return this
    },

    /**
     * Disables all elements in collection
     */
    disable() {
      Array.from(this).forEach(el => {
        el.disabled = true
      })

      return this
    },

    /**
     * Enables all elements in collection
     */
    enable() {
      Array.from(this).forEach(el => {
        el.disabled = false
      })

      return this
    },

    ///////////////////////
    // CSS and animation //
    ///////////////////////

    /**
     * Hide all elements in the current collection
     * @return {this}
     */
    hide () {
      Array.from(this).forEach(element => {
        element.style.display = null

        if (window.getComputedStyle(element).getPropertyValue(PROPERTY.DISPLAY) !== STYLE.HIDE) {
          element.style.display = STYLE.HIDE
        }
      })

      return this
    },

    /**
     * Show all elements in the current collection
     * @return {this}
     */
    show () {
      Array.from(this).forEach(element => {
        element.style.display = null

        if (window.getComputedStyle(element).getPropertyValue(PROPERTY.DISPLAY) === STYLE.HIDE) {
          element.style.display = STYLE.SHOW
        }
      })

      return this
    },

    /**
     * Set the CSS of the elements in the current collection
     * by either specifying the CSS property and value, or
     * an object containing the style declarations
     * @param  {String|object} style
     * @param  {mixed} value
     * @return {this}
     */
    css (style, value) {
      const currentStyle = {}

      if (typeof style === TYPE.STRING) {

        if (!value) {
          return this[0] && window
            .getComputedStyle(this[0])
            .getPropertyValue(style)
        }

        currentStyle[style] = value
      } else {
        Object.assign(currentStyle, style)
      }

      Array.from(this).forEach(element => {
        Object.assign(element.style, currentStyle)
      })

      return this
    },

    /**
     * Fade the elements in the current collection in; optionally
     * takes the fade duration and a callback that gets executed
     * on each element after the animation finished
     * @param  {Number|undefined} duration
     * @param  {Function|undefined} callback
     * @return {this}
     */
    fadeIn (duration, callback) {
      Array.from(this).forEach(element => {
        fade(element, 0, 1, duration || DURATION.DEFAULT, callback)
      })

      return this
    },

    /**
     * Fade the elements in the current collection out; optionally
     * takes the fade duration and a callback that gets executed
     * on each element after the animation finished
     * @param  {Number|undefined} duration
     * @param  {Function|undefined} callback
     * @return {this}
     */
    fadeOut (duration, callback) {
      Array.from(this).forEach(element => {
        fade(element, 1, 0, duration || DURATION.DEFAULT, callback)
      })

      return this
    },

    ////////////
    // Events //
    ////////////

    /**
     * Bind event listeners to all elements in the current collection,
     * optionally delegated to a target element specified as 2nd argument
     * @param  {String} type
     * @param  {Function|String} target
     * @param  {Function|undefined} callback
     * @return {this}
     */
    on (type, target, callback) {
      const handler = callback
        ? function (event) {
          if (event.target.matches(target)) {
            callback.call(this, event)
          }
        }
        : target

      Array.from(this).forEach(element => {
        const events = eventMap.get(element) || eventMap.set(element, {}).get(element)

        events[type] = events[type] || []
        events[type].push(handler)
        element.addEventListener(type, handler)
      })

      return this
    },

    /**
     * Remove event listeners from the elements in the current
     * collection; if no handler is specified, all listeners of
     * the given type will be removed
     * @param  {String} type
     * @param  {Function|undefined} callback
     * @return {this}
     */
    off (type, callback) {
      Array.from(this).forEach(element => {
        const events = eventMap.get(element)
        const callbacks = events && events[type]

        if (callback) {
          element.removeEventListener(type, callback)

          if (callbacks) {
            events[type] = callbacks.filter(current => current !== callback)
          }
        } else if (callbacks) {
          delete events[type]

          callbacks.forEach(callback => {
            element.removeEventListener(type, callback)
          }) 
        }
      })

      return this
    },

    /**
     * Dispatch new Event from the elements in the current
     * collection
     * @param {String} type
     * @param {Object} params
     * @return {this}
     */
    dispatch (type, params={cancelable: true, bubbles: true}) {
      Array.from(this).forEach(element => {
        if (type instanceof CustomEvent) {
          element.dispatchEvent(type)
        } else {
          element.dispatchEvent(new Event(type, params))
        }
      })

      return this
    },

    ///////////////////
    // Miscellaneous //
    ///////////////////

    /**
     * Execute a funtion on each element in the current collection
     * @param  {Function} fn
     * @return {this}
     */
    each (fn) {
      Array.from(this).forEach(element => {
        fn(element)
      })

      return this
    },

    /**
     * Create HTML tag at the document
     * @param {String} tag
     * @return {Object}
     */
    create (tag) {
      return Object.create(prototype).add(document.createElement(tag))
    }
  }
  
  /**
   * Create a new collection
   * @param  {String} selector
   * @param  {HTMLElement|undefined} context
   * @return {Object}
   */
  return function createCollection (selector, context) {
    const initial = typeof selector === TYPE.STRING
      ? (context || document).querySelectorAll(selector)
      : selector

    const instance = Object.create(prototype)

    return initial 
      ? instance.add(initial)
      : instance
  }
})()