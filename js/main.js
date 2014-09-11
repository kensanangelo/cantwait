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

  cantwait(events);
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

  cantwait(events);
});

// The user requested the addition of a new event input to the form
document.querySelector("#addEvent").addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector("#events").appendChild(newEventInput(
    "",
    document.querySelector("#events").children.length + 1,
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

cantwait(events);
