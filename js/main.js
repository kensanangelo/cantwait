
function playTimers(dateEvents) {
  function loop() {
    var counterElement = document.querySelector("#output .alert"),
        currentTime = new Date(), // Now
        ratio = round(currentTime - dateEvents[0], -3) / (dateEvents[dateEvents.length - 1] - dateEvents[0]),
        counters = [];

    updateProgressBar(document.querySelector("#output .progress"), ratio);

    removeAllChildren(counterElement);
    counterElement.appendChild(buildTimerList(dateEvents, currentTime));

    forEach(["alert-warning", "alert-success", "alert-info"], function (element) {
      counterElement.classList.remove(element);
    });

    counterElement.classList.add(
      ratio <  0.0 ? "alert-warning" :
      ratio >= 1.0 ? "alert-success" :
                     "alert-info"
    );
  }

  loop();

  document.dispatchEvent(new CustomEvent("timerStarted", {
    detail: {
      newIntervalId: window.setInterval(loop, 1000)
    }
  }));
}

function controller(events) {

  var errorsElement  = document.querySelector("#errors"),
      markersElement = document.querySelector(".markers"),
      outputElement  = document.querySelector("#output");

  removeAllChildren(markersElement);
  removeAllChildren(errorsElement);

  hide(errorsElement);
  hide(outputElement);

  forEach(document.querySelectorAll("#events .form-group"), function (element) {
    element.classList.remove("has-error");
  });

  var dateEvents = makeDateEvents(events);

  if(!isValid(dateEvents)) {
    errorsElement.appendChild(buildList(dateEvents.errors.messages));
    forEach(dateEvents.errors.indices, function (index) {
      document.querySelector("#events .form-group:nth-child(" + (index + 1) + ")").classList.add("has-error");
    });
    show(errorsElement);
    hide(outputElement);
  }
  else {
    if(dateEvents.dateEvents.length >= 2) {
      show(outputElement);
      playTimers(dateEvents.dateEvents);

      hide(errorsElement);

      // Creates the circled markers above the progress bar
      forEach(dateEvents.dateEvents, function (element, index, array) {
        var newMarker = stringToElement(render(getTemplate("marker"), {
          index: index + 1,
          left:  100 * (element - array[0]) / (array[array.length - 1] - array[0]) + "%"
        }));
        markersElement.appendChild(newMarker);
      });
    }
  }
}

// EVENT HANDLERS
// --------------

// Stops the previous timer when a new one is started
document.addEventListener("timerStarted", function (e) {
  if(typeof currentIntervalId !== "undefined")
    clearInterval(currentIntervalId);
  currentIntervalId = e.detail.newIntervalId;
});

// The user submitted the form for computation
document.querySelector("#form").addEventListener("submit", function (e) {
  e.preventDefault();

  var events = map(document.querySelectorAll("#events input"), function (element) {
    return element.value;
  });

  history.pushState({
    events: events
  }, document.title, "?" + map(events, function (element) {
    return "e=" + encodeURIComponent(element);
  }).join("&"));

  controller(events);
});

// The user moved into the history of the browser
window.addEventListener("popstate", function (e) {
  if(e.state === null)
    return;

  var events = e.state.events;

  removeAllChildren(document.querySelector("#events"));

  forEach(createEventInputs(events), function (element) {
    document.querySelector("#events").appendChild(element);
  });

  controller(events);
});

// The user requested the addition of a new event input to the form
document.querySelector("#addEvent").addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector("#events").appendChild(newEventInput(
    "",
    document.querySelector("#events").children.length + 2,
    true
  ));
  show(document.querySelectorAll("#form .close"));
});

// The user deleted an event input from the form
document.addEventListener("eventDeleted", function () {
  forEach(document.querySelectorAll("#form label"), function (element, index) {
    element.textContent = index + 1;
  });

  if (document.querySelector("#events").children.length <= 2)
    hide(document.querySelectorAll("#form .close"));
});

var currentIntervalId;

var events = map(window.location.search.substring(1).split("&"), function (element) {
  var pair = element.split("="),
      key = decodeURIComponent(pair[0]),
      val = decodeURIComponent(pair[1]);
  return key === "e" ? val : null;
}).filter(function (element) { return element !== null; });

history.replaceState({
  events: events,
}, document.title);

forEach(createEventInputs(events), function (element) {
  document.querySelector("#events").appendChild(element);
});

controller(events);
