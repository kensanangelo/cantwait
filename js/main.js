function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex   = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function hideTimers() {
  document.getElementById('timers').className += " hidden";
}

function setError(error) {
  var errorDiv = document.getElementById('error');
  errorDiv.className = errorDiv.className.replace(/\bhidden\b/,'');
  errorDiv.innerHTML = error;
}

function isInvalidDate(d) {
  return isNaN(d);
}

function isTooEarly(d) {
  return d < new Date();
}

function checkDates(d1, d2) {
  return !(isInvalidDate(d1) || isInvalidDate(d2) || d1 >= d2);
}

function prettyPrintDelta(delta) {
  var days    = Math.floor(delta / 86400),
      hours   = Math.floor(delta / 3600) % 24,
      minutes = Math.floor(delta / 60) % 60,
      seconds = delta % 60;

  var output = "";
  if(delta >= 86400) output += days    + " day"    + (days != 1 ? 's' : '')    + ', ';
  if(delta >= 3600)  output += hours   + " hour"   + (hours != 1 ? 's' : '')   + ', ';
  if(delta >= 60)    output += minutes + " minute" + (minutes != 1 ? 's' : '') + ' and ';
                     output += seconds + " second" + (seconds != 1 ? 's' : '');
  return output;
}

function fillTimers(ratio, str) {
  var progress = document.getElementById("progress"),
      progressBar = document.getElementById("progressBar"),
      eta         = document.getElementById("eta");

  document.getElementById("progressValue").innerHTML = (Math.floor(100 * ratio * 100) / 100) + '&nbsp;%';
  progressBar.setAttribute("style","width: " + (100 * ratio) + "%");
  progressBar.setAttribute("aria-valuenow", 100 * ratio);

  eta.innerHTML = str;

  if(ratio == 1.0) {
    progress.className    = progress.className.replace(/\bactive\b/,'');
    progressBar.className = progressBar.className.replace(/\b progress-bar-[a-z]*\b/,'');
    progressBar.className += " progress-bar-success";

    eta.className = eta.className.replace(/\b alert-[a-z]*\b/,'');
    eta.className += " alert-success";
  }

}

function playTimers() {
  function loop() {
    var currentTime = new Date(),
        delta = Math.round(Math.abs(nextTime - currentTime) / 1000);

    if(nextTime < currentTime)
      fillTimers(1.0, "It already happened " + prettyPrintDelta(delta) + " ago!");
    else
      fillTimers((currentTime - lastTime) / (nextTime - lastTime),
                 prettyPrintDelta(delta) + " remaining..."
      );
  }

  loop();
  window.setInterval(loop, 1000);
}


var lt = getParameterByName('lt');
var nt = getParameterByName('nt');

var lastTime,
    nextTime;

if(lt == "" && nt == "") {
  hideTimers();
}
else {
  document.getElementById('lastTime').value = lt;
  document.getElementById('nextTime').value = nt;

  lastTime = new Date(lt);
  nextTime = new Date(nt);

  if(!checkDates(lastTime, nextTime)) {
    hideTimers();

    if(isInvalidDate(lastTime) && isInvalidDate(nextTime))
      setError("Both dates are invalid.");
    else if(isInvalidDate(lastTime))
      setError("Last date is invalid.");
    else if(isInvalidDate(nextTime))
      setError("Next date is invalid.");
    else if(nextTime <= lastTime)
      setError("Last date should be prior to next date.");
    else if(isTooEarly(lastTime))
      setError("Last date should be in the past.")
  }
  else
    playTimers();
}
