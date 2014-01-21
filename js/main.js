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

function hideTimers() {
  document.getElementById('timers').classList.add("hidden");
}

function displayErrors(error) {
  var errorDiv = document.getElementById('error');
  errorDiv.classList.remove("hidden");
  errorDiv.innerHTML =  "<ul>" + errors.reduce(function(previousValue, currentValue, index, array){
    return previousValue + "<li>" + currentValue + "</li>\n";
  }, "") + "</ul>";
}

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

function fillTimers(ratio, str) {
  var eta = document.getElementById("eta");

  eta.innerHTML = str;
  eta.classList.remove("alert-warning");
  eta.classList.remove("alert-success");
  eta.classList.remove("alert-info");

  if(ratio < 0.0)
    eta.classList.add("alert-warning");
  else if(ratio >= 1.0)
    eta.classList.add("alert-success");
  else
    eta.classList.add("alert-info");
}

function computeProgressBar(ratio) {
  ratio = Math.min(Math.max(0.0, ratio), 1.0);

  var progress    = document.getElementById("progress"),
      progressBar = document.getElementById("progressBar");

  document.getElementById("progressValue").innerHTML = (Math.round(100 * ratio * 100) / 100) + ' %';
  progressBar.setAttribute("style", "width: " + (100 * ratio) + "%");
  progressBar.setAttribute("aria-valuenow", 100 * ratio);

  if(ratio === 1.0) {
    progress.classList.remove("active");
    progressBar.classList.add("progress-bar-success");
  }
}

function playTimers() {
  function loop() {
    var currentTime = new Date(),
        ratio = Math.round((currentTime - dateEvents[0]) / 1000) * 1000 / (dateEvents[1] - dateEvents[0]);

    computeProgressBar(ratio);

    if(ratio < 0.0)
      fillTimers(ratio, "It will happen in " + prettyPrintDelta(Math.round((dateEvents[0] - currentTime) / 1000)) + "...");
    else if(ratio >= 1.0)
      fillTimers(ratio, "It already happened " + prettyPrintDelta(Math.round((currentTime - dateEvents[1]) / 1000)) + " ago!");
    else
      fillTimers(ratio, prettyPrintDelta(Math.round((dateEvents[1] - currentTime) / 1000)) + " remaining...");
  }

  loop();
  window.setInterval(loop, 1000);
}

function render(template, data) {
  for (var key in data)
    template = template.replace(new RegExp('{{' + key + '}}', 'g'), data[key]);
  return template;
}

function stringToElement(str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  return div.firstElementChild;
}

var events = uriParameters['e'];
var dateEvents = [];
var id = -1;
var errors = [];

if(events === undefined || events.length < 2) {
  newEvent(++id, 1);
  newEvent(++id, 2);
  events = [];
}
else
  for (var i = 0; i < uriParameters['e'].length; i++)
    newEvent(++id, i + 1, uriParameters['e'][i]);

if (document.querySelectorAll("#form .event").length <= 2)
  forEach(document.querySelectorAll("#form .close"), function(element, index, array) {
    element.classList.add("hidden");
  });

for (var i = 0; i < events.length; i++) {
  dateEvents.push(new Date(events[i]));
}


for (var i = 0; i < dateEvents.length; i++) {
  if (isNaN(dateEvents[i])) {
    document.querySelector(".form-group:nth-child(" + (i + 1) + ")").classList.add("has-error");
    errors.push("Date " + (i + 1) + " is invalid.");
  }
}

for (var i = 0; i < dateEvents.length - 1; i++) {
  if (!isNaN(dateEvents[i]) && !isNaN(dateEvents[i + 1]) && dateEvents[i] >= dateEvents[i + 1]) {
    document.querySelector(".form-group:nth-child(" + (i + 1) + ")").classList.add("has-error");
    document.querySelector(".form-group:nth-child(" + (i + 2) + ")").classList.add("has-error");
    errors.push("Event " + (i + 1) + " must happen before event " + (i + 2) + ".");
  }
}

if(events.length >= 2 && errors.length === 0)
  playTimers();
else {
  hideTimers();
  if(events.length >= 2)
    displayErrors();
}

function forEach(elements, callback) {
  [].forEach.call(elements, callback);
}

function newEvent(id, index, value) {
  value = typeof value === "undefined" ? "" : value;

  var clone = stringToElement(render(document.querySelector("#templateInput").innerHTML, {
    id: id,
    index: index,
    value: value //new Date().toUTCString()
  }));

  clone.querySelector(".close").addEventListener("click", function(evt) {
    this.parentNode.parentNode.removeChild(this.parentNode);

    forEach(document.querySelectorAll("#form label"), function(element, index, array) {
      element.innerHTML = index + 1;
    });

    if (document.querySelectorAll("#form .event").length <= 2)
      forEach(document.querySelectorAll("#form .close"), function(element, index, array) {
        element.classList.add("hidden");
      });

    evt.preventDefault();
  });

  document.querySelector("#form").insertBefore(clone, document.querySelector("#add"));
}

document.querySelector("#addEvent").addEventListener("click", function(e) {
  newEvent(++id, document.querySelectorAll("#form .event").length + 1);

  if (document.querySelectorAll("#form .event").length > 2)
    forEach(document.querySelectorAll("#form .close"), function(element, index, array) {
      element.classList.remove("hidden");
    });

  e.preventDefault();
});
