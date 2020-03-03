var tape = {
    head_at: 0,
    contents: [],

    load: function(contents) {
        contents = contents.replace(/\s/, "_");
        this.contents = contents.split("");
        this.seek(0, true);
    },

    write: function(value, render) {
        this.extend_to(this.head_at);
        this.contents[this.head_at] = value;
        if (render) {
            this.render();
        }
    },

    read: function() {
        this.extend_to(this.head_at);
        var value = this.contents[this.head_at] || "_";
        return value;
    },

    left: function(render) {
        this.head_at--;
        this.extend_to(this.head_at);
        if (render) {
            this.render();
        }
    },

    right: function(render) {
        this.head_at++;
        this.extend_to(this.head_at);
        if (render) {
            this.render();
        }
    },

    seek: function(position, render) {
        this.head_at = position;
        if (render) {
            this.render();
        }
    },

    render: function() {
        var cells = [];
        for (var i = 0; i < this.contents.length; i++) {
            var cell = $("<span class='cell'></span>");
            cell.text(this.contents[i]);
            if (this.head_at === i) {
                cell.addClass("head");
            }
            cells.push(cell);
        }
        $("#tape").children().remove();
        $("#tape").append(cells);

        var movement = $('.movement select').val();
        $("#tape").removeClass("move-head");
        switch (movement) {
            case "static":
                break;
            case "head":
                $("#tape").addClass("move-head");
                var returned = (this.head_at * 66) + 33;
                $("#tape").scrollLeft(returned);
                break;
            case "necessary":
                var returned = (this.head_at * 66) + 33;
                $("#tape").scrollLeft(returned);
                break;
            case "left":
                $("#tape").scrollLeft(0);
                break;
            case "right":
                $("#tape").scrollLeft($("#tape")[0].scrollWidth);
                break;
        }


    },

    /**
     * Extend the size of the tape to ensure that the head can point at index
     **/
    extend_to: function(index) {
        if (index === 0 && this.contents.length === 0) {
            this.contents.push("_");
            return;
        }
        while (index < 0 ) {
            this.contents.splice(0, 0, '_');
            index++;
            this.head_at++;
        }
        while (index >= this.contents.length) {
            this.contents.push('_');
        }
    }
};

function parse_transitions(code) {

  var lines = code.split(/\r\n|\r|\n|\n\r/);

  var templates = [];
  var transitions = [];

  for (var i = 0; i < lines.length; i++) {

    var line = lines[i].trim();

    // Search for a comment and remove if necessary.
    var comment_pos = line.search("//");
    if (comment_pos != -1) {
      line = line.substring(0, comment_pos);
    }

    // Ignore the line if it is empty.
    if (line.length === 0) {
      continue;
    }

/*
    var mode = "init";
    for (var pos = 0; pos < line.length;) {

      switch (mode) {
        case "init": {

          if (line[pos] == "<") {
            mode = "template_params";
          } else {
            mode = "init_state";
          }
          
          break;
        }

        case ""
      }      
      
    }*/

    // Split into components.
    var components = line.split(" ");

    // Remove any empty string components (created if multiple spaces appear between two components).
    var index;
    while ((index = components.indexOf("")) != -1) {
      components.splice(index, 1);
    }

    transitions.push({
      init_state: components[0],
      read_symbol: components[1],
      write_symbol: components[2],
      move: components[3],
      next_state: components[4]
    });
    
  }

  return transitions;

}

var machine = {
    pause: true,
    states: {},
    start_state: null,
    halting_states: [],
    name: null,
    current_state: null,
    current_state_name: null,
    step: 0,

    play: function(render) {
        machine.transition(tape.read(), render);
        var delay = parseInt($('.speed select').val());
        delay = Math.max(delay, 0);
        setTimeout(function() {
            if(!machine.pause) {
                machine.play(render);
            }
        }, delay);
    },

    hard_reset: function() {
        this.states = {};
        this.start_state = null;
        this.halting_states = [];
        this.name = null;
        this.soft_reset();
    },

    soft_reset: function() {
        this.current_state = this.states[this.start_state];
        this.current_state_name = this.start_state;
        this.step = 0;
    },

    compile: function(code, start_state) {
        this.hard_reset();
        var transitions = parse_transitions(code);

        for (var i = 0; i < transitions.length; i++) {
          var transition = transitions[i];

          if (!this.states[transition.init_state]) {
            this.states[transition.init_state] = {};
          }
          
          this.states[transition.init_state][transition.read_symbol] = {write: transition.write_symbol, state: transition.next_state, move: transition.move};
        }

        this.start_state = start_state;
        this.halting_states = [ "halt" ];
        
        this.current_state_name = this.start_state;
        this.current_state = this.states[this.start_state];
        this.render();
    },

    transition: function(input, render) {
        if (this.halting_states.indexOf(this.current_state_name) !== -1) {
            tape.render();
            this.render();
            $(".tape-container").removeClass("loading");
            value = 0;
            this.pause = true;
            messages.success("Halted!", true);
            // Don't do anything, we're in a halting state, there's nowhere to go
            return;
        }
        var instructions = this.current_state[input];
        if (!instructions) {
            messages.error("Error no transition from " + this.current_state_name + " reading " + input);
            machine.pause = true;
        } else {
            this.current_state_name = instructions.state;
            this.current_state = this.states[instructions.state];
            tape.write(instructions.write, render);
            switch (instructions.move) {
                case ">":
                    tape.right(render);
                    break;
                case "<":
                    tape.left(render);
                    break;
            }
            this.step++;
            if (render) {
                this.render();
            }
        }
    },

    render: function() {
        $("#machine-name").text(this.name || "Unnamed");
        $("#machine-description").text(this.description || "");
        $("#machine-state").text(this.current_state_name || "No state");
        $("#machine-step").text(this.step);
    }
};

$(document).ready(function() {
    $('.ui.dropdown.speed').dropdown();
    $('.ui.dropdown.movement').dropdown();

    $('.action.load-tape').click(function() {
        tape.load($("#tape-input").val(), true);
        machine.soft_reset();
        machine.render();
    });

    $('#play').click(function() {
        var render = parseInt($('.speed select').val()) !== -1;
        machine.pause = false;
        machine.play(render);
        if (!render) {
            $(".tape-container").addClass("loading");
        }
    });

    $('#pause').click(function() {
        machine.pause = true;
        machine.render();
        tape.render();
        $(".tape-container").removeClass("loading");
    });

    $('#stop').click(function() {
        if (!machine.pause) {
            machine.pause = true;
        } else {
            tape.load("", true);
            machine.soft_reset();
            machine.render();
            tape.render();
        }
        $(".tape-container").removeClass("loading");
    });

    $('#step').click(function() {
        machine.transition(tape.read(), true);
    });
});
