var messages = {
    message: function(state, header, body, auto_hide) {
        var m = $("<div></div>", {"class": "ui mini message"}),
            i = $("<i></i>", {"class": "close icon"}),
            h = $("<div></div>", {"class": "header"}),
            b = $("<p></p>");

        b.text(body);
        h.text(header);

        m.addClass(state);
        m.append(i);
        m.append(h);
        m.append(b);

        m.click(function() {
            m.transition('fade');
        });

        if (auto_hide) {
            setTimeout(function() {
                m.transition('fade');
            }, 2000);
        }

        $(".errors").append(m);
    },

    info: function(msg, auto_hide) {
        messages.message("info", "FYI", msg, auto_hide);
        machine.pause = true;
    },

    error: function(msg, auto_hide) {
        messages.message("red", "Something went wrong!", msg, auto_hide);
    },

    success: function(msg, auto_hide) {
        messages.message("green", "Yay!", msg, auto_hide);
    }
};
