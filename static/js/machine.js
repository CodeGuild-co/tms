var tape = {
    head_at: 0,
    contents: [],

    load: function(contents) {
        contents = contents.replace(/\s/, "_");
        this.contents = contents.split("");
        this.seek(0);
    },

    write: function(value) {
        this.extend_to(this.head_at);
        this.contents[this.head_at] = value;
        this.render();
    },

    read: function() {
        this.extend_to(this.head_at);
        var value = this.contents[this.head_at] || "_";
        return value;
    },

    left: function() {
        this.head_at--;
        this.extend_to(this.head_at);
        this.render();
    },

    right: function() {
        this.head_at++;
        this.extend_to(this.head_at);
        this.render();
    },

    seek: function(position) {
        this.head_at = position;
        this.render();
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

    play: function() {
        machine.transition(tape.read());
        setTimeout(function() {
            if(!machine.pause) {
                machine.play();
            }
        }, parseInt($('.speed select').val()));
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

    transition: function(input) {
        if (this.halting_states.indexOf(this.current_state_name) !== -1) {
            // Don't do anything, we're in a halting state, there's nowhere to go
            return;
        }
        var instructions = this.current_state[input];
        if (!instructions) {
            messages.error("Error no transition from " + this.current_state_name + " reading " + input);
        } else {
            this.current_state_name = instructions.state;
            this.current_state = this.states[instructions.state];
            tape.write(instructions.write);
            switch (instructions.move) {
                case ">":
                    tape.right();
                    break;
                case "<":
                    tape.left();
                    break;
            }
            this.step++;
            this.render();
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
        tape.load($("#tape-input").val());
        machine.soft_reset();
        machine.render();
    });

    $('#play').click(function() {
        machine.pause = false;
        machine.play();
    });

    $('#pause').click(function() {
        machine.pause = true;
    });

    $('#stop').click(function() {
        if (!machine.pause) {
            machine.pause = true;
        } else {
            tape.load("");
            machine.soft_reset();
            machine.render();
        }
    });

    $('#step').click(function() {
        machine.transition(tape.read());
    });
});
