var messages = {
    message: function(state, header, body) {
        var m = $("<div></div>", {"class": "ui message"}),
            i = $("<i></i>", {"class": "close icon"}),
            h = $("<div></div>", {"class": "header"}),
            b = $("<p></p>");

        b.text(body);
        h.text(header);

        m.addClass(state);
        m.append(i);
        m.append(h);
        m.append(b);

        i.click(function() {
            m.transition('fade');
        });

        $(".errors").append(m);
    },

    info: function(msg) {
        messages.message("", "", msg);
        machine.pause = true;
    },

    error: function(msg) {
        messages.message("red", "Something went wrong!", msg);
    },

    success: function(msg) {
        messages.message("green", "Yay!", msg);
    }
};
