var templates = {
   input: '<div class="form-group">' +
            '<label for="event-{{id}}" class="control-label circle">{{index}}</label>' +
            '<input type="datetime" class="form-control" id="event-{{id}}" name="e" value="{{value}}" placeholder="yyyy-mm-ddThh:mm:ss±hh:mm">' +
            '<button type="button" class="close delete-event" aria-hidden="true">&times;</button>' +
          '</div>',

    marker: '<span class="circle" style="left: {{left}}">{{index}}</span>',

    invalidEvent: '<span class="circle">{{index}}</span> must be a valid date.',

    predatedEvent: '<span class="circle">{{index1}}</span> must happen before <span class="circle">{{index2}}</span>.',

    pastEvent: '<span class="circle">{{index}}</span> happened {{time}} ago.',

    futureEvent: '<span class="circle">{{index}}</span> will happen in {{time}}.'
  };
