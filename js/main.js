var uriParameters = function () {
  var params = {},
      vars = window.location.search.substring(1).split("&");

  for (var i = 0; i < vars.length; ++i) {
    var pair = vars[i].split("="),
        key = decodeURIComponent(pair[0]),
        val = decodeURIComponent(pair[1]);

    if (typeof params[key] === "undefined")
      params[key] = [val];
    else
      params[key].push(val);
  }
    return params;
} ();

function showOutput() {
  document.querySelector('#output').classList.remove("hidden");
}

function hideOutput() {
  document.querySelector('#output').classList.add("hidden");
}

/**
 * Build a HTML <ul> list for each string of an array
 *
 * @param   {String[]} array  The elements to be used
 * @returns {String}          The built <ul> list
 */
function buildList(array) {
  return "<ul>" + array.reduce(function(previousValue, currentValue, index, array){
    return previousValue + "<li>" + currentValue + "</li>\n";
  }, "") + "</ul>";
}

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

function computeProgressBar(ratio) {
  ratio = Math.min(Math.max(0.0, ratio), 1.0);

  var progress    = document.querySelector("#output .progress"),
      progressBar = document.querySelector("#output .progress-bar"),
      value = round(100 * ratio, 2);
  document.querySelector("#output .value").innerHTML =  value + " %";
  progressBar.style.width = (100 * ratio) + "%";
  progressBar.setAttribute("aria-valuenow", value);

  if(ratio === 1.0) {
    progress.classList.remove("active");
    progressBar.classList.add("progress-bar-success");
  }
  else {
    progress.classList.add("active");
    progressBar.classList.remove("progress-bar-success");
  }
}

function playTimers() {
  function loop() {
    var currentTime = new Date();

    var ratio = round(currentTime - dateEvents[0], -3) / (dateEvents[dateEvents.length - 1] - dateEvents[0]);
    computeProgressBar(ratio);

    var counters = [];
    forEach(dateEvents, function(element, index) {
      counters.push(render(currentTime >= element ? "pastEvent" : "futureEvent", {
        index: index + 1,
        time: prettyPrintDelta(round(Math.abs(currentTime - element) / 1000))
      }));
    });
    document.querySelector("#output .alert").innerHTML = buildList(counters);

    var alertClasses = document.querySelector("#output .alert").classList;

    forEach(["alert-warning", "alert-success", "alert-info"], function(element) {
      alertClasses.remove(element);
    });

    alertClasses.add(
      ratio <  0.0 ? "alert-warning" :
      ratio >= 1.0 ? "alert-success" :
                     "alert-info"
    );
  }

  loop();
  window.setInterval(loop, 1000);
}

/**
 * Renders a set of data inside a template
 *
 * @param   {String} templateId  The name that will be used to fetch the template content from the HTML markup
 * @param   {Object} data        The set of data to be used. Keys must exist with format {{key}} to be used in the template
 * @returns {String}             The template after rendering the data
 */
function render(templateId, data) {
  var template = document.querySelector("#template-" + templateId).innerHTML;
  for (var key in data)
    template = template.replace(new RegExp('{{' + key + '}}', 'g'), data[key]);
  return template;
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
 * Generic usage of Array.prototype.forEach that can also be used on NodeList elements.
 *
 * @param {(*[]|NodeList)} elements  The elements to be processed
 * @param {} callback                Function to execute for each element
 */
function forEach(elements, callback) {
  [].forEach.call(elements, callback);
}

/**
 * Generate a random identifier, random enough to be considered as unique.
 *
 * @returns {Number}  A random string (16 alphanumerical characters)
 */
function generateId() {
  return Math.random().toString(36).substr(2, 16);
}

function newEvent(value) {
  value = (typeof value === "undefined") ? "" : value;

  var eventElement = stringToElement(render("input", {
    id: generateId(),
    index: document.querySelector("#events").children.length + 1,
    value: value
  }));

  eventElement.querySelector(".close").addEventListener("click", function(evt) {
    document.querySelector("#events").removeChild(this.parentNode);

    forEach(document.querySelectorAll("#form label"), function(element, index) {
      element.innerHTML = index + 1;
    });

    if (document.querySelector("#events").children.length <= 2)
      forEach(document.querySelectorAll("#form .close"), function(element) {
        hide(element);
      });

    evt.preventDefault();
  });

  document.querySelector("#events").appendChild(eventElement);
}

function controller() {

  var errors = [];


  var box = document.querySelector("#events");
  while(box.firstChild)
    box.removeChild(box.firstChild);

  dateEvents = [];

  forEach(events, function(element) {
    dateEvents.push(new Date(element));
  });

  if(dateEvents.length < 2) {
    newEvent();
    newEvent();
  }
  else
    forEach(events, function(element) {
      newEvent(element);
    });




  if (document.querySelector("#events").children.length <= 2)
    forEach(document.querySelectorAll("#form .close"), function(element, index, array) {
      hide(element);
    });


  for (var i = 0; i < dateEvents.length; i++) {
    if (isNaN(dateEvents[i])) {
      document.querySelector(".form-group:nth-child(" + (i + 1) + ")").classList.add("has-error");
      errors.push(render("invalidEvent", {
        index: i + 1
      }));
    }
  }

  for (var i = 0; i < dateEvents.length - 1; i++) {
    if (!isNaN(dateEvents[i]) && !isNaN(dateEvents[i + 1]) && dateEvents[i] >= dateEvents[i + 1]) {
      document.querySelector(".form-group:nth-child(" + (i + 1) + ")").classList.add("has-error");
      document.querySelector(".form-group:nth-child(" + (i + 2) + ")").classList.add("has-error");
      errors.push(render("predatedEvent", {
        index1: i + 1,
        index2: i + 2
      }));
    }
  }

  forEach(dateEvents, function(element, index, array) {
    var newMarker = stringToElement(render("marker", {
      index: index + 1,
      left:  100 * (element - array[0]) / (array[array.length - 1] - array[0]) + "%"
    }));
    document.querySelector(".markers").appendChild(newMarker);
  });



  if(events.length >= 2 && errors.length === 0) {
    showOutput();
    playTimers();
      document.querySelector("#errors").innerHTML = "";
      hide(document.querySelector('#errors'));
  }
  else {
    hideOutput();
    // stopTimers();
    if(events.length >= 2) {
      document.querySelector("#errors").innerHTML = buildList(errors);
      show(document.querySelector('#errors'));
    }
  }

}

var dateEvents = [];
var events = (typeof uriParameters['e'] !== "undefined") ? uriParameters['e'] : [];

controller();


document.querySelector("#form").addEventListener("submit", function(e) {
  e.preventDefault();


  events = [];

  forEach(document.querySelectorAll("#events input"), function(element) {
    events.push(element.value);
  });



  history.pushState(events, document.title, "?" + events.map(function(element) {
    return "e=" + encodeURIComponent(element);
  }).join("&"));

  controller();
  // Mettre à jour l'URL

});

/**
 * Displays a non-visible HTML element
 *
 * @param {Element} element The HTML element to show
 */
function show(element) {
  element.classList.remove("hidden");
}

/**
 * Hides an HTML element
 *
 * @param {Element} element The HTML element to show
 */
function hide(element) {
  element.classList.add("hidden");
}

document.querySelector("#addEvent").addEventListener("click", function(e) {
  newEvent();

  if (document.querySelector("#events").children.length > 2)
    forEach(document.querySelectorAll("#form .close"), function(element) {
      show(element);
    });

  e.preventDefault();
});
