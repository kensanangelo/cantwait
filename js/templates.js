var templates = {
   input: '<div class="form-group">' +
            '<label for="event-{{id}}" class="control-label circle">{{eventNumber}}</label>' +
            '<input type="datetime" class="form-control" id="event-{{id}}" name="e" value="{{value}}" placeholder="yyyy-mm-ddThh:mm:ss±hh:mm">' +
            '<button type="button" class="close delete-event" aria-hidden="true" title="Delete this event">&times;</button>' +
          '</div>',

    marker: '<span class="circle" style="left: {{left}}">{{eventNumber}}</span>',

    invalidEvent: '<span class="circle">{{eventNumber}}</span> must be a valid date.',

    predatedEvent: '<span class="circle">{{eventNumber1}}</span> must happen before <span class="circle">{{eventNumber2}}</span>.',

    pastEvent: '<span class="circle">{{eventNumber}}</span> happened {{time}} ago.',

    futureEvent: '<span class="circle">{{eventNumber}}</span> will happen in {{time}}.'
  };
