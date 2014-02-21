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
