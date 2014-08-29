
function controller(events) {
  var errorsElement  = document.querySelector("#errors"),
      markersElement = document.querySelector(".markers"),
      outputElement  = document.querySelector("#output"),
      inputsElement  = document.querySelector("#events"),
      dateEvents     = makeDateEvents(events),
      errors         = checkForErrors(dateEvents);

  removeAllChildren(markersElement);
  removeAllChildren(errorsElement);

  hide(errorsElement);
  hide(outputElement);

  forEach(inputsElement.querySelectorAll(".form-group"), function (inputElement) {
    inputElement.classList.remove("has-error");
  });

  if(errors.messages.length > 0) {
    forEach(errors.eventNumbers, function (number) {
      inputsElement.querySelector(".form-group:nth-child(" + number + ")").classList.add("has-error");
    });
    errorsElement.appendChild(buildList(errors.messages));
    show(errorsElement);
  }
  else if(dateEvents.length >= 2) {
    // Creates the circled markers above the progress bar
    forEach(makeEventMarkers(dateEvents), function (marker) {
      markersElement.appendChild(marker);
    });

    document.dispatchEvent(new CustomEvent("timerStarted", {
      detail: {
        newIntervalId: setIntervalAndCall(function () {
          updateOutput(document.querySelector("#output"), now(), dateEvents);
        }, 1000)
      }
    }));

    show(outputElement);
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
