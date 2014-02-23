// COLLECTION HELPERS
// ------------------

/**
 * Generic usage of Array.prototype.forEach that can also be used on NodeList elements.
 *
 * @param {(*[]|NodeList)} elements  The elements to be processed
 * @param {}               callback  Function to execute for each element
 */
function forEach(elements, callback) {
  [].forEach.call(elements, callback);
}

/**
 * Generic usage of Array.prototype.map that can also be used on NodeList elements.
 *
 * @param {(*[]|NodeList)} elements  The elements to be processed
 * @param {}               callback  Function to execute for each element
 * @return *[]                       The mapped array
 */
function map(elements, callback) {
  return [].map.call(elements, callback);
}

// MATH HELPERS
// ------------

/**
 * Decimal adjustment of a number.
 * Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Example:_Decimal_rounding
 *
 * @param   {(Number|String)} value    The number.
 * @param   {Number}          [exp=0]  The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number}                   The adjusted value.
 */
function round(value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value);

  value = +value;
  exp   = +exp;

  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
    return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

// STRING HELPERS
// --------------

/**
 * Generate a random identifier, random enough to be considered as unique.
 *
 * @returns {String}  A random string (16 alphanumerical characters)
 */
function generateRandomString() {
  return Math.random().toString(36).substr(2, 8);
}

// DOM HELPERS
// -----------

/**
 * Displays a non-visible HTML element (mutable function)
 *
 * @param {(Element|Element[]|NodeList)} elements  The HTML element(s) to show
 */
function show(elements) {
  if(typeof elements.length === "undefined")
    elements.classList.remove("hidden");
  else
    forEach(elements, function(element) {
      show(element);
    });
}

/**
 * Hides an HTML element (mutable function)
 *
 * @param {(Element|Element[]|NodeList)} elements  The HTML element(s) to hide
 */
function hide(elements) {
  if(typeof elements.length === "undefined")
    elements.classList.add("hidden");
  else
    forEach(elements, function(element) {
      element.classList.add("hidden");
    });
}

/**
 * Removes all children ofa given HTML element (mutable function)
 *
 * @param {Element} element  The element to empty
 */
function removeAllChildren(element) {
  while(element.firstChild)
    element.removeChild(element.firstChild);
}

/**
 * Transforms a string-based HTML element into a native HTML element where DOM API applies
 *
 * @param   {String}  str  A string containing an HTML element
 * @returns {Element}      An HTML element
 */
function stringToElement(str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  return div.firstElementChild;
}

/**
 * Build a HTML <ul> list for each string of an array
 *
 * @param   {String[]} array  The elements to be used
 * @returns {Element}         The built <ul> list
 */
function buildList(array) {
  return stringToElement("<ul>" + array.reduce(function(previousValue, currentValue, index, array){
    return previousValue + "<li>" + currentValue + "</li>";
  }, "") + "</ul>");
}

// TEMPLATING SYSTEM
// -----------------

/**
 * Returns a template based on his Id
 * @param   {String} templateId  The name that will be used to fetch the template content from the HTML markup
 * @returns {String}             The unrendered template
 */
function getTemplate(templateId) {
  return document.querySelector("script#template-" + templateId).textContent;
}

/**
 * Renders a set of data inside a template
 *
 * @param   {String} template  The unrendered template
 * @param   {Object} data      The set of data to be used. Keys must exist with format {{key}} to be used in the template
 * @returns {String}           The template after rendering the data
 */
function render(template, data) {
  for (var key in data)
    template = template.replace(new RegExp('{{' + key + '}}', 'g'), data[key]);
  return template;
}

// CANTWAIT FUNCTIONS
// ------------------

/**
 * Transforms a number of seconds into a human-readable (if this human reads English) string.
 * It will show weeks, days, minutes and seconds in a way the the first unit will not be a zero
 *
 * @param   {Number} delta  The number of seconds to compute
 * @returns {String}        The human-readable string
 */
function prettyPrintDelta(delta) {
  var weeks   = Math.floor(delta / 604800),
      days    = Math.floor(delta / 86400) % 7,
      hours   = Math.floor(delta / 3600) % 24,
      minutes = Math.floor(delta / 60) % 60,
      seconds = delta % 60;

  var output = "";
  if(delta >= 604800) output += weeks   + " week"   + (weeks != 1 ? 's' : '')   + ', ';
  if(delta >= 86400)  output += days    + " day"    + (days != 1 ? 's' : '')    + ', ';
  if(delta >= 3600)   output += hours   + " hour"   + (hours != 1 ? 's' : '')   + ', ';
  if(delta >= 60)     output += minutes + " minute" + (minutes != 1 ? 's' : '') + ' and ';
                      output += seconds + " second" + (seconds != 1 ? 's' : '');
  return output;
}


function newEventInput(value, index, showCloseBtn) {
  var eventElement = stringToElement(render(getTemplate("input"), {
    id: generateRandomString(),
    index: index,
    value: value
  }));

  eventElement.querySelector(".close").addEventListener("click", function (evt) {
    evt.preventDefault();
    eventElement.remove();
    document.dispatchEvent(new Event("eventDeleted"));
  });

  if(!showCloseBtn)
    hide(eventElement.querySelector(".close"));

  return eventElement;
}
