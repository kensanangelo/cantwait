function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
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

function fillTimers(ratio, str) {
  document.getElementById("progressValue").innerHTML = (Math.round(100 * ratio * 100) / 100) + '&nbsp;%';
  document.getElementById('progressBar').setAttribute("style","width: " + (100 * ratio) + "%");
  document.getElementById('progressBar').setAttribute("aria-valuenow", 100 * ratio);

  document.getElementById("eta").innerHTML = str;

  if(ratio == 1.0) {
    document.getElementById("progress").className = document.getElementById("progress").className.replace(/\bactive\b/,'');
    document.getElementById("progressBar").className = document.getElementById("progressBar").className.replace(/\b progress-bar-[a-z]*\b/,'');
    document.getElementById("progressBar").className += " progress-bar-success";

    document.getElementById("eta").className = document.getElementById("eta").className.replace(/\b alert-[a-z]*\b/,'');
    document.getElementById("eta").className += " alert-success";
  }

}

function playTimers() {
  function loop() {
    var currentTime = new Date();

    var str,
        ratio;

    var delta,
        days,
        hours,
        minutes,
        seconds;

    if(nextTime < currentTime) {
      str = "Time is up!";
      ratio = 1.0;
    }
    else {
      delta   = Math.round((nextTime - currentTime) / 1000);
      days    = Math.floor(delta / 86400);
      hours   = Math.floor(delta / 3600) % 24;
      minutes = Math.floor(delta / 60) % 60;
      seconds = delta % 60;

      str = "";
      if(delta >= 86400) str += days + " day" + (days != 1 ? 's' : '') + ', ';
      if(delta >= 3600)  str += hours + " hour" + (hours != 1 ? 's' : '') + ', ';
      if(delta >= 60)    str += minutes + " minute" + (minutes != 1 ? 's' : '') + ' and ';
      str += seconds + " second" + (seconds != 1 ? 's' : '') + ' remaining.';

      ratio = (currentTime - lastTime) / (nextTime - lastTime);
    }

    fillTimers(ratio, str);
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
