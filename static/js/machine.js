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
        var returned = (this.head_at * 66) + 33;
        $("#tape").scrollLeft(returned);
    },

    /**
     * Extend the size of the tape to ensure that the head can point at index
     **/
    extend_to: function(index) {
        if (index === 0 && this.contents.length === 0) {
            this.contents.push("_");
            return;
        }
        while (index < 0) {
            this.contents.splice(0, 0, '_');
            index++;
            this.head_at++;
        }
        while (index >= this.contents.length) {
            this.contents.push('_');
        }
    }
};

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

    compile: function(code) {
        this.hard_reset();
        var lines = code.split(/\r\n|\r|\n|\n\r/);
        for (var i = 0; i < lines.length; i++) {
            var raw_line = lines[i];
            var line = raw_line.replace(/\s+/g, '');
            if (line.indexOf('//') === 0 || line.length === 0) {
                continue;
            }
            if (line.indexOf('start:') === 0) {
                this.start_state = line.split(":").pop();
            } else if (line.indexOf('halt:') === 0){
                this.halting_states = line.split(":").pop().split(",");
            } else if (line.indexOf('name:') === 0) {
                this.name = raw_line.split(':').slice(1).join(":").trim();
            } else if (line.indexOf('description:') === 0) {
                this.description = raw_line.split(':').slice(1).join(":").trim();
            } else {
                var transition = line.split(","),
                    from = transition[0],
                    read = transition[1],
                    to = transition[2],
                    write = transition[3],
                    move = transition[4];
                if (!this.states[from]) {
                    this.states[from] = {};
                }
                if (!this.states[to]) {
                    this.states[to] = {};
                }
                this.states[from][read] = {write: write, state: to, move: move};
            }
            this.current_state_name = this.start_state;
            this.current_state = this.states[this.start_state];
        }
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
